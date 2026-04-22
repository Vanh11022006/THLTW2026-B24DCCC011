import React, { useState } from 'react';
import { Card, Button, Form, Input, DatePicker, Table, Space, Modal, message, Tag, Row, Col, Select, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { QuyetDinhTotNghiep } from './types';
import { useAppContext } from './AppContext';

export const QuyetDinhManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { quyetDinhList, soVanBangList, addQuyetDinh, updateQuyetDinh, deleteQuyetDinh } = useAppContext();

  const handleOpenModal = (record?: QuyetDinhTotNghiep) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        soQD: record.soQD,
        ngayBanHanh: dayjs(record.ngayBanHanh),
        trichYeu: record.trichYeu,
        soVanBangId: record.soVanBangId,
        trangThai: record.trangThai,
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
    const quyetDinh: QuyetDinhTotNghiep = {
      id: editingId || `qd-${Date.now()}`,
      soQD: values.soQD,
      ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
      trichYeu: values.trichYeu,
      soVanBangId: values.soVanBangId,
      trangThai: values.trangThai || 'DRAFT',
      tongSoLuotTroCuu: editingId
        ? quyetDinhList.find((q) => q.id === editingId)?.tongSoLuotTroCuu || 0
        : 0,
      createdAt: editingId
        ? quyetDinhList.find((q) => q.id === editingId)?.createdAt || now
        : now,
      updatedAt: now,
    };

    if (editingId) {
      updateQuyetDinh(quyetDinh);
      message.success('Cập nhật quyết định thành công');
    } else {
      addQuyetDinh(quyetDinh);
      message.success('Thêm quyết định thành công');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteQuyetDinh(id);
    message.success('Xóa quyết định thành công');
  };

  const getSoVanBangName = (id: string) => {
    return soVanBangList.find((s) => s.id === id)?.soHieu || id;
  };

  const columns = [
    {
      title: 'Số QĐ',
      dataIndex: 'soQD',
      key: 'soQD',
      width: 120,
    },
    {
      title: 'Ngày Ban Hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
      width: 130,
    },
    {
      title: 'Trích Yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
      ellipsis: true,
    },
    {
      title: 'Sổ Văn Bằng',
      dataIndex: 'soVanBangId',
      key: 'soVanBangId',
      render: (id: string) => getSoVanBangName(id),
      width: 140,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => {
        let color = 'default';
        if (status === 'PUBLISHED') color = 'green';
        else if (status === 'DRAFT') color = 'blue';
        else if (status === 'ARCHIVED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Lượt Tra Cứu',
      dataIndex: 'tongSoLuotTroCuu',
      key: 'tongSoLuotTroCuu',
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_: any, record: QuyetDinhTotNghiep) => (
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
            description="Bạn có chắc muốn xóa quyết định này?"
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
          <h2>Quản Lý Quyết Định Tốt Nghiệp</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm Quyết Định
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={quyetDinhList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Quyết Định' : 'Thêm Quyết Định'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCloseModal}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Số Quyết Định"
            name="soQD"
            rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
          >
            <Input placeholder="VD: QĐ-2024-001" />
          </Form.Item>

          <Form.Item
            label="Ngày Ban Hành"
            name="ngayBanHanh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Sổ Văn Bằng"
            name="soVanBangId"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <Select placeholder="Chọn sổ văn bằng">
              {soVanBangList.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.soHieu} (Năm {s.nam})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trích Yếu"
            name="trichYeu"
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
          >
            <Input.TextArea rows={3} placeholder="Nội dung trích yếu quyết định" />
          </Form.Item>

          <Form.Item
            label="Trạng Thái"
            name="trangThai"
          >
            <Select>
              <Select.Option value="DRAFT">Bản nháp</Select.Option>
              <Select.Option value="PUBLISHED">Đã công bố</Select.Option>
              <Select.Option value="ARCHIVED">Lưu trữ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
