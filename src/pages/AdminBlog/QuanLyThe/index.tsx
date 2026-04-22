import React, { useState } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Modal, Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { mockTags, mockPosts } from '../../Blog/data';

interface TagData {
  id: string;
  name: string;
  postCount: number;
}

const QuanLyThe: React.FC = () => {
  const initialData: TagData[] = mockTags.map((tag, index) => ({
    id: index.toString(),
    name: tag,
    postCount: mockPosts.filter(p => p.tags.includes(tag)).length,
  }));

  const [dataSource, setDataSource] = useState<TagData[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<TagData | undefined>(undefined);
  const [form] = Form.useForm();

  const handleOpenModal = (record?: TagData) => {
    setCurrentRow(record);
    form.setFieldsValue(record || { name: '' });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    message.success('Đã xóa thẻ!');
  };

  const handleFinish = (values: { name: string }) => {
    if (currentRow) {
      setDataSource(dataSource.map(item => item.id === currentRow.id ? { ...item, name: values.name } : item));
      message.success('Sửa tên thẻ thành công!');
    } else {
      setDataSource([...dataSource, { id: Date.now().toString(), name: values.name, postCount: 0 }]);
      message.success('Thêm thẻ mới thành công!');
    }
    setIsModalVisible(false);
  };

  const columns: ProColumns<TagData>[] = [
    { title: 'Tên thẻ (Tag)', dataIndex: 'name' },
    { title: 'Số bài viết sử dụng', dataIndex: 'postCount', hideInSearch: true },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>,
        <Popconfirm key="delete" title="Xóa thẻ này?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TagData>
        headerTitle="Danh sách Thẻ"
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        search={false} 
        pagination={{ pageSize: 10 }}
   
        
        options={{
          reload: () => {
            message.success('Đã cập nhật dữ liệu mới nhất!');
          },
          density: false, 
          setting: false, 
        }}

        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Thêm Thẻ mới
          </Button>,
        ]}
      />

      <Modal
        title={currentRow ? 'Sửa Thẻ' : 'Thêm Thẻ mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên Thẻ" rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
            <Input placeholder="Ví dụ: Lập trình, JavaScript..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuanLyThe;