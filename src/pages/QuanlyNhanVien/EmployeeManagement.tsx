import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Checkbox, TimePicker, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { Employee } from './types';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppContext } from './AppContext';

const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export const EmployeeManagement: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const showModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      form.setFieldsValue({
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        dailyLimit: employee.dailyLimit,
        startTime: dayjs(employee.workSchedule.start, 'HH:mm'),
        endTime: dayjs(employee.workSchedule.end, 'HH:mm'),
        workingDays: employee.workSchedule.workingDays,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = (values: any) => {
    const currentEmployee = employees.find(e => e.id === editingId);
    const newEmployee: Employee = {
      id: editingId || `e${Date.now()}`,
      name: values.name,
      phone: values.phone,
      email: values.email,
      dailyLimit: values.dailyLimit,
      workSchedule: {
        start: values.startTime.format('HH:mm'),
        end: values.endTime.format('HH:mm'),
        workingDays: values.workingDays || [],
      },
      averageRating: currentEmployee?.averageRating || 0,
      totalReviews: currentEmployee?.totalReviews || 0,
      createdAt: currentEmployee?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingId) {
      updateEmployee(newEmployee);
      message.success('Cập nhật nhân viên thành công!');
    } else {
      addEmployee(newEmployee);
      message.success('Thêm nhân viên thành công!');
    }

    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    message.success('Xóa nhân viên thành công!');
  };

  const columns: ColumnsType<Employee> = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Giới hạn khách/ngày', dataIndex: 'dailyLimit', key: 'dailyLimit' },
    {
      title: 'Lịch làm việc',
      key: 'schedule',
      render: (_, record) => (
        <span>
          {record.workSchedule.start}-{record.workSchedule.end} | Ngày: {record.workSchedule.workingDays.map(d => days[d]).join(', ')}
        </span>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record) => (
        <span>
          ⭐ {record.averageRating} ({record.totalReviews} đánh giá)
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân viên này?"
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
          Thêm nhân viên
        </Button>
      </div>

      <Table columns={columns} dataSource={employees} rowKey="id" />

      <Modal
        title={editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item name="phone" label="Điện thoại" rules={[{ required: true }]}>
            <Input placeholder="0901234567" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item name="dailyLimit" label="Giới hạn khách/ngày" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="workingDays" label="Ngày làm việc">
            <Checkbox.Group options={days.map((d, i) => ({ label: d, value: i }))} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
