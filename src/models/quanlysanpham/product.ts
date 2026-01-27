import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const useProduct = () => {
  // Mock data - ít nhất 5 sản phẩm
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      price: 25000000,
      quantity: 5,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      price: 35000000,
      quantity: 10,
    },
    {
      id: '3',
      name: 'Keyboard Mechanical RGB',
      price: 2500000,
      quantity: 20,
    },
    {
      id: '4',
      name: 'Mouse Logitech MX Master 3S',
      price: 3000000,
      quantity: 15,
    },
    {
      id: '5',
      name: 'Monitor LG UltraWide 38"',
      price: 15000000,
      quantity: 8,
    },
    {
      id: '6',
      name: 'Webcam Logitech C920',
      price: 1500000,
      quantity: 12,
    },
  ];

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProducts(mockProducts);
    setLoading(false);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p
      )
    );
  };

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return {
    products,
    loading,
    getProducts,
    deleteProduct,
    updateProduct,
    addProduct,
  };
};

export default useProduct;
