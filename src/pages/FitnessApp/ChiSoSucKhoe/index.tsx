import React, { useState } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, Modal, Form, InputNumber, message, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { mockHealthMetrics, HealthMetric, calculateBMI, getBMITag } from '../data';
import dayjs from 'dayjs';

const ChiSoSucKhoe: React.FC = () => {
  const [dataSource, setDataSource] = useState<HealthMetric[]>(mockHealthMetrics);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<HealthMetric | undefined>(undefined);
  const [form] = Form.useForm();

  const handleOpenModal = (record?: HealthMetric) => {
    setCurrentRow(record);
    if (record) form.setFieldsValue({ ...record, date: dayjs(record.date) });
    else form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter(item => item.id !== id));
    message.success('Đã xóa');
  };

  const handleFinish = (values: any) => {
    const formattedValues = { ...values, date: values.date.format('YYYY-MM-DD') };
    if (currentRow) {
      setDataSource(dataSource.map(item => item.id === currentRow.id ? { ...item, ...formattedValues } : item));
      message.success('Đã cập nhật');
    } else {
      setDataSource([{ ...formattedValues, id: Date.now().toString() }, ...dataSource]);
      message.success('Đã thêm');
    }
    setIsModalVisible(false);
  };

  const columns: ProColumns<HealthMetric>[] = [
    { title: 'Ngày', dataIndex: 'date', valueType: 'date', sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', hideInSearch: true },
    { title: 'Chiều cao (cm)', dataIndex: 'height', hideInSearch: true },
    {
      title: 'BMI', hideInSearch: true,
      render: (_, record) => {
        const bmi = calculateBMI(record.weight, record.height);
        const tag = getBMITag(Number(bmi));
        return <Tag color={tag.color}>{bmi} - {tag.text}</Tag>;
      }
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'heartRate', hideInSearch: true },
    { title: 'Giờ ngủ', dataIndex: 'sleep', hideInSearch: true },
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
      <ProTable<HealthMetric>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        search={false}
        options={{ density: false, setting: false }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm chỉ số</Button>]}
      />
      <Modal title={currentRow ? 'Sửa' : 'Thêm'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="heartRate" label="Nhịp tim (bpm)"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="sleep" label="Giờ ngủ"><InputNumber min={0} step={0.5} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ChiSoSucKhoe;