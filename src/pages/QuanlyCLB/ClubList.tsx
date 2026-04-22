import React, { useState } from 'react';
import { Modal, Form, Input, Button, Table, DatePicker, Space, message, Popconfirm, Switch, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useRequest } from 'umi';
import TinyEditor from '@/components/TinyEditor';
import { getClubs, createClub, updateClub, deleteClub, uploadClubAvatar } from '@/services/QuanlyCLB';
import type { IClub } from './types';
import dayjs from 'dayjs';

interface ClubListProps {
  onViewMembers?: (club: IClub) => void;
}

const ClubList: React.FC<ClubListProps> = ({ onViewMembers }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<IClub | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploadedAvatar, setUploadedAvatar] = useState<string>('');

  // Fetch clubs
  const { data: clubsData, loading: loadingClubs, refresh: refreshClubs } = useRequest(
    () =>
      getClubs({
        page: currentPage,
        limit: pageSize,
        keyword: searchKeyword,
      }),
    {
      debounceWait: 300,
      manual: false,
      refreshDeps: [currentPage, pageSize, searchKeyword],
    }
  );

  const clubs = clubsData?.data?.items || [];
  const total = clubsData?.data?.total || 0;

  // Handle open modal for create/edit
  const handleOpenModal = (club?: IClub) => {
    if (club) {
      setEditingClub(club);
      // Use setTimeout to ensure form is ready before setting values
      setTimeout(() => {
        form.setFieldsValue({
          name: club.name,
          foundedDate: club.foundedDate ? dayjs(club.foundedDate) : null,
          description: club.description,
          president: club.president,
          isActive: club.isActive !== false,
        });
      }, 0);
      setUploadedAvatar(club.avatar);
    } else {
      setEditingClub(null);
      form.resetFields();
      setUploadedAvatar('');
    }
    setIsModalVisible(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingClub(null);
    form.resetFields();
    setUploadedAvatar('');
  };

  // Handle submit form
  const handleSubmit = async (values: any) => {
    try {
      // Only require avatar for new clubs, not for editing
      const avatar = uploadedAvatar || (editingClub?.avatar || '');
      if (!editingClub && !avatar) {
        message.error('Vui lòng tải lên ảnh đại diện');
        return;
      }

      const payload = {
        ...values,
        foundedDate: values.foundedDate?.format('YYYY-MM-DD') || '',
        avatar: avatar,
        isActive: values.isActive || true,
      };

      if (editingClub) {
        await updateClub(editingClub.id, payload);
        message.success('Cập nhật câu lạc bộ thành công');
      } else {
        await createClub(payload);
        message.success('Thêm mới câu lạc bộ thành công');
      }

      handleCloseModal();
      refreshClubs();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteClub(id);
      if (response?.data?.code === 200 || response?.status === 200) {
        message.success('Xóa câu lạc bộ thành công');
        await refreshClubs();
      } else {
        message.error('Xóa thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa');
      console.error('Delete error:', error);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (file: File) => {
    try {
      // Convert file to base64 for mock
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedAvatar(base64);
        message.success('Tải lên ảnh đại diện thành công');
      };
      reader.readAsDataURL(file);
      return false;
    } catch (error) {
      message.error('Tải lên ảnh đại diện thất bại');
      return false;
    }
  };

  // Table columns
  const columns: TableColumnsType<IClub> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
      key: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (isActive ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewMembers?.(record)}
          >
            Thành viên
          </Button>
          <Button
            type="dashed"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa câu lạc bộ"
            description="Bạn chắc chắn muốn xóa câu lạc bộ này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input.Search
          placeholder="Tìm kiếm câu lạc bộ..."
          allowClear
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clubs}
        rowKey="id"
        loading={loadingClubs}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng: ${total} câu lạc bộ`,
        }}
      />

      {/* Modal Create/Edit Club */}
      <Modal
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCloseModal}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên câu lạc bộ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
          >
            <Input placeholder="Nhập tên câu lạc bộ" />
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện"
          >
            <Upload
              maxCount={1}
              beforeUpload={handleAvatarUpload}
              accept="image/*"
            >
              <Button>Tải lên ảnh</Button>
            </Upload>
            {uploadedAvatar && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={uploadedAvatar}
                  alt="preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Ngày thành lập"
            name="foundedDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày thành lập" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <TinyEditor />
          </Form.Item>

          <Form.Item
            label="Chủ nhiệm CLB"
            name="president"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
          >
            <Input placeholder="Nhập tên chủ nhiệm" />
          </Form.Item>

          <Form.Item
            label="Hoạt động"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubList;
