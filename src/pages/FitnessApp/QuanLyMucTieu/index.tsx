import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Popconfirm, Tag, Drawer, Form, Input, Select, InputNumber, Progress, Row, Col, Segmented, message, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockGoals, Goal } from '../data';

const QuanLyMucTieu: React.FC = () => {
  const [dataSource, setDataSource] = useState<Goal[]>(mockGoals);
  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredData = filterStatus === 'Tất cả' ? dataSource : dataSource.filter(g => g.status === filterStatus);

  const handleAdd = (values: any) => {
    const newGoal: Goal = {
      ...values,
      id: Date.now().toString(),
      deadline: values.deadline.format('YYYY-MM-DD'),
      currentValue: 0,
      status: 'Đang thực hiện'
    };
    setDataSource([...dataSource, newGoal]);
    setIsDrawerVisible(false);
    message.success('Thêm mục tiêu thành công');
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter(g => g.id !== id));
    message.success('Đã xóa mục tiêu');
  };

  const handleUpdateProgress = (id: string, val: number | null) => {
    if (val === null) return;
    setDataSource(dataSource.map(g => {
      if (g.id === id) {
        const status = val >= g.targetValue ? 'Đã đạt' : g.status;
        return { ...g, currentValue: val, status };
      }
      return g;
    }));
  };

  return (
    <PageContainer
      extra={[
        <Segmented key="seg" options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} value={filterStatus} onChange={(val) => setFilterStatus(val as string)} />,
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsDrawerVisible(true); }}>Thêm mục tiêu</Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        {filteredData.map(goal => {
          const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          return (
            <Col xs={24} sm={12} md={8} key={goal.id}>
              <Card
                title={goal.name}
                extra={<Tag color={goal.status === 'Đã đạt' ? 'green' : goal.status === 'Đang thực hiện' ? 'blue' : 'default'}>{goal.status}</Tag>}
                actions={[
                  <Popconfirm key="del" title="Xóa?" onConfirm={() => handleDelete(goal.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
                  </Popconfirm>
                ]}
              >
                <p style={{ margin: '0 0 8px 0', color: 'gray' }}>Loại: {goal.type}</p>
                <p style={{ margin: '0 0 16px 0', color: 'gray' }}>Hạn: {goal.deadline}</p>
                <Progress percent={percent} status={percent === 100 ? 'success' : 'active'} />
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Tiến độ:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InputNumber min={0} value={goal.currentValue} onChange={(val) => handleUpdateProgress(goal.id, val)} />
                    <span>/ {goal.targetValue}</span>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer title="Thêm Mục tiêu mới" width={400} onClose={() => setIsDrawerVisible(false)} open={isDrawerVisible}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}><Select options={[{value:'Giảm cân'},{value:'Tăng cơ'},{value:'Cải thiện sức bền'},{value:'Khác'}]} /></Form.Item>
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item>
          <Button type="primary" htmlType="submit" block>Tạo mục tiêu</Button>
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default QuanLyMucTieu;