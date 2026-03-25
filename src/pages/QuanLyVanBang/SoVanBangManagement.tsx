import React, { useState } from 'react';
import { Card, Button, Form, Input, DatePicker, Table, Space, Modal, message, Tag, Row, Col, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { SoVanBang } from './types';
import { useAppContext } from './AppContext';

export const SoVanBangManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { soVanBangList, addSoVanBang, updateSoVanBang, deleteSoVanBang } = useAppContext();

  const handleOpenModal = (record?: SoVanBang) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        nam: record.nam,
        soHieu: record.soHieu,
        ngayMo: dayjs(record.ngayMo),
        trangThai: record.trangThai,
        ghiChu: record.ghiChu,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (values: any) => {
    const now = new Date().toISOString();
    const soVanBang: SoVanBang = {
      id: editingId || `svb-${Date.now()}`,
      nam: values.nam,
      soHieu: values.soHieu,
      ngayMo: values.ngayMo.format('YYYY-MM-DD'),
      soVaoSoHienTai: editingId
        ? soVanBangList.find((s) => s.id === editingId)?.soVaoSoHienTai || 1
        : 1,
      trangThai: values.trangThai || 'ACTIVE',
      ghiChu: values.ghiChu,
      createdAt: editingId
        ? soVanBangList.find((s) => s.id === editingId)?.createdAt || now
        : now,
      updatedAt: now,
    };

    if (editingId) {
      updateSoVanBang(soVanBang);
      message.success('Cập nhật sổ văn bằng thành công');
    } else {
      addSoVanBang(soVanBang);
      message.success('Thêm sổ văn bằng thành công');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteSoVanBang(id);
    message.success('Xóa sổ văn bằng thành công');
  };

  const columns = [
    {
      title: 'Năm',
      dataIndex: 'nam',
      key: 'nam',
      width: 100,
    },
    {
      title: 'Số Hiệu',
      dataIndex: 'soHieu',
      key: 'soHieu',
    },
    {
      title: 'Ngày Mở',
      dataIndex: 'ngayMo',
      key: 'ngayMo',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Số Vào Sổ Hiện Tại',
      dataIndex: 'soVaoSoHienTai',
      key: 'soVaoSoHienTai',
      width: 150,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_: any, record: SoVanBang) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa sổ văn bằng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <h2>Quản Lý Sổ Văn Bằng</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm Sổ Văn Bằng
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={soVanBangList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Sổ Văn Bằng' : 'Thêm Sổ Văn Bằng'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCloseModal}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Năm"
            name="nam"
            rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Số Hiệu"
            name="soHieu"
            rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày Mở Sổ"
            name="ngayMo"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Ghi Chú"
            name="ghiChu"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
