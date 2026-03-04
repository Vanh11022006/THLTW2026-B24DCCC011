import { useState } from 'react';
import type { Order } from './types';

const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'a@example.com',
      customerPhone: '0901234567',
      products: [
        { productId: '1', quantity: 1, price: 25000000 },
        { productId: '3', quantity: 2, price: 2500000 },
      ],
      totalPrice: 30000000,
      status: 'completed',
      createdAt: '2024-03-01',
    },
    {
      id: '2',
      customerName: 'Trần Thị B',
      customerEmail: 'b@example.com',
      customerPhone: '0912345678',
      products: [
        { productId: '2', quantity: 1, price: 35000000 },
      ],
      totalPrice: 35000000,
      status: 'pending',
      createdAt: '2024-03-02',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  const addOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const updateOrder = (id: string, updatedOrder: Partial<Order>) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, ...updatedOrder } : o
      )
    );
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    );
  };

  return {
    orders,
    loading,
    getOrders,
    addOrder,
    deleteOrder,
    updateOrder,
    updateOrderStatus,
  };
};

export default useOrder;
