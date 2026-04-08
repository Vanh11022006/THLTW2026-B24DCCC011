import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Space, Tag, Rate, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockDiemDen, DiemDen } from '../../data';

const { TextArea } = Input;

const QuanLyDiemDen: React.FC = () => {
  const [diemDenList, setDiemDenList] = useState<DiemDen[]>(mockDiemDen);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: DiemDen) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xóa điểm đến',
      content: 'Bạn chắc chắn muốn xóa điểm đến này không?',
      okText: 'Có',
      cancelText: 'Không',
      okType: 'danger',
      onOk() {
        setDiemDenList(diemDenList.filter(item => item.id !== id));
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        // Update
        setDiemDenList(
          diemDenList.map(item =>
            item.id === editingId
              ? { ...item, ...values }
              : item
          )
        );
      } else {
        // Add new
        const newId = Math.max(...diemDenList.map(d => d.id), 0) + 1;
        setDiemDenList([...diemDenList, { ...values, id: newId }]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (text: string) => <Image src={text} width={80} height={80} style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Tên điểm đến',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colors: { [key: string]: string } = {
          'biển': 'blue',
          'núi': 'green',
          'thành phố': 'magenta',
        };
        return <Tag color={colors[type] || 'default'}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      render: (price: number) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian tham quan',
      dataIndex: 'timeToVisit',
      key: 'timeToVisit',
      width: 140,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 110,
      render: (_: any, record: DiemDen) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="Quản lý điểm đến"
      subTitle="Thêm, sửa, xóa các điểm đến du lịch"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm điểm đến
        </Button>
      }
    >
      <Card>
        <Table
          dataSource={diemDenList}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} điểm đến`,
          }}
        />
      </Card>

      <Modal
        title={editingId ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Tên điểm đến"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}
          >
            <Input placeholder="Vnh Hạ Long" />
          </Form.Item>

          <Form.Item
            label="Loại hình"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
          >
            <Select placeholder="Chọn loại hình">
              <Select.Option value="biển">Biển</Select.Option>
              <Select.Option value="núi">Núi</Select.Option>
              <Select.Option value="thành phố">Thành phố</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa điểm (Tỉnh/Thành phố)"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input placeholder="Quảng Ninh" />
          </Form.Item>

          <Form.Item
            label="Đánh giá (0-5)"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
          >
            <InputNumber min={0} max={5} step={0.1} />
          </Form.Item>

          <Form.Item
            label="Giá (VND)"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>

          <Form.Item
            label="Thời gian tham quan"
            name="timeToVisit"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan' }]}
          >
            <Input placeholder="1-2 ngày" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Mô tả về điểm đến..." />
          </Form.Item>

          <Form.Item
            label="Link hình ảnh"
            name="image"
            rules={[{ required: true, message: 'Vui lòng nhập link hình ảnh' }]}
          >
            <TextArea rows={2} placeholder="https://images.unsplash.com/..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuanLyDiemDen;
