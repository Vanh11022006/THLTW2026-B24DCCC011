import { useState, useEffect } from 'react';
import { Order } from './types';

const ORDERS_STORAGE_KEY = 'orders_data';

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: '1', productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 },
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) {
          setOrders(JSON.parse(stored));
        } else {
          setOrders(DEFAULT_ORDERS);
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders(DEFAULT_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to save orders:', error);
    }
  };

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    saveOrders(newOrders);
  };

  const updateOrder = (id: string, updatedData: Partial<Order>) => {
    const newOrders = orders.map((o) =>
      o.id === id ? { ...o, ...updatedData } : o
    );
    saveOrders(newOrders);
  };

  const deleteOrder = (id: string) => {
    const newOrders = orders.filter((o) => o.id !== id);
    saveOrders(newOrders);
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    updateOrder(id, { status });
  };

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    updateOrderStatus,
  };
};

export default useOrder;
