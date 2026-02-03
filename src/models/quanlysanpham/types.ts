// Product Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}
