import { Form, Button, Select, Input, Table, message, Card, Row, Col, Divider } from 'antd';
import { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { Order, OrderItem } from '../../models/quanlysanpham';
import { useProduct, useOrder } from '../../models/quanlysanpham';

const CreateOrderForm: React.FC = () => {
  const { products } = useProduct();
  const { addOrder, orders } = useOrder();
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);

  const handleProductSelect = (productId: string) => {
    if (!selectedProducts.has(productId)) {
      setSelectedProducts(new Map(selectedProducts).set(productId, 1));
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    if (quantity > product.quantity) {
      message.error(`Số lượng không thể vượt quá ${product.quantity}`);
      return;
    }

    if (quantity <= 0) {
      const newMap = new Map(selectedProducts);
      newMap.delete(productId);
      setSelectedProducts(newMap);
    } else {
      setSelectedProducts(new Map(selectedProducts).set(productId, quantity));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const newMap = new Map(selectedProducts);
    newMap.delete(productId);
    setSelectedProducts(newMap);
  };

  // Calculate total amount
  const getTotalAmount = () => {
    let total = 0;
    selectedProducts.forEach((quantity, productId) => {
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        total += product.price * quantity;
      }
    });
    return total;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validation
      if (selectedProducts.size === 0) {
        message.error('Vui lòng chọn ít nhất một sản phẩm');
        return;
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(values.phone)) {
        message.error('Số điện thoại phải có 10-11 chữ số');
        return;
      }

      setLoading(true);

      // Create order
      const orderProducts: OrderItem[] = [];
      selectedProducts.forEach((quantity, productId) => {
        const product = products.find((p: any) => p.id === productId);
        if (product) {
          orderProducts.push({
            productId: product.id,
            quantity,
            price: product.price,
          });
        }
      });

      const newOrder: Order = {
        id: `DH${String(orders.length + 1).padStart(3, '0')}`,
        customerName: values.customerName,
        customerEmail: values.email || '',
        customerPhone: values.phone,
        products: orderProducts,
        totalPrice: getTotalAmount(),
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      addOrder(newOrder);

      message.success('Tạo đơn hàng thành công!');

      // Reset form
      form.resetFields();
      setSelectedProducts(new Map());
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products
    .filter((p: any) => p.quantity > 0)
    .map((p: any) => ({
      label: `${p.name} (${p.quantity} còn lại)`,
      value: p.id,
    }));

  return (
    <Card title='Tạo đơn hàng mới'>
      <Form form={form} layout='vertical'>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label='Tên khách hàng'
              name='customerName'
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
            >
              <Input placeholder='Nhập tên khách hàng' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label='Số điện thoại'
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: 'Số điện thoại phải có 10-11 chữ số',
                },
              ]}
            >
              <Input placeholder='Nhập số điện thoại (10-11 chữ số)' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Địa chỉ'
          name='address'
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder='Nhập địa chỉ giao hàng' />
        </Form.Item>

        <Divider>Chọn sản phẩm</Divider>

        <Form.Item
          label='Sản phẩm'
          name='product'
        >
          <Select
            placeholder='Chọn sản phẩm'
            options={productOptions}
            onChange={handleProductSelect}
          />
        </Form.Item>

        {/* Selected Products Table */}
        {selectedProducts.size > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4>Sản phẩm đã chọn:</h4>
            <Table
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'productId',
                  key: 'productId',
                  render: (productId: string) => {
                    const product = products.find((p: any) => p.id === productId);
                    return product?.name || '';
                  },
                },
                {
                  title: 'Giá',
                  dataIndex: 'productId',
                  key: 'price',
                  render: (productId: string) => {
                    const product = products.find((p: any) => p.id === productId);
                    return product
                      ? new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)
                      : '';
                  },
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: 150,
                  render: (_, __, index) => {
                    const productId = Array.from(selectedProducts.keys())[index];
                    const quantity = selectedProducts.get(productId) || 0;
                    return (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button
                          type='text'
                          icon={<MinusOutlined />}
                          onClick={() => handleQuantityChange(productId, quantity - 1)}
                        />
                        <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                        <Button
                          type='text'
                          icon={<PlusOutlined />}
                          onClick={() => handleQuantityChange(productId, quantity + 1)}
                        />
                      </div>
                    );
                  },
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'productId',
                  key: 'total',
                  render: (productId: string) => {
                    const product = products.find((p: any) => p.id === productId);
                    const quantity = selectedProducts.get(productId) || 0;
                    if (!product) return '';
                    return new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price * quantity);
                  },
                },
                {
                  title: 'Thao tác',
                  key: 'action',
                  width: 100,
                  render: (_, __, index) => {
                    const productId = Array.from(selectedProducts.keys())[index];
                    return (
                      <Button
                        danger
                        size='small'
                        onClick={() => handleRemoveProduct(productId)}
                      >
                        Xóa
                      </Button>
                    );
                  },
                },
              ]}
              dataSource={Array.from(selectedProducts.keys()).map((productId, index) => ({
                key: productId,
                productId,
              }))}
              pagination={false}
              size='small'
            />
          </div>
        )}

        {selectedProducts.size > 0 && (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <h3>
              Tổng tiền:{' '}
              <span style={{ color: '#f5222d', fontSize: '18px', fontWeight: 'bold' }}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(getTotalAmount())}
              </span>
            </h3>
          </div>
        )}

        <Button
          type='primary'
          size='large'
          onClick={handleSubmit}
          loading={loading}
          disabled={selectedProducts.size === 0}
        >
          Tạo đơn hàng
        </Button>
      </Form>
    </Card>
  );
};

export default CreateOrderForm;
