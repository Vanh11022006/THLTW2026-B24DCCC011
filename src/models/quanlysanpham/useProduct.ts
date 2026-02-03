import { useState, useEffect } from 'react';
import { Product } from './types';

const PRODUCTS_STORAGE_KEY = 'products_data';

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: '2', name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: '3', name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: '4', name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: '5', name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: '6', name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: '7', name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: '8', name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          setProducts(DEFAULT_PRODUCTS);
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(DEFAULT_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  };

  const addProduct = (product: Product) => {
    const newProducts = [...products, product];
    saveProducts(newProducts);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    const newProducts = products.map((p) =>
      p.id === id ? { ...p, ...updatedData } : p
    );
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    saveProducts(newProducts);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const updateQuantity = (id: string, quantityChange: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const newQuantity = Math.max(0, product.quantity + quantityChange);
      updateProduct(id, { quantity: newQuantity });
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    updateQuantity,
  };
};

export default useProduct;
