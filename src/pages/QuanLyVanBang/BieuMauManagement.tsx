import React, { useState } from 'react';
import { Card, Button, Form, Input, Table, Space, Modal, message, Tag, Row, Col, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { BieuMauPhuLuc, TruongThongTin } from './types';
import { useAppContext } from './AppContext';

export const BieuMauManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFieldModalVisible, setIsFieldModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [selectedBieuMauId, setSelectedBieuMauId] = useState<string | null>(null);
  const [newFields, setNewFields] = useState<TruongThongTin[]>([]);

  const { bieuMauList, soVanBangList, addBieuMau, updateBieuMau, deleteBieuMau } = useAppContext();

  const handleOpenModal = (record?: BieuMauPhuLuc) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ten: record.ten,
        mota: record.mota,
        soVanBangId: record.soVanBangId,
      });
      setNewFields(record.cacTruong || []);
    } else {
      setEditingId(null);
      setNewFields([]);
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
    const bieuMau: BieuMauPhuLuc = {
      id: editingId || `bm-${Date.now()}`,
      ten: values.ten,
      mota: values.mota,
      soVanBangId: values.soVanBangId,
      cacTruong: newFields,
      createdAt: editingId
        ? bieuMauList.find((b) => b.id === editingId)?.createdAt || now
        : now,
      updatedAt: now,
    };

    if (editingId) {
      updateBieuMau(bieuMau);
      message.success('Cập nhật biểu mẫu thành công');
    } else {
      addBieuMau(bieuMau);
      message.success('Thêm biểu mẫu thành công');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteBieuMau(id);
    message.success('Xóa biểu mẫu thành công');
  };

  const handleOpenFieldModal = (field?: TruongThongTin) => {
    if (field) {
      setEditingFieldId(field.id);
      fieldForm.setFieldsValue({
        ten: field.ten,
        kieuDuLieu: field.kieuDuLieu,
        batBuoc: field.batBuoc,
        thuTuHienThi: field.thuTuHienThi,
        ghiChu: field.ghiChu,
      });
    } else {
      setEditingFieldId(null);
      fieldForm.resetFields();
    }
    setIsFieldModalVisible(true);
  };

  const handleAddOrUpdateField = (values: any) => {
    const newField: TruongThongTin = {
      id: editingFieldId || `tf-${Date.now()}`,
      ten: values.ten,
      kieuDuLieu: values.kieuDuLieu,
      batBuoc: values.batBuoc || false,
      thuTuHienThi: values.thuTuHienThi || newFields.length + 1,
      ghiChu: values.ghiChu,
      createdAt: editingFieldId
        ? newFields.find((f) => f.id === editingFieldId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingFieldId) {
      setNewFields(newFields.map((f) => (f.id === editingFieldId ? newField : f)));
      message.success('Cập nhật trường thành công');
    } else {
      setNewFields([...newFields, newField]);
      message.success('Thêm trường thành công');
    }
    setIsFieldModalVisible(false);
    setEditingFieldId(null);
  };

  const handleDeleteField = (id: string) => {
    setNewFields(newFields.filter((f) => f.id !== id));
    message.success('Xóa trường thông tin thành công');
  };

  const columns = [
    {
      title: 'Tên Biểu Mẫu',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'mota',
      key: 'mota',
      ellipsis: true,
    },
    {
      title: 'Sổ Văn Bằng',
      dataIndex: 'soVanBangId',
      key: 'soVanBangId',
      render: (id: string) => soVanBangList.find((s) => s.id === id)?.soHieu || id,
    },
    {
      title: 'Số Trường',
      dataIndex: 'cacTruong',
      key: 'cacTruong',
      render: (fields: TruongThongTin[]) => fields.length,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      render: (_: any, record: BieuMauPhuLuc) => (
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
            description="Bạn có chắc muốn xóa biểu mẫu này?"
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

  const fieldColumns = [
    {
      title: 'Tên Trường',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Kiểu Dữ Liệu',
      dataIndex: 'kieuDuLieu',
      key: 'kieuDuLieu',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Bắt Buộc',
      dataIndex: 'batBuoc',
      key: 'batBuoc',
      render: (value: boolean) => (value ? 'Có' : 'Không'),
    },
    {
      title: 'Thứ Tự',
      dataIndex: 'thuTuHienThi',
      key: 'thuTuHienThi',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_: any, record: TruongThongTin) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenFieldModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa trường này?"
            onConfirm={() => handleDeleteField(record.id)}
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
          <h2>Cấu Hình Biểu Mẫu Phụ Lục</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm Biểu Mẫu
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={bieuMauList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Biểu Mẫu' : 'Thêm Biểu Mẫu'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCloseModal}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên Biểu Mẫu"
            name="ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="mota"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Sổ Văn Bằng"
            name="soVanBangId"
            rules={[{ required: true, message: 'Vui lòng chọn sổ' }]}
          >
            <Select placeholder="Chọn sổ văn bằng">
              {soVanBangList.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.soHieu} (Năm {s.nam})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Card title="Danh Sách Trường Thông Tin" style={{ marginTop: '20px' }}>
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={() => handleOpenFieldModal()}
            >
              Thêm Trường Thông Tin
            </Button>
            <Table
              dataSource={newFields}
              columns={fieldColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Form>
      </Modal>

      <Modal
        title={editingFieldId ? 'Sửa Trường Thông Tin' : 'Thêm Trường Thông Tin'}
        open={isFieldModalVisible}
        onOk={() => fieldForm.submit()}
        onCancel={() => setIsFieldModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={fieldForm}
          layout="vertical"
          onFinish={handleAddOrUpdateField}
        >
          <Form.Item
            label="Tên Trường"
            name="ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input placeholder="VD: Dân tộc, Nơi sinh, Điểm TB" />
          </Form.Item>

          <Form.Item
            label="Kiểu Dữ Liệu"
            name="kieuDuLieu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select>
              <Select.Option value="STRING">Văn bản</Select.Option>
              <Select.Option value="NUMBER">Số</Select.Option>
              <Select.Option value="DATE">Ngày</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Thứ Tự Hiển Thị"
            name="thuTuHienThi"
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="Bắt Buộc"
            name="batBuoc"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item
            label="Ghi Chú"
            name="ghiChu"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
