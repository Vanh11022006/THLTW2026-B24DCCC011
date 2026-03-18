import React, { useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Appointment } from './types';
import type { ColumnsType } from 'antd/es/table';
import { useAppContext } from './AppContext';

export const AppointmentManager: React.FC = () => {
  const { appointments, setAppointments } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="gold">Chờ duyệt</Tag>;
      case 'CONFIRMED':
        return <Tag color="blue">Đã xác nhận</Tag>;
      case 'COMPLETED':
        return <Tag color="green">Hoàn thành</Tag>;
      case 'CANCELLED':
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointments(
      appointments.map(apt =>
        apt.id === id ? { ...apt, status: newStatus as any } : apt
      )
    );
    message.success(`Cập nhật trạng thái thành "${newStatus}" thành công!`);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    message.success('Xóa lịch hẹn thành công!');
  };

  const filteredAppointments =
    filterStatus === 'all' ? appointments : appointments.filter(apt => apt.status === filterStatus);

  const columns: ColumnsType<Appointment> = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: 'Email', dataIndex: 'customerEmail', key: 'customerEmail' },
    { title: 'Ngày hẹn', dataIndex: 'date', key: 'date' },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <Popconfirm
              title="Xác nhận lịch hẹn?"
              onConfirm={() => handleStatusChange(record.id, 'CONFIRMED')}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
                Xác nhận
              </Button>
            </Popconfirm>
          )}

          {record.status === 'CONFIRMED' && (
            <Popconfirm
              title="Đánh dấu hoàn thành?"
              onConfirm={() => handleStatusChange(record.id, 'COMPLETED')}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" size="small" style={{ background: 'green' }}>
                Hoàn thành
              </Button>
            </Popconfirm>
          )}

          {record.status !== 'COMPLETED' && record.status !== 'CANCELLED' && (
            <Popconfirm
              title="Hủy lịch hẹn này?"
              onConfirm={() => handleStatusChange(record.id, 'CANCELLED')}
              okText="Có"
              cancelText="Không"
            >
              <Button danger size="small" icon={<CloseCircleOutlined />}>
                Hủy
              </Button>
            </Popconfirm>
          )}

          <Popconfirm
            title="Xóa lịch hẹn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />} type="text">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <span>Lọc theo trạng thái:</span>
        <Button
          type={filterStatus === 'all' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('all')}
        >
          Tất cả ({appointments.length})
        </Button>
        <Button
          type={filterStatus === 'PENDING' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('PENDING')}
        >
          Chờ duyệt ({appointments.filter(a => a.status === 'PENDING').length})
        </Button>
        <Button
          type={filterStatus === 'CONFIRMED' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('CONFIRMED')}
        >
          Đã xác nhận ({appointments.filter(a => a.status === 'CONFIRMED').length})
        </Button>
        <Button
          type={filterStatus === 'COMPLETED' ? 'primary' : 'default'}
          onClick={() => setFilterStatus('COMPLETED')}
        >
          Hoàn thành ({appointments.filter(a => a.status === 'COMPLETED').length})
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredAppointments} rowKey="id" />
    </>
  );
};