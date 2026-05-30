export interface Product {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  originalPrice?: number;
  size: string;
  sizeHi: string;
  category: 'dhoop' | 'agarbatti' | 'havan';
  categoryHi: string;
  images: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  date: string;
  amount: number;
  items: {
    productName: string;
    productNameHi: string;
    quantity: number;
    price: number;
  }[];
  status: 'Shipped' | 'Processing' | 'Delivered' | 'Pending';
  statusHi: string;
}
