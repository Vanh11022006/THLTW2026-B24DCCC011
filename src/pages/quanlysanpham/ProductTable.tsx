import { Table, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import type { Product } from '../../models/quanlysanpham/product';
import useProduct from '../../models/quanlysanpham/product';

interface ProductTableProps {
  onEdit?: (record: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ onEdit }) => {
  const { products, loading, getProducts, deleteProduct } = useProduct();

  useEffect(() => {
    getProducts();
  }, []);

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price);
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number) => quantity,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size='small'>
          <Button
            type='primary'
            size='small'
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa sản phẩm này?'
            onConfirm={() => deleteProduct(record.id)}
            okText='Có'
            cancelText='Không'
          >
            <Button danger size='small' icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products.map((p) => ({ ...p, key: p.id }))}
      loading={loading}
      pagination={{
        pageSize: 10,
        total: products.length,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
      }}
      bordered
      size='middle'
    />
  );
};

export default ProductTable;
