import React, { useState } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Modal, Form, Input, Select, InputNumber, message, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { mockWorkouts, Workout } from '../data';
import dayjs from 'dayjs';

const NhatKyTapLuyen: React.FC = () => {
  const [dataSource, setDataSource] = useState<Workout[]>(mockWorkouts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Workout | undefined>(undefined);
  const [form] = Form.useForm();

  const handleOpenModal = (record?: Workout) => {
    setCurrentRow(record);
    if (record) {
      form.setFieldsValue({ ...record, date: dayjs(record.date) });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'COMPLETED', type: 'Cardio' });
    }
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter(item => item.id !== id));
    message.success('Đã xóa buổi tập');
  };

  const handleFinish = (values: any) => {
    const formattedValues = { ...values, date: values.date.format('YYYY-MM-DD') };
    if (currentRow) {
      setDataSource(dataSource.map(item => item.id === currentRow.id ? { ...item, ...formattedValues } : item));
      message.success('Cập nhật thành công');
    } else {
      setDataSource([{ ...formattedValues, id: Date.now().toString() }, ...dataSource]);
      message.success('Thêm thành công');
    }
    setIsModalVisible(false);
  };

  const columns: ProColumns<Workout>[] = [
    { title: 'Ngày', dataIndex: 'date', valueType: 'date', sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Bài tập', dataIndex: 'name' },
    {
      title: 'Loại', dataIndex: 'type', valueType: 'select',
      valueEnum: {
        Cardio: { text: 'Cardio' }, Strength: { text: 'Strength' },
        Yoga: { text: 'Yoga' }, HIIT: { text: 'HIIT' }, Other: { text: 'Khác' }
      }
    },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', hideInSearch: true },
    { title: 'Calo đốt', dataIndex: 'calories', hideInSearch: true },
    { title: 'Ghi chú', dataIndex: 'notes', hideInSearch: true, ellipsis: true },
    {
      title: 'Trạng thái', dataIndex: 'status', valueType: 'select',
      valueEnum: {
        COMPLETED: { text: 'Hoàn thành', status: 'Success' },
        MISSED: { text: 'Bỏ lỡ', status: 'Error' },
      }
    },
    {
      title: 'Thao tác', valueType: 'option', width: 120,
      render: (_, record) => [
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>,
        <Popconfirm key="delete" title="Xóa?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Workout>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        options={{ density: false, setting: false }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm buổi tập</Button>,
        ]}
      />
      <Modal title={currentRow ? 'Sửa' : 'Thêm'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}><Select options={[{value:'Cardio'},{value:'Strength'},{value:'Yoga'},{value:'HIIT'},{value:'Other'}]} /></Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="calories" label="Calo đốt" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="notes" label="Ghi chú"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Select options={[{label:'Hoàn thành', value:'COMPLETED'},{label:'Bỏ lỡ', value:'MISSED'}]} /></Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default NhatKyTapLuyen;