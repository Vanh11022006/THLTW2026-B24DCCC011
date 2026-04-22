import React, { useState, useMemo } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { mockPosts, mockTags, Post } from '../../Blog/data';

const QuanLyBaiViet: React.FC = () => {
  const [dataSource, setDataSource] = useState<Post[]>(mockPosts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Post | undefined>(undefined);
  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useState<any>({});

  const displayData = useMemo(() => {
    return dataSource.filter((item) => {
      let isMatch = true;
      if (searchParams.title) {
        isMatch = isMatch && item.title.toLowerCase().includes(searchParams.title.toLowerCase());
      }
      if (searchParams.status) {
        isMatch = isMatch && item.status === searchParams.status;
      }
      return isMatch;
    });
  }, [dataSource, searchParams]);

  const handleOpenModal = (record?: Post) => {
    setCurrentRow(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'DRAFT', viewCount: 0 }); 
    }
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    message.success('Đã xóa bài viết!');
  };

  const handleFinish = (values: any) => {
    if (currentRow) {
      setDataSource(dataSource.map((item) => (item.id === currentRow.id ? { ...item, ...values } : item)));
      message.success('Cập nhật bài viết thành công!');
    } else {
      const newPost: Post = {
        ...values,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Admin',
        viewCount: 0,
      };
      setDataSource([newPost, ...dataSource]);
      message.success('Thêm mới bài viết thành công!');
    }
    setIsModalVisible(false);
  };

  const columns: ProColumns<Post>[] = [
    { title: 'Tiêu đề', dataIndex: 'title', width: 250 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        DRAFT: { text: 'Nháp', status: 'Default' },
        PUBLISHED: { text: 'Đã đăng', status: 'Success' },
      },
    },
    {
      title: 'Thẻ (Tags)',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, record) => (
        <>{record.tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}</>
      ),
    },
    { title: 'Lượt xem', dataIndex: 'viewCount', hideInSearch: true, sorter: (a, b) => a.viewCount - b.viewCount },
    { title: 'Ngày tạo', dataIndex: 'createdAt', hideInSearch: true },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>,
        <Popconfirm key="delete" title="Xóa bài viết này?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>,
      ],
    },
  ];

  const tagOptions = mockTags.map(tag => ({ label: tag, value: tag }));

  return (
    <PageContainer>
      <ProTable<Post>
        headerTitle="Danh sách Bài viết"
        columns={columns}
        dataSource={displayData} 
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        
        onSubmit={(params) => setSearchParams(params)}
        onReset={() => setSearchParams({})}
        
   
        options={{
          reload: () => {
            setSearchParams({}); 
            message.success('Đã làm mới dữ liệu!');
          },
          density: false, 
          setting: false, 
        }}

        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Viết bài mới
          </Button>,
        ]}
      />

      <Modal
        title={currentRow ? 'Sửa bài viết' : 'Viết bài mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
            <Input placeholder="ví-dụ-bai-viet-hay" />
          </Form.Item>
          <Form.Item name="coverImage" label="URL Ảnh đại diện">
            <Input />
          </Form.Item>
          <Form.Item name="summary" label="Tóm tắt">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung (Hỗ trợ Markdown)" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Nhập nội dung Markdown vào đây..." />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ (Tags)">
            <Select mode="multiple" options={tagOptions} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={[ { label: 'Nháp', value: 'DRAFT' }, { label: 'Đã đăng', value: 'PUBLISHED' } ]} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuanLyBaiViet;