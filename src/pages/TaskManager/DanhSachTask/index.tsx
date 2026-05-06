import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getTasks, saveTasks, Task } from '../data';

const DanhSachTask: React.FC = () => {
  const [dataSource, setDataSource] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Task | undefined>(undefined);
  const [form] = Form.useForm();

  useEffect(() => {
    setDataSource(getTasks());
  }, []);

  const handleOpenModal = (record?: Task) => {
    setCurrentRow(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'TODO', priority: 'MEDIUM' });
    }
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
    saveTasks(newData);
    message.success('Đã xóa công việc');
  };

  const handleFinish = (values: any) => {
    let newData;
    if (currentRow) {
      newData = dataSource.map((item) => (item.id === currentRow.id ? { ...item, ...values } : item));
      message.success('Cập nhật thành công');
    } else {
      const newTask: Task = {
        ...values,
        id: Date.now().toString(),
      };
      newData = [...dataSource, newTask];
      message.success('Thêm mới thành công');
    }
    setDataSource(newData);
    saveTasks(newData);
    setIsModalVisible(false);
  };

  const columns: ProColumns<Task>[] = [
    { title: 'Tên công việc', dataIndex: 'title', width: 200 },
    { title: 'Mô tả', dataIndex: 'description', hideInSearch: true, ellipsis: true },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      valueType: 'date',
      sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      hideInSearch: true,
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      valueType: 'select',
      valueEnum: {
        HIGH: { text: 'Cao', status: 'Error' },
        MEDIUM: { text: 'Trung bình', status: 'Warning' },
        LOW: { text: 'Thấp', status: 'Success' },
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        TODO: { text: 'Cần làm', status: 'Default' },
        IN_PROGRESS: { text: 'Đang làm', status: 'Processing' },
        DONE: { text: 'Hoàn thành', status: 'Success' },
      },
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, record) => (
        <>
          {record.tags?.map(tag => (
            <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
          Sửa
        </Button>,
        <Popconfirm key="delete" title="Xóa công việc này?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Task>
        headerTitle="Danh sách công việc"
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        options={{ density: false, setting: false }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Thêm công việc
          </Button>,
        ]}
      />

      <Modal
        title={currentRow ? 'Sửa công việc' : 'Thêm công việc'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Tên công việc" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="deadline" label="Hạn chót" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Cao', value: 'HIGH' },
                { label: 'Trung bình', value: 'MEDIUM' },
                { label: 'Thấp', value: 'LOW' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Cần làm', value: 'TODO' },
                { label: 'Đang làm', value: 'IN_PROGRESS' },
                { label: 'Hoàn thành', value: 'DONE' },
              ]}
            />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ (Tags)">
            <Select mode="tags" placeholder="Nhập tag và ấn Enter" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DanhSachTask;