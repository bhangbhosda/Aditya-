import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
// @ts-ignore
import mandirWatermarkImg from './assets/images/regenerated_image_1780079986161.jpg';
// @ts-ignore
import sacredShamiOnlyImg from './assets/images/shami_tree_only_1780075797981.png';
import { 
  ShoppingCart, 
  User, 
  Plus, 
  Minus, 
  Search, 
  Lock, 
  Check, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  X, 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Leaf, 
  Flame, 
  CheckCircle,
  HelpCircle,
  CreditCard,
  Building,
  MapPin,
  Smartphone,
  Info,
  Menu,
  Upload,
  Camera,
  Heart
} from 'lucide-react';
import { Product, CartItem, Order } from './types';
import { products, translations, initialOrders } from './data';

export default function App() {
  // Navigation & Localization State
  const [view, setView] = useState<'home' | 'shop' | 'product-detail' | 'checkout' | 'admin'>('home');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // E-Commerce Core States
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shami_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shami_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Selected Product (Default to first featured item)
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    products.find(p => p.id === 'shakti-dhoop-cup') || products[0]
  );
  
  // Product Detail Quantity Adjuster
  const [detailQty, setDetailQty] = useState<number>(1);
  // Selected image thumbnail index on product-detail page
  const [activeThumb, setActiveThumb] = useState<number>(0);

  // Shop Page filters
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'dhoop' | 'agarbatti' | 'havan'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Shipping details state
  const [fullName, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Interaction feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderModal, setOrderModal] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Shree Narayani Vedica Chants & Synthesizer States
  const [currentAudioMode, setCurrentAudioMode] = useState<'vocal' | 'synth'>('vocal');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // --- Shree Narayani Vedica Luxury Additions States ---
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('snv_gallery');
    if (saved) return JSON.parse(saved);
    return [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhBrh-My3za2B0pdUo9JQYnd-ulEvuuMbnHDGreqX1x7mCIDWF91aLa1QDda41dS8Fl7j6h5IQOc269Q1tKetReMODhF0lSIXFu9n7iHHdzOaIKX-S5dVRj9nyBiM3gQ2nT-ozituxntQa5pl8An8YozkFEr8Q9sO6GFUfabOJODn-_xxO10S6X6n3-cSuuJC3NY71doBWENJ0DFMDX94BzMMpRrVs6qbYefoxGVtCt_IWR1_WC-2nw6BnMO-moLxBPF6eIj4RFwpl',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhULc0kZtBmyxmhR3aRSiD6Fy8G9gvv-AUG-SdunBpoY_xjN5JAwwgCvx5KYKAIsdeJgX1jvHqHnQWJKivn6YHaRUC4zPMz58hIpuOSBA0-VVKoMFByByW1uiqA_gRjBa1MgBqNc75czcFKTUrt4FKOBp4To44A9xTRWR4a1szTh6OBa32fOVXNEaQpynJhHW69yxyKiEzACaOJB09m4iSDaeNiRVfPv0crDAaFDgBHyRNE2e5ckpxIRUUSncN8e4ehl5TWlNXgiMK',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLdFWne3bdxcmR9k7qWTg4XiIdaTj1gFtSJ4LEqSmP3_URh6Xkqnz_rXmoRtHGqnqx209SkUX482T56n9GMYqJuMzybssW8FGWS6wR-TCmRH7zYJkw3LjA2xmZdEKtOVo38R5KiaUn6hpmXFh3LaIMXmWCQ1LzOPTV-xGBB5YWeLVJPf-3v8wykiaEBNK1x591PMElYMU_wS65ZUl1o2rzCNxlnfZm2JySH1_m3XR2X6oVVK2Ru2Sfbx1RJWXdldCHMyx_gticDeIQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtvJkktzfZxLUVMbbHQwZlOnp6Yl65pqFJ0XhJYajzlaXq8ylj_K5LrKNWyUJMGJwm1IW3-GE519HhwBUEz8tdQOAc__y7itqIIjchyMThQKxTopxUCwvNgsOmDxv2tNFCOIAT25yGw7i4YTMl5YDoyBiMD5I8bn0Cy_u_oBCHb1mdu01EDVvqHl6Vuy2Y6eiK6JcugoUVaSb3kUvE-pwkNRRqCONv3ql2Ft_ulVZ0LhxdeiRqkyTj-0SHFlJXZEvgE4bdBnYVb5EC'
    ];
  });

  // Keep gallery image uploads persisted
  useEffect(() => {
    localStorage.setItem('snv_gallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  // Handle local process picture uploads
  const handleProcessImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast(lang === 'en' ? 'Please upload image under 2MB for local storage storage speed.' : 'कृपया तेज़ संचालन के लिए 2MB से कम साइज़ की इमेज अपलोड करें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalleryImages(prev => [reader.result as string, ...prev]);
        showToast(lang === 'en' ? 'Ancient Crafting Image Uploaded Successfully!' : 'प्राचीन निर्माण प्रक्रिया की तस्वीर सफलतापूर्वक सहेजी गई!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Synchronize cart changes to local storage
  useEffect(() => {
    localStorage.setItem('shami_cart', JSON.stringify(cart));
  }, [cart]);

  // Synchronize orders changes to local storage
  useEffect(() => {
    localStorage.setItem('shami_orders', JSON.stringify(orders));
  }, [orders]);

  // Translate helpers
  const t = (key: string, defaultValue?: string): string => {
    return translations[lang][key] || defaultValue || key;
  };

  // Toast builder
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Navigation smoothly with back to top
  const navigateTo = (newView: 'home' | 'shop' | 'product-detail' | 'checkout' | 'admin', targetProduct?: Product) => {
    if (targetProduct) {
      setSelectedProduct(targetProduct);
      setDetailQty(1);
      setActiveThumb(0);
    }
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to cart helper
  const handleAddToCart = (product: Product, quantityToadd: number, showFeedback = true) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantityToadd;
        return copy;
      } else {
        return [...prev, { product, quantity: quantityToadd }];
      }
    });

    if (showFeedback) {
      const msgEn = `Sacred Offering Added: ${product.name} (Qty: ${quantityToadd})`;
      const msgHi = `पवित्र भेंट जोड़ी गई: ${product.nameHi} (संख्या: ${quantityToadd})`;
      showToast(lang === 'en' ? msgEn : msgHi);
    }
  };

  // Buy Now direct trigger
  const handleBuyNow = (product: Product, quantityToadd: number) => {
    handleAddToCart(product, quantityToadd, false);
    navigateTo('checkout');
  };

  // Cart quantity controls (inside Checkout)
  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast(lang === 'en' ? 'Item removed from your cart.' : 'सामग्री आपके कार्ट से हटा दी गई है।');
  };

  // Checkout pricing values calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const gstTax = cartSubtotal > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  const shippingCharge = 0; // Free divine shipping
  const cartTotal = cartSubtotal + gstTax + shippingCharge;

  // Delivery Submission Validation & Sacred Order Placement
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = lang === 'en' ? 'Full name is required' : 'पूरा नाम भरना आवश्यक है';
    if (!phone.trim() || phone.length < 10) errors.phone = lang === 'en' ? 'Please enter a valid 10-digit phone' : 'कृपया सही 10-अंकीय फोन नंबर दर्ज करें';
    if (!address.trim()) errors.address = lang === 'en' ? 'Complete delivery address is required' : 'वितरण का पूरा पता आवश्यक है';
    if (!city.trim()) errors.city = lang === 'en' ? 'City is required' : 'शहर का नाम भरना आवश्यक है';
    if (!pincode.trim() || pincode.length < 6) errors.pincode = lang === 'en' ? 'Enter a valid 6-digit Pincode' : 'सही 6-अंकीय पिनकोड दर्ज करें';
    
    if (cart.length === 0) {
      showToast(lang === 'en' ? 'Your sacred cart is empty.' : 'आपका पवित्र कार्ट खाली है।');
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(lang === 'en' ? 'Please correct the delivery details.' : 'कृपया वितरण विवरण की त्रुटियां ठीक करें।');
      return;
    }

    setFormErrors({});
    
    // Create new order object
    const newOrder: Order = {
      id: `CN-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: fullName,
      address,
      city,
      pincode,
      phone,
      date: new Date().toISOString().split('T')[0],
      amount: cartTotal,
      items: cart.map(item => ({
        productName: item.product.name,
        productNameHi: item.product.nameHi,
        quantity: item.quantity,
        price: item.product.price
      })),
      status: 'Processing',
      statusHi: 'प्रक्रियाधीन'
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setOrderModal(true);

    // Empty state fields
    setCart([]);
    setFullname('');
    setPhone('');
    setAddress('');
    setCity('');
    setPincode('');
  };

  // Sound Synthesis & Web Audio Engine for Continuous OM Frequency Drone (harmonic cosmic frequencies)
  const startSacredChant = (mode: 'vocal' | 'synth') => {
    // Stop previous modes first
    stopAllAudio();
    setIsMuted(false);

    if (mode === 'synth') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Create elegant continuous spiritual sound wave system (low OM frequency at 136.1 Hz + harmonics)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 136.1 Hz is the cosmic frequency of OM (Sadhana Frequency)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(136.1, ctx.currentTime);

        // Harmonic overtones for premium warm spiritual luxury vibe
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(272.2, ctx.currentTime); // Octave higher

        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        oscillatorRef.current = osc1; 
        (window as any)._activeOscs = [osc1, osc2];
        gainNodeRef.current = gainNode;
      } catch (err) {
        console.error("Audio Synthesis initiation deferred: ", err);
      }
    } else {
      // Vocal Mode: peaceful choral/vocal synthesizer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Spiritual continuous deep vocal chant drone sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const biquadFilter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(85, ctx.currentTime); // Deep hum vocal male base
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(170, ctx.currentTime); // Female octave support

        biquadFilter.type = 'bandpass';
        biquadFilter.frequency.setValueAtTime(450, ctx.currentTime); // Vocal formants simulation (Ah-Ohm sound Resonance)
        biquadFilter.Q.setValueAtTime(2.5, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(biquadFilter);
        osc2.connect(biquadFilter);
        biquadFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        oscillatorRef.current = osc1;
        (window as any)._activeOscs = [osc1, osc2];
        gainNodeRef.current = gainNode;
      } catch (err) {
        console.error("Vocal Audio Synthesis deferred: ", err);
      }
    }
  };

  const stopAllAudio = () => {
    if ((window as any)._activeOscs) {
      (window as any)._activeOscs.forEach((osc: any) => {
        try { osc.stop(); } catch (e) {}
      });
      (window as any)._activeOscs = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    oscillatorRef.current = null;
    gainNodeRef.current = null;
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startSacredChant(currentAudioMode);
      showToast(lang === 'en' ? 'Sacred Chants playing at 136.1 Hz Cosmic OM' : 'दिव्य ब्रह्माण्डीय ओम तरंगें सक्रिय');
    } else {
      setIsMuted(true);
      stopAllAudio();
      showToast(lang === 'en' ? 'Sanctum Audio Muted' : 'मंत्र ध्वनि म्यूट की गई');
    }
  };

  // Turn off synth on unmount to be safe
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Filter products on listing page
  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const searchString = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchString) || p.nameHi.toLowerCase().includes(searchString);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      


      {/* Absolute Glow Atmosphere Backdrops */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      {/* Floating interactive notification toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-charcoal-gray border border-primary text-primary px-6 py-3 shadow-2xl divine-glow flex items-center gap-3 backdrop-blur-md rounded-none"
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-sans text-sm font-semibold tracking-wide uppercase">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Message */}
      <div className="bg-charcoal-gray text-center border-b border-bronze-border py-2 text-[11px] font-sans text-primary tracking-[0.25em] uppercase px-4 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          {lang === 'en' 
            ? 'FREE SANCTIFIED DELIVERY ACROSS BHARAT ON ALL RITUAL ORDERS' 
            : 'सभी अनुष्ठानिक ऑर्डरों पर पूरे भारत में मुफ्त पवित्र वितरण'}
        </span>
      </div>

      {/* Primary Sticky Luxury Header */}
      <header className="sticky top-0 z-40 bg-deep-black/85 backdrop-blur-md border-b border-bronze-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          
          {/* Brand Identity Branding logo */}
          <div className="flex items-center gap-3">
            {/* Side Menu Hamburger Button Trigger */}
            <button 
              onClick={() => setSideMenuOpen(true)}
              className="p-2 border border-bronze-border text-primary hover:border-primary transition-all bg-charcoal-gray/50 hover:bg-primary/5 cursor-pointer flex items-center justify-center mr-1"
              title="Sacred Menu & Heritage Gallery / पवित्र मेनू"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>

            <button 
              onClick={() => navigateTo('home')} 
              className="text-left focus:outline-none group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full border border-primary flex items-center justify-center group-hover:scale-105 transition-all">
                <span className="font-serif text-primary text-base font-bold">SNV</span>
              </div>
              <div>
                <h1 className="font-serif text-lg md:text-xl font-bold tracking-tight text-primary">{t('brandName')}</h1>
                <p className="text-[9px] text-on-surface-variant font-medium uppercase tracking-[0.15em] hidden sm:block">
                  {lang === 'en' ? 'Vijay & Protection' : 'विजय एवं सुरक्षा'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`font-sans text-xs uppercase tracking-widest font-bold transition-all relative py-1 ${
                view === 'home' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {t('home')}
              {view === 'home' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => navigateTo('shop')}
              className={`font-sans text-xs uppercase tracking-widest font-bold transition-all relative py-1 ${
                view === 'shop' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {t('shop')}
              {view === 'shop' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => navigateTo('product-detail', products.find(p => p.id === 'shakti-dhoop-cup'))}
              className={`font-sans text-xs uppercase tracking-widest font-bold transition-all relative py-1 ${
                view === 'product-detail' && selectedProduct?.id === 'shakti-dhoop-cup' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {t('spiritualDhoop')}
              {view === 'product-detail' && selectedProduct?.id === 'shakti-dhoop-cup' && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => {
                setCategoryFilter('havan');
                navigateTo('shop');
              }}
              className="font-sans text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-all"
            >
              {t('havanSamagri')}
            </button>
          </nav>

          {/* Header Actions: Language Switcher, Cart with badging, Administrative control panel route */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Interactive Dynamic Multi-Lingual Switcher */}
            <button 
              onClick={() => {
                setLang(prev => prev === 'en' ? 'hi' : 'en');
                showToast(lang === 'en' ? 'भाषा बदली गई: हिंदी' : 'Language set to English');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-bronze-border text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all text-xs font-bold font-sans uppercase tracking-wider bg-charcoal-gray/50 cursor-pointer"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Glowing Shopping Cart Trigger */}
            <button 
              onClick={() => navigateTo('checkout')}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-all focus:outline-none"
              title="Sacred Cart & Checkout"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-primary text-on-primary font-sans text-[10px] font-bold rounded-full flex items-center justify-center border border-deep-black shadow-[0_0_10px_#e9c176]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Admin Controls Panel Trigger */}
            <button 
              onClick={() => navigateTo('admin')}
              className={`p-2 border rounded-full transition-all flex items-center justify-center ${
                view === 'admin' 
                  ? 'border-primary text-primary bg-primary/10' 
                  : 'border-bronze-border text-on-surface-variant hover:border-primary/60 hover:text-primary'
              }`}
              title="Admin Control Panel"
            >
              <User className="w-4.5 h-4.5" />
            </button>

          </div>
        </div>
      </header>

      {/* Main Container Core View Port Router */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME PAGE */}
          {view === 'home' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-fade-in"
            >
              {/* Majestic Immersive Hero Landing Visual Frame */}
              <section className="relative min-h-[92vh] flex items-center overflow-hidden py-16 bg-gradient-to-b from-deep-black to-charcoal-gray/40 border-b border-bronze-border">
                <div className="absolute inset-0 z-0 opacity-40">
                  <img 
                    alt="Divine sacred smoke" 
                    className="w-full h-full object-cover grayscale brightness-[0.35]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM1NygwfivdEnYS3JmploM1S8vhvQNPgKL-uAw2c18mI8WIBXB1b9Ba4GOjUrs58g5OhW76uJMtmUVVtwLBwuK2U1MKRRzwOCY_JvhdAm__LHb4nrDnGUbpfNELTkkjbv7HnJ_x1zOq8dQW1gRe5gNJXyJmcS9cGfS8kjQBNy7sFmqeUvvMpHuRKXIVWHDN-WlbAMvi-twg81Iwbt78Ygp0IQ1JZVsjXyM9me1RIdQrAXq-uld5WXiEpd9Z_0e9QkdIu2UucS_94Mo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black" />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Text Description Block */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-3">
                      <div className="h-[1px] w-12 bg-primary" />
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary">
                        {t('heroSubtitle')}
                      </span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-[1.1] font-bold">
                      {t('heroTitle')} <br />
                      <span className="text-primary italic font-medium">{t('heroTitleItalic')}</span>
                    </h1>

                    <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                      {lang === 'en' ? selectedProduct?.description : selectedProduct?.descriptionHi}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <button 
                        onClick={() => navigateTo('product-detail', products.find(p => p.id === 'shakti-dhoop-cup'))}
                        className="bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-widest transition-all shadow-lg divine-glow hover:scale-102 flex items-center gap-2 cursor-pointer"
                      >
                        {t('shopTheRitual')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigateTo('shop')}
                        className="border border-primary/40 text-primary hover:bg-primary/5 px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        {lang === 'en' ? 'Our Collections' : 'हमारा संग्रह'}
                      </button>
                    </div>
                  </div>

                  {/* Brand Visual Logo Anchor */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center group overflow-hidden">
                      <div className="absolute inset-0 bg-primary/15 blur-[90px] rounded-full animate-pulse-slow"></div>
                      <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.75 }}
                        transition={{ duration: 1.2 }}
                        alt="Sacred Ancient Hindu Mandir Watermark" 
                        className="relative z-10 w-full h-full object-contain filter brightness-125 contrast-125 drop-shadow-[0_0_30px_rgba(255,120,31,0.5)] opacity-80 select-none" 
                        src={mandirWatermarkImg}
                      />
                    </div>
                  </div>

                </div>

                {/* Slogan Badge Bottom */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none hidden md:flex">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary/70 font-semibold">{t('slogan')}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-[0.5px] w-12 bg-primary/30" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-primary" />
                    <div className="h-[0.5px] w-12 bg-primary/30" />
                  </div>
                </div>
              </section>

              {/* Slogan Banner with Ancient Mantra */}
              <section className="py-12 bg-charcoal-gray border-b border-bronze-border text-center">
                <div className="max-w-4xl mx-auto px-6">
                  <p className="font-serif text-lg sm:text-2xl text-primary font-medium tracking-wide italic leading-relaxed">
                    {t('mantraText')}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-2">
                    {t('mantraCaption')}
                  </p>
                </div>
              </section>

              {/* Interactive Bento Section - Displays Products and Sacred Series */}
              <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-semibold tracking-tight">
                    {t('collectionTitle')}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-on-surface-variant">
                    {t('collectionSubtitle')}
                  </p>
                </div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Box 1 (Left - Maha Shakti Resin Dhoop) */}
                  <div className="md:col-span-8 group relative overflow-hidden bg-charcoal-gray border border-bronze-border hover:border-primary/50 transition-all duration-500 rounded-none h-96 flex flex-col justify-end p-8">
                    <img 
                      alt="Premium Dhoop sticks & resins" 
                      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-102 transition-transform duration-700" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMq2qnc6Ky_T-CtWiLl1psOlksBRTI5w2Wk5u9PkOgOpnyl6IQQi9jZgq2FAJaFl9szG7q71doiuvBHbQo2gBKM0iofbez80fZaCdFnvFnXswsIoVPrmKYUFRrvajuK1UZMjRcJdozwXLGlrLlirg4YunQvud79h9up-W3ydIjwe5z7DO87P_E9bDxY4CGF3h6sZadGPoko6LI9dTFQFdzXi4xNiQUX2GPgB_MKlpHQ2Slz0vH3ohuFfbkbCDBUBwtU6imlFmIJzja"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-10" />
                    <div className="relative z-20 space-y-2 text-left">
                      <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                        {t('heritageSeries')}
                      </span>
                      <h3 className="font-serif text-2xl text-on-surface font-semibold">
                        {t('artisanalDhoopbatti')}
                      </h3>
                      <p className="text-sm text-on-surface-variant max-w-lg">
                        {lang === 'en' 
                          ? 'Meticulously blended resins crafted for beautiful atmospheric alignment.' 
                          : 'सुंदर आत्मिक शांति के लिए विशेषज्ञ रूप से तैय्यार किया गया आध्यात्मिक राल धूप संग्रह।'}
                      </p>
                      <button 
                        onClick={() => {
                          setCategoryFilter('dhoop');
                          navigateTo('shop');
                        }}
                        className="text-primary font-sans text-xs uppercase font-bold tracking-widest pt-2 flex items-center gap-2 group-hover:gap-4 transition-all hover:underline"
                      >
                        {lang === 'en' ? 'Explore Collection' : 'संग्रह देखें'}
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Box 2 (Right - Sacred Sandalwood Agarbatti) */}
                  <div className="md:col-span-4 group relative overflow-hidden bg-charcoal-gray border border-bronze-border hover:border-primary/50 transition-all duration-500 rounded-none h-96 flex flex-col justify-end p-8 text-left">
                    <img 
                      alt="Sacred Agarbatti Incense Sticks" 
                      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-102 transition-transform duration-700" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpzDdwaxewUVFVjOevAweumccADH5LEn9njjkNXhjnBS1NMxZGZVEzAig3_HyNTPqMwElHeq2GAUbKkXDWkiogHdNmitYomSfrrNAHZqJ0IoIHKCRYh8D9U02DNPj94kGsLI8CrJozcHLtlm8vF-nAxFpXM2DDrNXz7Rf_pIkxZTfukNOWkWoK6s2ktXQRPOZjn12z6mswbeZTF_bLUzSNbRkA5i2nYYCDwDFuDwjWaj_oAXr-OwMVlaa34ylWfPtJxD9mvu_nItjp"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-10" />
                    <div className="relative z-20 space-y-1">
                      <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                        {t('premiumAgarbattiCat')}
                      </span>
                      <h3 className="font-serif text-xl text-on-surface font-semibold">{lang === 'en' ? 'Pure Sandalwood Classic' : 'शुद्ध चंदन क्लासिक'}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {lang === 'en' ? 'Pure oils & binders of finest Mysore sandal.' : 'मैसूर की उत्तम सुगंध के साथ प्राकृतिक जड़ी-बूटी तेल बाइंडर्स।'}
                      </p>
                      <button 
                        onClick={() => navigateTo('product-detail', products.find(p => p.id === 'pure-sandalwood'))}
                        className="text-primary font-sans text-xs uppercase font-bold tracking-widest pt-2 flex items-center gap-1.5 hover:underline"
                      >
                        {lang === 'en' ? 'Discover' : 'खोजें'}
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Box 3 (Left - traditional Havan Samagri) */}
                  <div className="md:col-span-4 group relative overflow-hidden bg-charcoal-gray border border-bronze-border hover:border-primary/50 transition-all duration-500 rounded-none h-96 flex flex-col justify-end p-8 text-left">
                    <img 
                      alt="Organic Havan herbs" 
                      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-102 transition-transform duration-700" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVH7opXLrFQG8sad5ApPpETruWZJTddzg2lOvMdWe8x-0NMIdxcPg39uhiJqGfW6jTpE5InyTOXJ_cQ1Mfibu1LH6BA0Il7WOnoP7pyRBIjksjrVEjx59tK6YQhttgcrdqovrcYe9oJBqwp1eUGp9S9qQJTKOn0ISsw4iNZTmy1AG82HgdHfapU-NZgtVsA70kKX8nEOlwyYfdZl88rWai6i1pZvjHMcN3M24QYcVpbfLLFQUgxzKYTKL1UJ5UCvZb-MgH5gM_0In1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-10" />
                    <div className="relative z-20 space-y-1">
                      <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                        {t('traditionalHavanCat')}
                      </span>
                      <h3 className="font-serif text-xl text-on-surface font-semibold">{lang === 'en' ? 'Agnihotra Sacred Blend' : 'अग्निहोत्र पावन मिश्रण'}</h3>
                      <p className="text-xs text-on-surface-variant">
                        {lang === 'en' ? 'Vedic herbs and dry roses for purifying fire rituals.' : 'पवित्र अग्नि अनुष्ठान के लिए जैविक प्राचीन वैदिक जड़ी-बूटियाँ।'}
                      </p>
                      <button 
                        onClick={() => navigateTo('product-detail', products.find(p => p.id === 'agnihotra-blend'))}
                        className="text-primary font-sans text-xs uppercase font-bold tracking-widest pt-2 flex items-center gap-1.5 hover:underline"
                      >
                        {lang === 'en' ? 'Explore Ritual' : 'अनुष्ठान देखें'}
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Box 4 (Right - The Shami Victory Vault Box) */}
                  <div className="md:col-span-8 bg-charcoal-gray border border-bronze-border hover:border-primary/30 transition-all p-8 md:p-12 relative overflow-hidden flex items-center text-left">
                    <div className="max-w-md space-y-4 relative z-10">
                      <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary">
                        {t('bespokeExperience')}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
                        {t('shamiVictoryBox')}
                      </h3>
                      <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                        {t('shamiVictoryDesc')}
                      </p>
                      <button 
                        onClick={() => {
                          setCategoryFilter('all');
                          navigateTo('shop');
                        }}
                        className="border border-primary text-primary hover:bg-primary hover:text-on-primary px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        {lang === 'en' ? 'Reserve Yours' : 'अपना आरक्षित करें'}
                      </button>
                    </div>

                    <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 border border-primary/5 rounded-full flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-32 h-32 border border-primary/20 rounded-full" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* Brand Philosophy / Story of Shami Tree of Victory & Protection */}
              <section className="py-24 bg-charcoal-gray/60 border-t border-b border-bronze-border">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  
                  {/* Decorative Frame */}
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary/20 pointer-events-none" />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary/20 pointer-events-none" />
                    <div className="p-2.5 border border-bronze-border bg-deep-black/60 relative">
                      <img 
                        alt="Ancient Sacred Shami Tree (शमी का पेड़)" 
                        className="w-full h-auto filter brightness-90 hover:brightness-100 transition-all duration-1000 object-cover" 
                        src={sacredShamiOnlyImg}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Philosophy Text block */}
                  <div className="space-y-6 text-left">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary block">
                      {t('storyIntro')}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-on-surface font-semibold leading-tight">
                      {t('storyTitle')}
                    </h2>
                    
                    <div className="space-y-4 text-on-surface-variant font-sans text-sm sm:text-base leading-relaxed">
                      <p className="border-l-2 border-primary pl-4 py-1.5 italic text-primary font-serif font-medium">
                        "{t('valleyMantra', 'शमी शमयते पापम्, शमी शत्रुविनाशिनी। विजयाय नमः ||')}"
                      </p>
                      <p>{t('storyDesc1')}</p>
                      <p>{t('storyDesc2')}</p>
                    </div>

                    <button 
                      onClick={() => showToast(lang === 'en' ? 'Philosophical treatise coming soon!' : 'दार्शनिक निबंध जल्द ही उपलब्ध होगा!')}
                      className="group flex items-center gap-3 text-primary font-sans text-xs uppercase font-bold tracking-widest pt-2 hover:underline"
                    >
                      {t('storyButton')}
                      <span className="w-12 h-[1px] bg-primary group-hover:w-16 transition-all duration-300" />
                    </button>
                  </div>

                </div>
              </section>

              {/* Newsletter Call to Action */}
              <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center space-y-8 bg-charcoal-gray/30 border border-bronze-border p-8 sm:p-12 md:p-16 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-deep-black border border-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
                      {t('newsletterTitle')}
                    </h2>
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                      {t('newsletterSubtitle')}
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast(lang === 'en' ? 'Blessings Received! Subscribed Successfully.' : 'आशीर्वाद प्राप्त हुआ! सफलतापूर्वक सब्सक्राइब किया गया।');
                    }}
                    className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 pt-4"
                  >
                    <input 
                      required
                      type="email" 
                      placeholder={t('emailPlaceholder')}
                      className="flex-1 bg-deep-black border border-bronze-border px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors text-left"
                    />
                    <button 
                      type="submit"
                      className="bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      {t('subscribe')}
                    </button>
                  </form>
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: SHOP PAGE */}
          {view === 'shop' && (
            <motion.div
              key="view-shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12"
            >
              {/* Product Header Hero Area */}
              <div className="text-center py-10 max-w-3xl mx-auto space-y-4">
                <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary block">
                  {lang === 'en' ? 'Sacred Catalog' : 'पवित्र सूची'}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface">
                  {lang === 'en' ? 'Our Divine Offerings' : 'हमारा दिव्य अर्पण'}
                </h1>
                <p className="font-sans text-sm text-on-surface-variant">
                  {lang === 'en' 
                    ? 'Discover the absolute purity of handpicked, charcoal-free dhoop, premium agarbatti, and traditional havan samagri items for victory, focus, and home purification.' 
                    : 'विजय, एकाग्रता और गृह शुद्धि के लिए हाथ से चुने गए शुद्ध धूप, प्रीमियम अगरबत्ती और पारंपरिक हवन सामग्री की दिव्य सूची।'
                  }
                </p>
              </div>

              {/* Search and Category Control Bar */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-charcoal-gray/50 border border-bronze-border p-6 mb-12 rounded-none">
                
                {/* Search Box inputs */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-outline" />
                  </span>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'en' ? 'Search offerings...' : 'पवित्र उत्पादों की खोज...'}
                    className="w-full bg-deep-black border border-bronze-border rounded-none pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters Option Tabs */}
                <div className="flex flex-wrap gap-2.5 justify-center w-full md:w-auto">
                  <button 
                    onClick={() => setCategoryFilter('all')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                      categoryFilter === 'all' 
                        ? 'bg-primary text-on-primary-fixed shadow-md divine-glow' 
                        : 'border border-bronze-border text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {t('allProducts')}
                  </button>
                  <button 
                    onClick={() => setCategoryFilter('dhoop')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                      categoryFilter === 'dhoop' 
                        ? 'bg-primary text-on-primary-fixed shadow-md divine-glow' 
                        : 'border border-bronze-border text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {t('shaktiDhoopCat')}
                  </button>
                  <button 
                    onClick={() => setCategoryFilter('agarbatti')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                      categoryFilter === 'agarbatti' 
                        ? 'bg-primary text-on-primary-fixed shadow-md divine-glow' 
                        : 'border border-bronze-border text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {t('premiumAgarbattiCat')}
                  </button>
                  <button 
                    onClick={() => setCategoryFilter('havan')}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                      categoryFilter === 'havan' 
                        ? 'bg-primary text-on-primary-fixed shadow-md divine-glow' 
                        : 'border border-bronze-border text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {t('traditionalHavanCat')}
                  </button>
                </div>

              </div>

              {/* Dynamic products list rendering */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-bronze-border space-y-4">
                  <Package className="w-12 h-12 text-outline mx-auto stroke-[1.25]" />
                  <p className="font-sans text-sm text-on-surface-variant">
                    {lang === 'en' 
                      ? 'No sacred offerings match your search criteria.' 
                      : 'कोई पवित्र उत्पाद उपलब्ध नहीं मिला।'}
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                    className="text-primary font-sans text-xs uppercase font-bold tracking-widest hover:underline"
                  >
                    {lang === 'en' ? 'Reset All Filters' : 'सभी फ़िल्टर रीसेट करें'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <motion.div 
                      key={product.id}
                      layout
                      className="bg-charcoal-gray border border-bronze-border hover:border-primary/50 transition-all duration-300 flex flex-col text-left group"
                    >
                      {/* Product Image Frame */}
                      <div 
                        onClick={() => navigateTo('product-detail', product)}
                        className="relative aspect-square overflow-hidden bg-deep-black cursor-pointer"
                      >
                        <img 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={product.images[0]}
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-deep-black/10 transition-colors" />
                        
                        {product.isFeatured && (
                          <div className="absolute top-3 left-3 bg-primary text-on-primary font-sans text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 shadow-md">
                            {t('featuredTag')}
                          </div>
                        )}

                        <div className="absolute top-3 right-3 bg-deep-black/80 text-primary font-sans text-[10px] px-2.5 py-1 border border-primary/20 backdrop-blur-sm uppercase font-bold">
                          {lang === 'en' ? product.size : product.sizeHi}
                        </div>
                      </div>

                      {/* Content Card details */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="font-sans text-[10px] text-primary uppercase font-bold tracking-widest">
                            {lang === 'en' ? product.category.toUpperCase() : product.categoryHi}
                          </span>
                          
                          <h3 
                            onClick={() => navigateTo('product-detail', product)}
                            className="font-serif text-lg text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer"
                          >
                            {lang === 'en' ? product.name : product.nameHi}
                          </h3>
                          
                          <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                            {lang === 'en' ? product.description : product.descriptionHi}
                          </p>
                        </div>

                        {/* Price and actions bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-bronze-border">
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif text-lg text-primary font-bold">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="font-sans text-xs text-outline line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => navigateTo('product-detail', product)}
                              className="text-on-surface-variant hover:text-primary p-2 border border-bronze-border hover:border-primary/50 transition-all"
                              title="View Details"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAddToCart(product, 1)}
                              className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-on-primary px-3.5 py-1.5 font-sans text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                            >
                              {lang === 'en' ? 'Quick Add' : 'जोड़ें'}
                            </button>
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

          {/* VIEW: PRODUCT DETAIL */}
          {view === 'product-detail' && selectedProduct && (
            <motion.div
              key="view-product-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 text-left"
            >
              
              {/* Back navigation */}
              <button 
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-sans text-xs uppercase font-bold tracking-widest cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-primary" />
                <span>{lang === 'en' ? 'Back To Celestial Shop' : 'वापस दुकान पर'}</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
                
                {/* Left side: Interactive image gallery */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Big Image display */}
                  <div className="relative aspect-square overflow-hidden bg-charcoal-gray border border-bronze-border p-1 group">
                    <img 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      src={selectedProduct.images[activeThumb] || selectedProduct.images[0]}
                    />
                    
                    <div className="absolute top-4 left-4 bg-primary text-on-primary font-sans text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
                      {lang === 'en' ? 'Ritual Grade Verified' : 'प्रमाणित अनुष्ठानिक ग्रेड'}
                    </div>
                  </div>

                  {/* Thumbnail lists selection - highly interactive */}
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {selectedProduct.images.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setActiveThumb(idx)}
                          className={`aspect-square border overflow-hidden p-1 bg-charcoal-gray transition-colors ${
                            activeThumb === idx ? 'border-primary' : 'border-bronze-border'
                          }`}
                        >
                          <img 
                            alt={`Thumb ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            src={img} 
                          />
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* Right side: Information and interactive purchase selectors */}
                <div className="lg:col-span-6 space-y-6">
                  
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] text-primary uppercase font-bold tracking-[0.2em] block">
                      {lang === 'en' ? selectedProduct.category.toUpperCase() : selectedProduct.categoryHi} — {lang === 'en' ? selectedProduct.size : selectedProduct.sizeHi}
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl text-on-surface font-semibold tracking-tight leading-tight">
                      {lang === 'en' ? selectedProduct.name : selectedProduct.nameHi}
                    </h1>
                    <p className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-primary/70">{t('slogan')}</p>
                  </div>

                  {/* Price display blocks */}
                  <div className="flex items-baseline gap-4 py-2 border-y border-bronze-border">
                    <span className="font-serif text-3xl text-primary font-bold">
                      ₹{selectedProduct.price}
                    </span>
                    {selectedProduct.originalPrice && (
                      <>
                        <span className="font-sans text-base text-outline line-through">
                          ₹{selectedProduct.originalPrice}
                        </span>
                        <span className="bg-primary/10 text-primary text-[9px] font-sans font-bold px-2 py-0.5 uppercase tracking-widest">
                          {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Descriptions */}
                  <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
                    {lang === 'en' ? selectedProduct.description : selectedProduct.descriptionHi}
                  </p>

                  <div className="border-l-2 border-primary/30 pl-4 py-1 font-serif text-xs sm:text-sm text-primary/80 italic">
                    {lang === 'en' 
                      ? '"Meticulously crafted with 108 medicinal herbs and natural binders according to the ancient Atharvaveda standards of environmental purification."'
                      : '"पर्यावरण शुद्धि के प्राचीन अथर्ववेद मानकों के अनुसार १०८ औषधीय जड़ी-बूटियों और प्राकृतिक बाइंडरों के साथ सावधानीपूर्वक तैयार किया गया है।"'}
                  </div>

                  {/* Interactive quantity control section */}
                  <div className="space-y-3 pt-2">
                    <span className="font-sans text-xs uppercase font-bold text-on-surface tracking-wider block">{t('quantity')}</span>
                    <div className="flex items-center gap-4">
                      
                      {/* Controller */}
                      <div className="flex items-center border border-bronze-border bg-charcoal-gray/50">
                        <button 
                          onClick={() => setDetailQty(prev => Math.max(1, prev - 1))}
                          className="px-4 py-2 hover:bg-bronze-border text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-sans text-sm font-bold text-primary">
                          {detailQty}
                        </span>
                        <button 
                          onClick={() => setDetailQty(prev => prev + 1)}
                          className="px-4 py-2 hover:bg-bronze-border text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs text-on-surface-variant font-sans uppercase tracking-wider">
                        {lang === 'en' ? selectedProduct.size : selectedProduct.sizeHi}
                      </span>

                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => handleAddToCart(selectedProduct, detailQty)}
                      className="flex-1 bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary py-4 font-sans text-xs font-bold uppercase tracking-widest transition-all hover:scale-101 flex items-center justify-center gap-2.5 shadow-lg group cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-on-primary-fixed group-hover:scale-110 transition-transform" />
                      <span>{t('addToCart')}</span>
                    </button>
                    <button 
                      onClick={() => handleBuyNow(selectedProduct, detailQty)}
                      className="flex-1 border border-primary text-primary hover:bg-primary/5 py-4 font-sans text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>

                  {/* Highlights banner */}
                  <div className="grid grid-cols-2 gap-4 border-t border-bronze-border pt-6 text-on-surface-variant">
                    <div className="flex items-center gap-2.5">
                      <Leaf className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-sans text-xs font-medium">{t('naturalIngredients')}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-sans text-xs font-medium">{t('ritualReady')}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-sans text-xs font-medium">{t('burnDuration')}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-sans text-xs font-medium">{t('authenticHeritage')}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Detailed custom section: The Ritual Experience instructions */}
              <section className="py-16 border-t border-bronze-border space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-2">
                  <h2 className="font-serif text-3xl text-on-surface font-semibold tracking-tight">{t('ritualTitle')}</h2>
                  <p className="font-sans text-sm text-on-surface-variant">{t('ritualSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-charcoal-gray border border-bronze-border p-8 relative overflow-hidden group">
                    <div className="text-primary font-serif text-3xl font-semibold mb-4">I</div>
                    <h3 className="font-serif text-lg text-on-surface font-bold mb-2">
                      {lang === 'en' ? '1. Environmental Cleansing' : '१. स्थान शुद्धि'}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {lang === 'en' 
                        ? 'Place the Vedica Shakti cup in a safe non-flammable burner. Light the top rim until it glows red, then blow out the flame to allow the sacred herb smoke to emerge.' 
                        : 'धूप कप को बर्नर में सुरक्षित रखें। इसके ऊपरी हिस्से को तब तक जलाएं जब तक वह अंगारे की तरह लाल न हो जाए, फिर पवित्र धुआं निकालने के लिए फूंक मारकर लौ को बुझा दें।'}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>

                  <div className="bg-charcoal-gray border border-bronze-border p-8 relative overflow-hidden group">
                    <div className="text-primary font-serif text-3xl font-semibold mb-4">II</div>
                    <h3 className="font-serif text-lg text-on-surface font-bold mb-2">
                      {lang === 'en' ? '2. Sacred Invocation' : '२. मंत्रों का आह्वान'}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {lang === 'en' 
                        ? 'As the tranquil herbal fragrance fills the room, recite the Vedic Shami Mantra or meditate in silence to invoke victory, peace, and protection over your intentions.' 
                        : 'जब सुगन्धित धुआं कमरे में फैलने लगे, तब अपने पवित्र उद्देश्यों पर विजय और शांति के लिए शमी वैदिक मंत्र का पाठ करें या ध्यान लगाएं।'}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left animate-pulse" />
                  </div>

                  <div className="bg-charcoal-gray border border-bronze-border p-8 relative overflow-hidden group">
                    <div className="text-primary font-serif text-3xl font-semibold mb-4">III</div>
                    <h3 className="font-serif text-lg text-on-surface font-bold mb-2">
                      {lang === 'en' ? '3. Harmony Diffusion' : '३. धूप प्रसार'}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {lang === 'en' 
                        ? 'Move the burner clockwise throughout all rooms and corners of your home. The holistic botanical elements will neutralize stagnant energies and deliver serenity.' 
                        : 'धूप पात्र को अपने निवास स्थान के प्रत्येक कोने में घड़ी की दिशा में घुमाएं। यह प्राकृतिक सुगंध नकारात्मक ऊर्जाओं को समाप्त कर सुखद शांति प्रदान करेगी।'}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </div>
              </section>

              {/* Ingredients Details layout */}
              <section className="py-16 border-t border-bronze-border grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl text-on-surface font-semibold tracking-tight">
                    {t('sacredIngredientsTitle')}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center shrink-0">
                        <Leaf className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h4 className="font-sans text-sm font-bold text-on-surface uppercase tracking-wide">{t('ingredient1Title')}</h4>
                        <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">{t('ingredient1Desc')}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center shrink-0">
                        <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h4 className="font-sans text-sm font-bold text-on-surface uppercase tracking-wide">{t('ingredient2Title')}</h4>
                        <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">{t('ingredient2Desc')}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-full border border-primary flex items-center justify-center shrink-0">
                        <Flame className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h4 className="font-sans text-sm font-bold text-on-surface uppercase tracking-wide">{t('ingredient3Title')}</h4>
                        <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">{t('ingredient3Desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Imagery asset wrapper */}
                <div className="p-1 border border-bronze-border bg-deep-black">
                  <img 
                    alt="Ayurvedic dried raw ingredients composition" 
                    className="w-full rounded h-auto object-cover opacity-80" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-NRXMdGp5BtcZuCHn-bS1jN-P3v_qNuKCneIKP7eRPk-w4KgszjIbOZi7vLx5QMzlGW0J8apctKU_PBVcsDH4ACn_thz-RsSnGqw8Uh1vmS9qlUIsusaHo-UNcRLHpEr5iDi86ZXthxWLJJQWq6M0xxSk9276SoINT-U8uumgM_57A8Zu_gUcGujfw655pS8KxtRFXDMNWOO84DqOIwnw5GBp2EmopgC3Dzr7ylpTlD0LE8e_PpqHgjt4BJkxE5D-AM7VVZPhAyhp"
                  />
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: CHECKOUT & SHOPPING CART */}
          {view === 'checkout' && (
            <motion.div
              key="view-checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 text-left"
            >
              
              <div className="mb-8">
                <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold">{t('brandName')}</h1>
                <p className="font-sans text-sm text-on-surface-variant tracking-wide">
                  {lang === 'en' ? 'Complete Your Sacred Order In Ultimate Luxury' : 'शानदार पवित्र विलासिता के साथ अपनी आध्यात्मिक खरीदारी पूरी करें'}
                </p>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-24 bg-charcoal-gray/30 border border-bronze-border space-y-6">
                  <ShoppingCart className="w-14 h-14 text-outline mx-auto stroke-[1]" />
                  <p className="font-sans text-sm text-on-surface-variant uppercase tracking-wider">
                    {lang === 'en' ? 'Your sacred shopping cart is empty' : 'आपका पवित्र पूजा का कार्ट खाली है'}
                  </p>
                  <button 
                    onClick={() => navigateTo('shop')}
                    className="bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {t('shopTheRitual')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Left segment: Billing input parameters */}
                  <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-10">
                    
                    {/* Delivery Form parameters */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-bronze-border pb-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h2 className="font-serif text-xl font-bold text-on-surface">
                          {lang === 'en' ? 'Delivery Destination Details' : 'वितरण विवरण गृह पता'}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Full Name input */}
                        <div className="space-y-1 text-left">
                          <label className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider block">
                            {lang === 'en' ? 'Verify Full Name' : 'पूरा नाम सत्यापित करें'}
                          </label>
                          <input 
                            type="text" 
                            required
                            value={fullName}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="e.g. Rajesh Kumar"
                            className="w-full bg-deep-black border border-bronze-border rounded-none px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                          />
                          {formErrors.fullName && <p className="text-xs text-error font-sans">{formErrors.fullName}</p>}
                        </div>

                        {/* Phone Number input */}
                        <div className="space-y-1 text-left">
                          <label className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider block">
                            {lang === 'en' ? 'Devotee Contact Number (10 digits)' : 'भक्त का संपर्क नंबर (१० अंक)'}
                          </label>
                          <input 
                            type="tel" 
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            placeholder="e.g. 9520004353"
                            className="w-full bg-deep-black border border-bronze-border rounded-none px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                          />
                          {formErrors.phone && <p className="text-xs text-error font-sans">{formErrors.phone}</p>}
                        </div>

                        {/* Addresses input */}
                        <div className="md:col-span-2 space-y-1 text-left">
                          <label className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider block">
                            {lang === 'en' ? 'Complete Delivery Address' : 'वितरण का पूर्ण गृह पता'}
                          </label>
                          <input 
                            type="text" 
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Flat/House No, Society Name, Street details"
                            className="w-full bg-deep-black border border-bronze-border rounded-none px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                          />
                          {formErrors.address && <p className="text-xs text-error font-sans">{formErrors.address}</p>}
                        </div>

                        {/* City input */}
                        <div className="space-y-1 text-left">
                          <label className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider block">
                            {lang === 'en' ? 'City' : 'शहर का नाम'}
                          </label>
                          <input 
                            type="text" 
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Mumbai"
                            className="w-full bg-deep-black border border-bronze-border rounded-none px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                          />
                          {formErrors.city && <p className="text-xs text-error font-sans">{formErrors.city}</p>}
                        </div>

                        {/* Pincode input */}
                        <div className="space-y-1 text-left">
                          <label className="font-sans text-[11px] text-on-surface-variant uppercase tracking-wider block">
                            {lang === 'en' ? 'Pincode (6 digits)' : 'पिन कोड (६ अंक)'}
                          </label>
                          <input 
                            type="text" 
                            required
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            placeholder="e.g. 400006"
                            className="w-full bg-deep-black border border-bronze-border rounded-none px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-all text-left"
                          />
                          {formErrors.pincode && <p className="text-xs text-error font-sans">{formErrors.pincode}</p>}
                        </div>

                      </div>
                    </div>

                    {/* Payment strategy */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-bronze-border pb-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h2 className="font-serif text-xl font-bold text-on-surface">
                          {lang === 'en' ? 'Secure Payment Channel' : 'सुरक्षित भुगतान माध्यम'}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-none cursor-pointer hover:bg-charcoal-gray transition-all ${
                          paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-bronze-border'
                        }`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="text-primary bg-transparent focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                          />
                          <span className="ml-4 font-sans text-sm font-semibold">{lang === 'en' ? 'Credit/Debit Card' : 'क्रेडिट / डेबिट कार्ड'}</span>
                        </label>

                        <label className={`flex items-center p-4 border rounded-none cursor-pointer hover:bg-charcoal-gray transition-all ${
                          paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-bronze-border'
                        }`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="text-primary bg-transparent focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                          />
                          <span className="ml-4 font-sans text-sm font-semibold">{lang === 'en' ? 'UPI (Google Pay, PhonePe, Paytm)' : 'UPI (जीपे, फ़ोनपे, पेटीएम)'}</span>
                        </label>

                        <label className={`flex items-center p-4 border rounded-none cursor-pointer hover:bg-charcoal-gray transition-all ${
                          paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : 'border-bronze-border'
                        }`}>
                          <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'netbanking'}
                            onChange={() => setPaymentMethod('netbanking')}
                            className="text-primary bg-transparent focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                          />
                          <span className="ml-4 font-sans text-sm font-semibold">{lang === 'en' ? 'Net Banking' : 'नेट बैंकिंग'}</span>
                        </label>

                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button 
                      type="submit"
                      className="w-full bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.01] shadow-xl divine-glow cursor-pointer"
                    >
                      {lang === 'en' ? 'PLACE SACRED ORDER' : 'पवित्र आदेश दें'}
                    </button>

                  </form>

                  {/* Right segment: Order Summary with detailed dynamic calculators */}
                  <div className="lg:col-span-5 bg-charcoal-gray border border-bronze-border p-6 sm:p-8 space-y-6">
                    <h2 className="font-serif text-xl font-bold text-primary border-b border-outline-variant pb-3 text-left">
                      {lang === 'en' ? 'Sacred Cart Summary' : 'पवित्र सामग्री सारांश'}
                    </h2>

                    {/* Cart Items List */}
                    <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex gap-4 border-b border-bronze-border/40 pb-4">
                          <div className="w-16 h-16 bg-deep-black border border-bronze-border shrink-0">
                            <img className="w-full h-full object-cover" src={item.product.images[0]} alt={item.product.name} />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between text-left space-y-1">
                            <div>
                              <h4 className="font-serif text-sm font-bold text-on-surface line-clamp-1">
                                {lang === 'en' ? item.product.name : item.product.nameHi}
                              </h4>
                              <p className="text-[10px] text-primary uppercase font-bold tracking-wider">
                                {lang === 'en' ? item.product.size : item.product.sizeHi}
                              </p>
                            </div>

                            {/* Quantity Controls inside lists */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-bronze-border bg-deep-black scale-90 origin-left">
                                <button 
                                  onClick={() => updateCartQty(item.product.id, -1)}
                                  className="px-2.5 py-1 hover:bg-bronze-border text-on-surface-variant hover:text-primary transition-all text-xs cursor-pointer"
                                  type="button"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-primary">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQty(item.product.id, 1)}
                                  className="px-2.5 py-1 hover:bg-bronze-border text-on-surface-variant hover:text-primary transition-all text-xs cursor-pointer"
                                  type="button"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button 
                                onClick={() => removeCartItem(item.product.id)}
                                className="text-outline-variant hover:text-red-400 p-1"
                                type="button"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-serif text-sm font-bold text-primary">₹{item.product.price * item.quantity}</span>
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Cost Calculator summary */}
                    <div className="space-y-3.5 border-t border-bronze-border pt-4">
                      
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>{lang === 'en' ? 'Subtotal' : 'सामग्री का मूल्य'}</span>
                        <span className="font-semibold text-on-surface">₹{cartSubtotal}</span>
                      </div>

                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>{lang === 'en' ? 'Havan GST (5%)' : 'कर मूल्य (GST ५%)'}</span>
                        <span className="font-semibold text-on-surface">₹{gstTax}</span>
                      </div>

                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>{lang === 'en' ? 'Blessings Delivery' : 'पवित्र डिलीवरी'}</span>
                        <span className="font-bold text-primary tracking-widest uppercase">
                          {lang === 'en' ? 'FREE' : 'नि:शुल्क'}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-bronze-border pt-3 flex justify-between items-end">
                        <span className="font-serif text-base font-bold text-on-surface">{lang === 'en' ? 'Grand Total' : 'कुल राशि'}</span>
                        <span className="font-serif text-2xl text-primary font-bold">₹{cartTotal}</span>
                      </div>

                    </div>

                    {/* Guarantee secure channel badges */}
                    <div className="bg-deep-black p-4 border border-bronze-border flex items-center gap-3 text-left">
                      <Lock className="w-8 h-8 text-primary shrink-0 stroke-[1.5]" />
                      <div className="space-y-0.5">
                        <h5 className="font-sans text-[11px] font-bold text-on-surface uppercase tracking-wide">
                          {lang === 'en' ? 'Secured 256-Bit Encrypted' : '२५६-बिट सुरक्षित भुगतान चैनल'}
                        </h5>
                        <p className="text-[10px] text-on-surface-variant">
                          {lang === 'en' ? 'Your spiritual transaction is safe & legal' : 'आपकी पवित्र राशि पूर्णतः सुरक्षित है'}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* VIEW: ADMIN PANEL DASHBOARD */}
          {view === 'admin' && (
            <motion.div
              key="view-admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 text-left"
            >
              {/* Header section admin */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-bronze-border pb-6 mb-12">
                <div>
                  <div className="flex items-center gap-2 text-primary font-sans text-xs uppercase font-bold tracking-[0.25em] mb-1">
                    <LayoutDashboard className="w-3.5 h-3.5 animate-pulse" />
                    <span>{lang === 'en' ? 'Sanctum Control panel' : 'पवित्र नियंत्रण केंद्र'}</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
                    {lang === 'en' ? 'Store Performance Overview' : 'स्टोर प्रदर्शन सिंहावलोकन'}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      localStorage.setItem('shami_orders', JSON.stringify(initialOrders));
                      setOrders(initialOrders);
                      showToast(lang === 'en' ? 'Order database reset successfully.' : 'ऑर्डर डेटाबेस सफलतापूर्वक रीसेट हो गया।');
                    }}
                    className="border border-outline-variant hover:border-primary/50 text-on-surface-variant hover:text-primary px-4 py-2 font-sans text-[10px] uppercase font-bold tracking-widest bg-charcoal-gray/35 cursor-pointer"
                  >
                    {lang === 'en' ? 'Reset Database' : 'डेटा रीसेट'}
                  </button>
                  <button 
                    onClick={() => navigateTo('home')}
                    className="bg-primary text-on-primary-fixed hover:bg-gold-cream border border-primary px-5 py-2 font-sans text-[10px] uppercase font-bold tracking-widest transition-all shadow-md divine-glow cursor-pointer"
                  >
                    {lang === 'en' ? 'Back To Storefront' : 'स्टोरफ्रंट पर जाएं'}
                  </button>
                </div>
              </div>

              {/* Top Row KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                
                {/* Metric 1 */}
                <div className="bg-charcoal-gray border border-bronze-border p-6 rounded-none relative overflow-hidden group">
                  <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    {lang === 'en' ? 'Total Revenue' : 'कुल राजस्व'}
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                    ₹{orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-3 font-semibold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.5% vs last week</span>
                  </div>
                  <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-14 h-14 text-primary" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-charcoal-gray border border-bronze-border p-6 rounded-none relative overflow-hidden group">
                  <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    {lang === 'en' ? 'Cumulative Orders' : 'कुल संचित आदेश'}
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                    {orders.length}
                  </p>
                  <div className="text-[10px] text-primary/80 mt-3 font-semibold uppercase tracking-wider">
                    {orders.filter(o => o.status === 'Processing').length} {lang === 'en' ? 'Pending Processing' : 'प्रक्रियाधीन है'}
                  </div>
                  <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Package className="w-14 h-14 text-primary animate-bounce" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-charcoal-gray border border-bronze-border p-6 rounded-none relative overflow-hidden group">
                  <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    {lang === 'en' ? 'Low Stock Alerts' : 'इन्वेंट्री कम सामग्री सूचना'}
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-error">
                    02
                  </p>
                  <div className="text-[10px] text-error mt-3 font-semibold uppercase tracking-wider">
                    {lang === 'en' ? 'Needs immediate restock' : 'त्वरित पुनःपूर्ति की आवश्यकता है'}
                  </div>
                  <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Flame className="w-14 h-14 text-error" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-charcoal-gray border border-bronze-border p-6 rounded-none relative overflow-hidden group">
                  <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    {lang === 'en' ? 'New Devotees Served' : 'नए भक्त जुड़े'}
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                    {Array.from(new Set(orders.map(o => o.customerName))).length}
                  </p>
                  <div className="text-[10px] text-on-surface-variant mt-3 font-semibold uppercase tracking-wider">
                    {lang === 'en' ? 'Across 5 states in Bharat' : 'भारत के राज्यों से भक्तों का विश्वास'}
                  </div>
                  <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Users className="w-14 h-14 text-primary" />
                  </div>
                </div>

              </div>

              {/* Main row table list and inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
                
                {/* Orders History Table */}
                <div className="lg:col-span-8 bg-charcoal-gray border border-bronze-border p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-bronze-border pb-4">
                    <h3 className="font-serif text-xl font-bold text-on-surface">
                      {lang === 'en' ? 'Recent Sacred Orders' : 'हाल के पावन आदेश श्रृंखला'}
                    </h3>
                    <span className="text-xs text-on-surface-variant font-sans tracking-wide">
                      {lang === 'en' ? `${orders.length} transactions stored locally` : `${orders.length} लेनदेन स्थानीय रूप से संग्रहीत है`}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="border-b border-bronze-border text-on-surface-variant text-xs uppercase tracking-wider">
                          <th className="py-3 px-2">{lang === 'en' ? 'Devotee / Location' : 'भक्त विवरण'}</th>
                          <th className="py-3 px-2">{lang === 'en' ? 'Offerings' : 'पवित्र सामग्रियाँ'}</th>
                          <th className="py-3 px-2">{lang === 'en' ? 'Status' : 'स्थिति'}</th>
                          <th className="py-3 px-2 text-right">{lang === 'en' ? 'Amount' : 'कुल राशि'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bronze-border/30">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-deep-black/30 transition-colors">
                            <td className="py-4 px-2">
                              <div className="font-semibold text-on-surface leading-tight">{order.customerName}</div>
                              <div className="text-[10px] text-on-surface-variant">{order.city || 'Mumbai'}, {order.date}</div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="text-xs text-primary max-w-[200px] truncate">
                                {order.items.map(item => `${lang === 'en' ? item.productName : item.productNameHi} (x${item.quantity})`).join(', ')}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <span className={`inline-flex px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                                order.status === 'Delivered' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : order.status === 'Shipped'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {lang === 'en' ? order.status : order.statusHi}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right font-serif font-bold text-on-surface">
                              ₹{order.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Stock tracker lists alerts */}
                <div className="lg:col-span-4 bg-charcoal-gray border border-bronze-border p-6 space-y-6">
                  
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-primary">{lang === 'en' ? 'Inventory Health' : 'भंडार की स्थिति'}</h3>
                    <p className="text-xs text-on-surface-variant">{lang === 'en' ? 'Traditional incense & raw herbal resins' : 'पारंपरिक सुगंधित सामग्री एवं वैदिक हर्ब्स'}</p>
                  </div>

                  <div className="space-y-4">
                    
                    <div className="bg-deep-black p-3.5 border border-bronze-border space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface">Narayani Vedica Shakti Dhoop Cup</span>
                        <span className="text-emerald-400 font-bold uppercase text-[10px]">Healthy</span>
                      </div>
                      <div className="w-full bg-bronze-border h-1.5 overflow-hidden">
                        <div className="bg-primary h-full w-[85%]" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-outline-variant">
                        <span>Min Level: 10</span>
                        <span>Available: 85 Units</span>
                      </div>
                    </div>

                    <div className="bg-deep-black p-3.5 border border-error/20 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface">Maha Shakti Resin Dhoop</span>
                        <span className="text-error font-bold uppercase text-[10px]">Critical (04)</span>
                      </div>
                      <div className="w-full bg-bronze-border h-1.5 overflow-hidden">
                        <div className="bg-error h-full w-[15%]" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-outline-variant">
                        <span>Min Level: 20</span>
                        <span>Available: 04 Units</span>
                      </div>
                    </div>

                    <div className="bg-deep-black p-3.5 border border-bronze-border space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface">Pure Sandalwood Classic</span>
                        <span className="text-emerald-400 font-bold uppercase text-[10px]">Healthy</span>
                      </div>
                      <div className="w-full bg-bronze-border h-1.5 overflow-hidden">
                        <div className="bg-primary h-full w-[72%]" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-outline-variant">
                        <span>Min Level: 15</span>
                        <span>Available: 49 Units</span>
                      </div>
                    </div>

                    <div className="bg-deep-black p-3.5 border border-error/20 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface">Agnihotra Sacred Blend</span>
                        <span className="text-error font-bold uppercase text-[10px]">Critical (06)</span>
                      </div>
                      <div className="w-full bg-bronze-border h-1.5 overflow-hidden">
                        <div className="bg-error h-full w-[22%]" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-outline-variant">
                        <span>Min Level: 25</span>
                        <span>Available: 06 Units</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Primary Beautiful Footer block */}
      <footer className="bg-charcoal-gray border-t border-bronze-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
            
            {/* About column */}
            <div className="md:col-span-5 space-y-4">
              <span className="font-serif text-lg font-bold text-primary">{t('brandName')}</span>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
                {lang === 'en' 
                  ? 'Representing "The Quiet Luxury of the Sacred", our organic formulations and botanical materials are handpicked and handrolled according to ancient scriptures.' 
                  : 'पवित्रता की शांत विलासिता का प्रतिनिधित्व करते हुए, हमारे सभी उत्पाद और पवित्र सामग्रियाँ प्राचीन वैदिक शास्त्रों के अनुसार तैयार की जाती हैं।'}
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3.5 text-left">
              <span className="font-sans text-xs font-bold text-primary uppercase tracking-widest block">
                {lang === 'en' ? 'Sacred Services' : 'पवित्र सेवाएँ'}
              </span>
              <ul className="space-y-2 font-sans text-xs text-on-surface-variant">
                <li>
                  <button onClick={() => navigateTo('home')} className="hover:text-primary hover:underline cursor-pointer">
                    {lang === 'en' ? 'Philosophical story' : 'दार्शनिक कहानी'}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('shop')} className="hover:text-primary hover:underline cursor-pointer">
                    {lang === 'en' ? 'Sacred Catalog' : 'पवित्र सूची'}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('admin')} className="hover:text-primary hover:underline cursor-pointer">
                    {lang === 'en' ? 'Sanctum Controls' : 'नियंत्रण कक्ष'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div className="md:col-span-4 space-y-4 text-left">
              <span className="font-sans text-xs font-bold text-primary uppercase tracking-widest block">
                {lang === 'en' ? 'Spiritual Headquarters' : 'आध्यात्मिक मुख्यालय'}
              </span>
              <div className="space-y-1.5 font-sans text-xs text-on-surface-variant">
                <p className="font-semibold text-on-surface">Chandika Narayani Group Private Limited</p>
                <p>Narayani Dham, Temple Road</p>
                <p>{lang === 'en' ? 'Mumbai HQ, Bharat' : 'मुम्बई मुख्यालय, भारत'}</p>
                <p className="text-primary hover:underline pt-2">email: contact@narayani.com</p>
              </div>
            </div>

          </div>

          {/* Social icons, credits, and copyright disclaimer */}
          <div className="pt-8 border-t border-bronze-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
            <p className="font-sans italic">
              {t('footerConcept')}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-wider text-outline-variant">
              &copy; {new Date().getFullYear()} Chandika Narayani Group. {lang === 'en' ? 'All spiritual rights reserved.' : 'सभी आध्यात्मिक अधिकार सुरक्षित हैं।'}
            </p>
          </div>

        </div>
      </footer>

      {/* FULL SCREEN MODAL: Sacred Order placement success & Divine Benediction */}
      <AnimatePresence>
        {orderModal && lastPlacedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden bg-deep-black/95 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-charcoal-gray border-2 border-primary max-w-2xl w-full p-6 sm:p-8 space-y-6 divine-glow relative max-h-[90vh] overflow-y-auto text-center"
            >
              
              {/* Sun Burst Decor */}
              <div className="mx-auto w-14 h-14 rounded-full border border-primary flex items-center justify-center bg-primary/5 animate-pulse">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>

              {/* Congratulate sacred typography headings */}
              <div className="space-y-2">
                <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em] text-primary block">
                  {lang === 'en' ? 'Offering Acknowledged & Blessing Shield Activated' : 'भेंट स्वीकार्य एवं सुरक्षा कवच सक्रिय'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface">
                  {lang === 'en' ? 'Sacred Order Placed Successfully!' : 'पावन आदेश सफलतापूर्वक प्राप्त!'}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {lang === 'en' 
                    ? 'Your offering has been recorded. It will be packaged post Sunrise ritual inside our sacred workshop guidelines.' 
                    : 'आपका पाวน आदेश दर्ज कर लिया गया है। इसे हमारे पवित्र कार्यशाला दिशानिर्देशों के भीतर सूर्योदय अनुष्ठान के बाद पैक किया जाएगा।'}
                </p>
              </div>

              {/* Order specifics details card block */}
              <div className="bg-deep-black/60 p-4 border border-bronze-border text-left space-y-3 font-sans text-xs">
                <div className="flex justify-between border-b border-bronze-border/30 pb-2">
                  <span className="text-on-surface-variant uppercase tracking-wider font-semibold">{lang === 'en' ? 'Sacred ID' : 'पवित्र आईडी'}</span>
                  <span className="text-primary font-bold">{lastPlacedOrder.id}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-on-surface-variant uppercase tracking-wider font-semibold text-[10px]">{lang === 'en' ? 'Deliver To' : 'डिलिवरी पता'}</p>
                  <p className="font-medium text-on-surface">{lastPlacedOrder.customerName}</p>
                  <p className="text-on-surface-variant">{lastPlacedOrder.address}, {lastPlacedOrder.city} - {lastPlacedOrder.pincode}</p>
                  <p className="text-on-surface-variant font-mono">{lastPlacedOrder.phone}</p>
                </div>
                <div className="flex justify-between border-t border-bronze-border/30 pt-2 font-serif text-sm font-bold">
                  <span className="text-on-surface">{lang === 'en' ? 'Total Sanctified Value' : 'कुल मूल्य'}</span>
                  <span className="text-primary">₹{lastPlacedOrder.amount}</span>
                </div>
              </div>

              {/* Audio Mode Selector inside Modal */}
              <div className="bg-deep-black/60 p-4 border border-bronze-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div>
                  <h4 className="text-primary font-serif text-sm font-semibold">
                    {lang === 'en' ? 'Select Spiritual Sound Signature' : 'आध्यात्मिक ध्वनि का चयन करें'}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant font-sans">
                    {lang === 'en' 
                      ? 'Choose streaming live vocal chants or native analog synthesized Ohm frequencies.' 
                      : 'लाइव वैदिक उच्चारण या मूल निरंतर कॉस्मिक तरंगों में से चुनें।'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentAudioMode('vocal');
                      startSacredChant('vocal');
                    }}
                    className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                      currentAudioMode === 'vocal' 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-transparent text-on-surface-variant border-bronze-border hover:text-primary hover:border-primary'
                    }`}
                  >
                    {lang === 'en' ? '🎙️ Vocal Stotra' : '🎙️ वैदिक गान'}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentAudioMode('synth');
                      startSacredChant('synth');
                    }}
                    className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                      currentAudioMode === 'synth' 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-transparent text-on-surface-variant border-bronze-border hover:text-primary hover:border-primary'
                    }`}
                  >
                    {lang === 'en' ? '🕉️ OM Meditation' : '🕉️ कॉस्मिक ओम'}
                  </button>
                </div>
              </div>

              {/* Devotional Verses Box */}
              <div className="bg-deep-black/60 p-4 border border-bronze-border text-left font-serif space-y-4 max-h-[25vh] overflow-y-auto w-full">
                <div className="space-y-1.5 text-center">
                  <p className="text-primary text-xs tracking-wide font-bold uppercase">
                    — {lang === 'en' ? 'Principal Chanting Verse' : 'प्रधान बीज मंत्र'} —
                  </p>
                  <p className="text-base sm:text-lg text-on-surface font-semibold leading-relaxed">
                    "ॐ ह्रीं बगलामुखी सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्रीं ॐ स्वाहा।"
                  </p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-sans tracking-wide">
                    Om Hreem Bagalamukhi Sarva Dustanaam Vaacham Mukham Padam Stambhaya Jihvaam Keelaya Budheem Vinashaya Hreem Om Swaha.
                  </p>
                </div>

                <hr className="border-bronze-border/30" />

                <div className="space-y-2">
                  <p className="text-primary text-xs font-bold uppercase">
                    {lang === 'en' ? 'Verse 1 • Golden Radiance' : 'श्लोक १ • सुवर्ण आभा'}
                  </p>
                  <p className="text-sm sm:text-base text-on-surface leading-loose">
                    चलत्कनककुण्डलोल्लसितलोलचक्षुद्वयं, <br className="hidden sm:inline" />
                    प्रसन्नाननमुज्ज्वलां सुललितं भुजचतुष्टयम्। <br />
                    शङ्खचक्रगदाधरां कनककुण्डलं मण्डितां, <br className="hidden sm:inline" />
                    भजे बगलामुखीं सुरशरण्यं वरदां सदा॥
                  </p>
                  <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                    {lang === 'en'
                      ? 'Meaning: I worship Mata Baglamukhi, who wears beautiful golden earrings, has bright compassionate eyes, a calm blissful countenance, has four hands holding Conch, Discus, and mace, granting ultimate shelter and protection to all devotees.'
                      : 'अर्थ: जो चंचल कनक कुंडल धारण किए हुए जगमगाती हैं, शंख, चक्र और गदा लिए हुए हैं, भक्तों को अभय दान देने वाली श्री बगलामुखी माता का मैं सदा भजन करता हूँ।'}
                  </p>
                </div>
              </div>

              {/* Interactive Player Controls */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button 
                  onClick={handleToggleMute}
                  className="px-6 py-2.5 bg-primary/10 border border-primary/50 text-primary font-sans text-xs uppercase font-bold tracking-widest hover:bg-primary hover:text-black transition-all cursor-pointer"
                >
                  {isMuted ? (lang === 'en' ? '🔊 Unmute & Listen Chant' : '🔊 मंत्र ध्वनि चालू करें') : (lang === 'en' ? '🔇 Pause Chant' : '🔇 मंत्र ध्वनि रोकें')}
                </button>
                <button 
                  onClick={() => {
                    setOrderModal(false);
                    stopAllAudio();
                    setIsMuted(true);
                  }}
                  className="px-6 py-2.5 bg-primary text-black border border-primary font-sans text-xs uppercase font-bold tracking-widest hover:bg-primary/90 transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Pranam & Close Sanctum' : 'प्रणाम एवं प्रस्थान'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SIDE NAVIGATION DRAWER / HERITAGE PANEL --- */}
      <AnimatePresence>
        {sideMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSideMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black cursor-pointer"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.45, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-full sm:w-[450px] bg-charcoal-gray border-r border-bronze-border overflow-y-auto p-6 sm:p-8 flex flex-col justify-between text-left"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-primary">SNV Heritage</span>
                  <button 
                    onClick={() => setSideMenuOpen(false)}
                    className="p-1.5 border border-bronze-border text-on-surface hover:text-primary transition-all rounded-none cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-bronze-border/30">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-[0.25em] block">
                    {lang === 'en' ? 'Sacred Navigation' : 'पावन प्रस्थान मार्ग'}
                  </span>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => { navigateTo('home'); setSideMenuOpen(false); }}
                      className={`w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold transition-all border ${
                        view === 'home' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface hover:border-bronze-border/30 hover:bg-deep-black/30'
                      }`}
                    >
                      {lang === 'en' ? 'Sanctum Home' : 'मुख्य पट'}
                    </button>

                    <button 
                      onClick={() => { navigateTo('shop'); setCategoryFilter('all'); setSideMenuOpen(false); }}
                      className={`w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold transition-all border ${
                        view === 'shop' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface hover:border-bronze-border/30 hover:bg-deep-black/30'
                      }`}
                    >
                      {lang === 'en' ? 'Sacred Catalog' : 'पवित्र संग्रह'}
                    </button>

                    <button 
                      onClick={() => { 
                        setCategoryFilter('dhoop');
                        navigateTo('shop'); 
                        setSideMenuOpen(false); 
                      }}
                      className="w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold text-on-surface hover:bg-deep-black/30 transition-all border border-transparent"
                    >
                      {lang === 'en' ? 'Spiritual Dhoop' : 'आद्यात्मिक धूप कप'}
                    </button>

                    <button 
                      onClick={() => { 
                        setCategoryFilter('havan');
                        navigateTo('shop'); 
                        setSideMenuOpen(false); 
                      }}
                      className="w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold text-on-surface hover:bg-deep-black/30 transition-all border border-transparent"
                    >
                      {lang === 'en' ? 'Havan Samagri' : 'हवन सामग्री'}
                    </button>

                    <button 
                      onClick={() => { navigateTo('checkout'); setSideMenuOpen(false); }}
                      className={`w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold transition-all border ${
                        view === 'checkout' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface hover:border-bronze-border/30 hover:bg-deep-black/30'
                      }`}
                    >
                      {lang === 'en' ? 'Checkout Vault' : 'चेकआउट वॉल्ट'} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                    </button>

                    <button 
                      onClick={() => { navigateTo('admin'); setSideMenuOpen(false); }}
                      className={`w-full text-left py-2.5 px-4 font-sans text-xs uppercase tracking-widest font-semibold transition-all border ${
                        view === 'admin' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface hover:border-bronze-border/30 hover:bg-deep-black/30'
                      }`}
                    >
                      {lang === 'en' ? 'Control Panel (Admin)' : 'नियंत्रण कक्ष (Admin)'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-bronze-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-[0.25em] block">
                      {lang === 'en' ? 'Legacy Making-Process' : 'धूप बनाने की पावन प्रक्रिया'}
                    </span>
                    <button 
                      onClick={() => { setGalleryOpen(true); setSideMenuOpen(false); }}
                      className="text-[10px] uppercase font-bold text-primary hover:underline"
                    >
                      {lang === 'en' ? 'View All' : 'सभी देखें'}
                    </button>
                  </div>

                  <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                    {lang === 'en' 
                      ? 'Behold our process: sourcing forest herbs under natural shade, natural Gir cow dung bases, and slow sun-drying.'
                      : 'हमारे पवित्र निर्माण दर्शन को साक्षात देखें: जैविक वैदिक जड़ी-बूटीयों का एकत्रण, धूप कप का हस्तनिर्मित शुष्कन एवं प्राकृतिक संरक्षण।'}
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.slice(0, 4).map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setGalleryOpen(true); setSideMenuOpen(false); }}
                        className="relative aspect-square border border-bronze-border/50 overflow-hidden cursor-pointer group"
                      >
                        <img 
                          alt="Process Preview" 
                          src={img} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all brightness-75 hover:brightness-100" 
                        />
                      </div>
                    ))}
                  </div>

                  <div className="relative pt-2">
                    <input 
                      type="file" 
                      id="drawer-file-upload" 
                      accept="image/*" 
                      onChange={handleProcessImageUpload} 
                      className="hidden" 
                    />
                    <label 
                      htmlFor="drawer-file-upload"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-primary/40 hover:border-primary text-primary transition-all bg-primary/5 hover:bg-primary/10 text-xs font-sans font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <Camera className="w-4 h-4 animate-bounce" />
                      <span>{lang === 'en' ? 'Upload Production Photo' : 'निर्माण प्रक्रिया फोटो जोड़ें'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-bronze-border/20 text-center text-[10px] text-on-surface-variant uppercase tracking-widest">
                <p className="font-serif italic text-primary/80 mb-1">"शमी शमयते पापम्, शमी शत्रुविनाशिनी।"</p>
                <p>&copy; Shree Narayani Vedica Heritage</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- FLOATING WHATSAPP INTERACTIVE BADGE (BOTTOM-RIGHT) --- */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/919520004353?text=Jai%20Mataa%20Di!%20I%20am%20interested%20in%20SHREE%20NARAYANI%20VEDICA's%20sacred%20essential%20offerings%20for%20my%20home."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white font-bold shadow-2xl transition-all hover:scale-108 hover:shadow-[0_0_20px_#10b981] group relative cursor-pointer"
          title="Connect on WhatsApp / व्हाट्सएप पर संपर्क करें"
        >
          {/* Saffron pulse waves around emerald WhatsApp */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping -z-10" />

          {/* SVG WhatsApp minimalist icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-7 h-7 text-white fill-current"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.455 4.7 1.456 5.483 0 9.95-4.467 9.952-9.953.001-2.657-1.02-5.155-2.872-7.011C16.52 1.8 14.04 1.778 11.4 1.778c-5.485 0-9.951 4.468-9.953 9.953-.001 1.758.46 3.475 1.332 4.978L1.683 20.73l4.964-1.302q.315.188.601.326z M15.65 13.56c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11-.15.22-.58.73-.7.88-.13.15-.25.17-.47.06-.22-.11-.93-.34-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.15-.22.22-.36.07-.15.03-.28-.02-.38-.05-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.37h-.42c-.15 0-.38.06-.58.28-.2.22-.77.75-.77 1.83s.78 2.13.89 2.28c.11.15 1.54 2.35 3.74 3.3.52.23.93.36 1.25.46.52.17 1 .14 1.37.09.42-.06 1.3-.53 1.48-1.04.18-.51.18-.95.12-1.04-.05-.09-.2-.13-.42-.24z"/>
          </svg>
          
          {/* Help pop-up marker */}
          <span className="absolute bottom-16 right-0 w-max bg-charcoal-gray text-primary border border-bronze-border text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lang === 'en' ? 'Click to Chat' : 'व्हाट्सएप चैट'}
          </span>
        </a>
      </div>

    </div>
  );
}
