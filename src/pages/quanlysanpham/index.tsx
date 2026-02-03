import { Button, Modal, Form, Input, InputNumber, Select, message, Tabs, Card, Row, Col, Statistic } from 'antd';
import { useState } from 'react';
import type { Product } from '../../models/quanlysanpham/types';
import useProduct from '../../models/quanlysanpham/useProduct';
import useOrder from '../../models/quanlysanpham/useOrder';
import ProductTable from './ProductTable';
import OrderTable from './OrderTable';
import CreateOrderForm from './CreateOrderForm';

const QuanLySanPham: React.FC = () => {
  const { products, addProduct, updateProduct } = useProduct();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState('products');
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm] = Form.useForm();

  const handleAddProduct = () => {
    setIsEditingProduct(false);
    setEditingProduct(null);
    productForm.resetFields();
    setProductModalVisible(true);
  };

  const handleEditProduct = (record: Product) => {
    setIsEditingProduct(true);
    setEditingProduct(record);
    productForm.setFieldsValue(record);
    setProductModalVisible(true);
  };

  const handleProductSubmit = async () => {
    try {
      const values = await productForm.validateFields();
      if (isEditingProduct && editingProduct) {
        updateProduct(editingProduct.id, values);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        addProduct({
          id: Date.now().toString(),
          ...values,
        });
        message.success('Thêm sản phẩm thành công');
      }
      setProductModalVisible(false);
      productForm.resetFields();
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const categories = [
    'Laptop',
    'Điện thoại',
    'Máy tính bảng',
    'Phụ kiện',
  ];

  // Calculate statistics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Hoàn thành');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div style={{ padding: '20px' }}>
      {/* Statistics Section */}
      {activeTab === 'products' && (
        <Card style={{ marginBottom: '20px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Tổng số sản phẩm'
                value={totalProducts}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Tổng giá trị tồn kho'
                value={totalInventoryValue}
                prefix='₫'
                precision={0}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Sản phẩm còn hàng'
                value={products.filter(p => p.quantity > 10).length}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Sản phẩm hết hàng'
                value={products.filter(p => p.quantity === 0).length}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === 'orders' && (
        <Card style={{ marginBottom: '20px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Tổng số đơn hàng'
                value={totalOrders}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Doanh thu'
                value={totalRevenue}
                prefix='₫'
                precision={0}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Đơn hàng hoàn thành'
                value={completedOrders.length}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title='Đơn hàng chờ xử lý'
                value={orders.filter(o => o.status === 'Chờ xử lý').length}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.TabPane tab='Quản lý Sản phẩm' key='products'>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Button type='primary' size='large' onClick={handleAddProduct}>
                + Thêm sản phẩm
              </Button>
            </div>
            <ProductTable onEdit={handleEditProduct} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Quản lý Đơn hàng' key='orders'>
          <div>
            <CreateOrderForm />
            <div style={{ marginTop: '30px' }}>
              <h2>Danh sách đơn hàng</h2>
              <OrderTable />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>

      {/* Product Modal */}
      <Modal
        title={isEditingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={productModalVisible}
        onOk={handleProductSubmit}
        onCancel={() => {
          setProductModalVisible(false);
          productForm.resetFields();
        }}
        okText='Lưu'
        cancelText='Hủy'
        width={600}
      >
        <Form form={productForm} layout='vertical'>
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder='Nhập tên sản phẩm' />
          </Form.Item>

          <Form.Item
            label='Danh mục'
            name='category'
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder='Chọn danh mục'>
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Giá (VND)'
            name='price'
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 0, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập giá' />
          </Form.Item>

          <Form.Item
            label='Số lượng tồn kho'
            name='quantity'
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 0, message: 'Số lượng phải là số dương' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số lượng' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLySanPham;
