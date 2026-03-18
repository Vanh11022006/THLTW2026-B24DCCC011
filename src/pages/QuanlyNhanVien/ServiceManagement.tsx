import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { Service } from './types';
import type { ColumnsType } from 'antd/es/table';

export const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { id: 's1', name: 'Cắt tóc nam', price: 100000, durationMinutes: 30, description: 'Cắt tóc nam kiểu hiện đại' },
    { id: 's2', name: 'Gội đầu massage', price: 150000, durationMinutes: 60, description: 'Gội đầu kèm massage thư giãn' },
    { id: 's3', name: 'Nhuộm tóc', price: 250000, durationMinutes: 90, description: 'Nhuộm tóc chuyên nghiệp' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const showModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      form.setFieldsValue(service);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = (values: any) => {
    const newService: Service = {
      id: editingId || `s${Date.now()}`,
      name: values.name,
      price: values.price,
      durationMinutes: values.durationMinutes,
      description: values.description,
    };

    if (editingId) {
      setServices(services.map(s => s.id === editingId ? newService : s));
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      setServices([...services, newService]);
      message.success('Thêm dịch vụ thành công!');
    }

    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    message.success('Xóa dịch vụ thành công!');
  };

  const columns: ColumnsType<Service> = [
    { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa dịch vụ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm dịch vụ
        </Button>
      </div>

      <Table columns={columns} dataSource={services} rowKey="id" />

      <Modal
        title={editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}>
            <Input placeholder="Cắt tóc nam" />
          </Form.Item>

          <Form.Item name="price" label="Giá (VND)" rules={[{ required: true }]}>
            <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>

          <Form.Item name="durationMinutes" label="Thời gian thực hiện (phút)" rules={[{ required: true }]}>
            <InputNumber min={5} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả chi tiết về dịch vụ" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
