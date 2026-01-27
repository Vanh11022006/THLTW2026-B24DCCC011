import { Button, Modal, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import type { Product } from '../../models/quanlysanpham/product';
import useProduct from '../../models/quanlysanpham/product';
import ProductTable from './ProductTable';

const QuanLySanPham: React.FC = () => {
  const { addProduct, updateProduct } = useProduct();
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const handleAddProduct = () => {
    setIsEdit(false);
    setEditingProduct(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: Product) => {
    setIsEdit(true);
    setEditingProduct(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && editingProduct) {
        updateProduct(editingProduct.id, values);
      } else {
        addProduct({
          id: Date.now().toString(),
          ...values,
        });
      }
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý sản phẩm</h1>
        <Button type='primary' size='large' onClick={handleAddProduct}>
          + Thêm sản phẩm
        </Button>
      </div>

      <ProductTable onEdit={handleEdit} />

      <Modal
        title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        okText='Lưu'
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            rules={[{ required: true
              , message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder='Nhập tên sản phẩm' />
          </Form.Item>

          <Form.Item
            label='Giá'
            name='price'
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 0, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập giá' />
          </Form.Item>

          <Form.Item
            label='Số lượng'
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
