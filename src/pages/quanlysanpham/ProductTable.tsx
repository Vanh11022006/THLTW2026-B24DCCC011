import { Table, Button, Space, Popconfirm, Tag, Input, Select, Slider, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState, useMemo } from 'react';
import type { Product } from '../../models/quanlysanpham/types';
import useProduct from '../../models/quanlysanpham/useProduct';

interface ProductTableProps {
  onEdit?: (record: Product) => void;
}

type SortOrder = 'ascend' | 'descend' | null;

const ProductTable: React.FC<ProductTableProps> = ({ onEdit }) => {
  const { products, deleteProduct } = useProduct();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortType, setSortType] = useState<'name' | 'price' | 'quantity'>('name');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Get product status
  const getProductStatus = (quantity: number) => {
    if (quantity > 10) return 'Còn hàng';
    if (quantity > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn hàng':
        return 'green';
      case 'Sắp hết':
        return 'orange';
      case 'Hết hàng':
        return 'red';
      default:
        return 'default';
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search by name
      if (
        searchText &&
        !product.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Filter by status
      if (statusFilter) {
        const status = getProductStatus(product.quantity);
        if (status !== statusFilter) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortType === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortType === 'price') {
        compareValue = a.price - b.price;
      } else if (sortType === 'quantity') {
        compareValue = a.quantity - b.quantity;
      }

      return sortOrder === 'descend' ? -compareValue : compareValue;
    });

    return filtered;
  }, [products, searchText, selectedCategory, priceRange, statusFilter, sortOrder, sortType]);

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
      width: 220,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
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
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity: number) => quantity,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const status = getProductStatus(record.quantity);
        return (
          <Tag color={getStatusColor(status)}>
            {status}
          </Tag>
        );
      },
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
    <div>
      {/* Filters */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tìm kiếm sản phẩm</label>
            <Input
              placeholder='Nhập tên sản phẩm'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Danh mục</label>
            <Select
              placeholder='Chọn danh mục'
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Trạng thái</label>
            <Select
              placeholder='Chọn trạng thái'
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value='Còn hàng'>Còn hàng</Select.Option>
              <Select.Option value='Sắp hết'>Sắp hết</Select.Option>
              <Select.Option value='Hết hàng'>Hết hàng</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Sắp xếp theo</label>
            <Select
              value={sortType}
              onChange={setSortType}
              style={{ width: '100%' }}
            >
              <Select.Option value='name'>Tên (A-Z)</Select.Option>
              <Select.Option value='price'>Giá</Select.Option>
              <Select.Option value='quantity'>Số lượng</Select.Option>
            </Select>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '15px' }}>
          <Col xs={24} md={12}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Khoảng giá: {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')} VND
            </label>
            <Slider
              range
              min={0}
              max={100000000}
              step={1000000}
              value={priceRange}
              onChange={(value) => setPriceRange(value as [number, number])}
            />
          </Col>

          <Col xs={24} md={12}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Thứ tự</label>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ width: '100%' }}
            >
              <Select.Option value={null}>Mặc định</Select.Option>
              <Select.Option value='ascend'>Tăng dần</Select.Option>
              <Select.Option value='descend'>Giảm dần</Select.Option>
            </Select>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredProducts.map((p) => ({ ...p, key: p.id }))}
        pagination={{
          pageSize: 5,
          total: filteredProducts.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
        }}
        bordered
        size='middle'
      />
    </div>
  );
};

export default ProductTable;
