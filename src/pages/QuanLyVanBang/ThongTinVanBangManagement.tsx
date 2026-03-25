import React, { useState, useMemo } from 'react';
import { Card, Button, Form, Input, DatePicker, Table, Space, Modal, message, Row, Col, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ThongTinVanBang, TruongThongTin } from './types';
import { useAppContext } from './AppContext';

export const ThongTinVanBangManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string | null>(null);

  const {
    thongTinVanBangList,
    soVanBangList,
    quyetDinhList,
    bieuMauList,
    addThongTinVanBang,
    updateThongTinVanBang,
    deleteThongTinVanBang,
  } = useAppContext();

  // Get configured fields for selected diploma register
  const currentBieuMau = useMemo(() => {
    const svb = soVanBangList.find((s) => s.id === selectedSoVanBangId);
    if (!svb) return null;
    return bieuMauList.find((b) => b.soVanBangId === svb.id);
  }, [selectedSoVanBangId, soVanBangList, bieuMauList]);

  const handleOpenModal = (record?: ThongTinVanBang) => {
    if (record) {
      setEditingId(record.id);
      setSelectedSoVanBangId(record.soVanBangId);
      form.setFieldsValue({
        soHieuVanBang: record.soHieuVanBang,
        maSinhVien: record.maSinhVien,
        hoTen: record.hoTen,
        ngaySinh: dayjs(record.ngaySinh),
        quyetDinhId: record.quyetDinhId,
        ...record.thongTinPhuLuc,
      });
    } else {
      setEditingId(null);
      setSelectedSoVanBangId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
  };

  const handleSubmit = (values: any) => {
    if (!selectedSoVanBangId) {
      message.error('Vui lòng chọn sổ văn bằng');
      return;
    }

    const now = new Date().toISOString();
    const svb = soVanBangList.find((s) => s.id === selectedSoVanBangId);

    // Tách thông tin phụ lục từ các trường cấu hình
    const thongTinPhuLuc: Record<string, any> = {};
    if (currentBieuMau) {
      currentBieuMau.cacTruong.forEach((field) => {
        if (values[field.id]) {
          thongTinPhuLuc[field.ten] = values[field.id];
        }
      });
    }

    // Auto-increment soVaoSo if creating new
    let soVaoSo = editingId
      ? thongTinVanBangList.find((t) => t.id === editingId)?.soVaoSo || 1
      : (svb?.soVaoSoHienTai || 1);

    const thongTin: ThongTinVanBang = {
      id: editingId || `tvb-${Date.now()}`,
      soVaoSo,
      soHieuVanBang: values.soHieuVanBang,
      maSinhVien: values.maSinhVien,
      hoTen: values.hoTen,
      ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
      soVanBangId: selectedSoVanBangId,
      quyetDinhId: values.quyetDinhId,
      thongTinPhuLuc,
      createdAt: editingId
        ? thongTinVanBangList.find((t) => t.id === editingId)?.createdAt || now
        : now,
      updatedAt: now,
    };

    if (editingId) {
      updateThongTinVanBang(thongTin);
      message.success('Cập nhật thông tin văn bằng thành công');
    } else {
      addThongTinVanBang(thongTin);
      message.success('Thêm thông tin văn bằng thành công');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteThongTinVanBang(id);
    message.success('Xóa thông tin văn bằng thành công');
  };

  const getQuyetDinhInfo = (id: string) => {
    const qd = quyetDinhList.find((q) => q.id === id);
    return qd ? qd.soQD : id;
  };

  const columns = [
    {
      title: 'Số Vào Sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số Hiệu VB',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 130,
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 100,
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
      width: 110,
    },
    {
      title: 'Quyết Định',
      dataIndex: 'quyetDinhId',
      key: 'quyetDinhId',
      render: (id: string) => getQuyetDinhInfo(id),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_: any, record: ThongTinVanBang) => (
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
            description="Bạn có chắc muốn xóa thông tin văn bằng này?"
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
          <h2>Quản Lý Thông Tin Văn Bằng</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm Văn Bằng
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={thongTinVanBangList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Thông Tin Văn Bằng' : 'Thêm Thông Tin Văn Bằng'}
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
            label="Sổ Văn Bằng"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <Select
              placeholder="Chọn sổ văn bằng"
              value={selectedSoVanBangId}
              onChange={(value) => {
                setSelectedSoVanBangId(value);
                form.resetFields();
              }}
            >
              {soVanBangList.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.soHieu} (Năm {s.nam})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số Hiệu Văn Bằng"
            name="soHieuVanBang"
            rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
          >
            <Input placeholder="VD: VB-2024-00001" />
          </Form.Item>

          <Form.Item
            label="Mã Sinh Viên"
            name="maSinhVien"
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ Tên"
            name="hoTen"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày Sinh"
            name="ngaySinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Quyết Định Tốt Nghiệp"
            name="quyetDinhId"
            rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
          >
            <Select placeholder="Chọn quyết định">
              {quyetDinhList
                .filter((q) => q.soVanBangId === selectedSoVanBangId)
                .map((q) => (
                  <Select.Option key={q.id} value={q.id}>
                    {q.soQD} - {q.trichYeu.substring(0, 30)}...
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          {/* Thêm các trường thông tin được cấu hình */}
          {currentBieuMau &&
            currentBieuMau.cacTruong.map((field) => (
              <Form.Item
                key={field.id}
                label={field.ten}
                name={field.id}
                rules={field.batBuoc ? [{ required: true, message: `Vui lòng nhập ${field.ten}` }] : []}
              >
                {field.kieuDuLieu === 'STRING' && <Input />}
                {field.kieuDuLieu === 'NUMBER' && <InputNumber style={{ width: '100%' }} />}
                {field.kieuDuLieu === 'DATE' && <DatePicker style={{ width: '100%' }} />}
              </Form.Item>
            ))}
        </Form>
      </Modal>
    </Card>
  );
};
