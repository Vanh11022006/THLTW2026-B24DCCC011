import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal, Tag, Empty, message, Progress, InputNumber, Select, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Subject, StudySession, MonthlyGoal } from './types';

interface MonthlyGoalsProps {
  subjects: Subject[];
  sessions: StudySession[];
  monthlyGoals: MonthlyGoal[];
  onSetGoal: (subjectId: string | undefined, month: string, targetHours: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const MonthlyGoals: React.FC<MonthlyGoalsProps> = ({
  subjects,
  sessions,
  monthlyGoals,
  onSetGoal,
  onDeleteGoal,
}) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const calculateProgress = (subjectId: string | undefined, month: string): number => {
    const monthSessions = sessions.filter((s) => s.date.startsWith(month));
    const targetSessions = subjectId
      ? monthSessions.filter((s) => s.subjectId === subjectId)
      : monthSessions;

    const totalMinutes = targetSessions.reduce((acc, s) => acc + s.duration, 0);
    return Math.round(totalMinutes / 60); // Convert to hours
  };

  const handleAddGoal = async () => {
    try {
      const values = await form.validateFields();
      onSetGoal(values.subjectId || undefined, values.month || currentMonth, values.targetHours);
      message.success('Đặt mục tiêu thành công');
      form.resetFields();
      setModalVisible(false);
    } catch (e) {
      console.error('Validation failed:', e);
    }
  };

  const handleDeleteGoal = (id: string) => {
    Modal.confirm({
      title: 'Xóa mục tiêu',
      content: 'Bạn chắc chắn muốn xóa mục tiêu này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        onDeleteGoal(id);
        message.success('Xóa mục tiêu thành công');
      },
    });
  };

  const columns = [
    {
      title: 'Loại mục tiêu',
      key: 'type',
      render: (_: any, record: MonthlyGoal) => {
        const subject = subjects.find((s) => s.id === record.subjectId);
        return subject ? (
          <Tag color={subject.color}>{subject.name}</Tag>
        ) : (
          <Tag>Tổng thời lượng</Tag>
        );
      },
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Mục tiêu',
      key: 'target',
      render: (_: any, record: MonthlyGoal) => `${record.targetHours} giờ`,
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_: any, record: MonthlyGoal) => {
        const achieved = calculateProgress(record.subjectId, record.month);
        const target = record.targetHours;
        const percentage = Math.round((achieved / target) * 100);

        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <span>{achieved} / {target} giờ</span>
            <Progress percent={Math.min(percentage, 100)} status={achieved >= target ? 'success' : 'active'} />
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: MonthlyGoal) => {
        const achieved = calculateProgress(record.subjectId, record.month);
        return achieved >= record.targetHours ? (
          <Tag color="green">Đạt mục tiêu</Tag>
        ) : (
          <Tag color="orange">Chưa đạt</Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_: any, record: MonthlyGoal) => (
        <Button type="text" danger onClick={() => handleDeleteGoal(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Mục tiêu học tập hàng tháng"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>Đặt mục tiêu</Button>}
      >
        {monthlyGoals.length === 0 ? (
          <Empty description="Chưa có mục tiêu nào" />
        ) : (
          <Table columns={columns} dataSource={monthlyGoals} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>

      <Modal
        title="Đặt mục tiêu học tập"
        visible={modalVisible}
        onOk={handleAddGoal}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Loại mục tiêu"
            name="subjectId"
            initialValue={undefined}
          >
            <Select placeholder="Chọn môn học hoặc tổng thời lượng">
              <Select.Option value={undefined}>Tổng thời lượng</Select.Option>
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  <span style={{ color: s.color }}>●</span> {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tháng"
            name="month"
            initialValue={currentMonth}
            rules={[{ required: true }]}
          >
            <input type="month" style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: '2px' }} />
          </Form.Item>

          <Form.Item
            label="Mục tiêu (giờ)"
            name="targetHours"
            rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
          >
            <InputNumber min={0.5} step={0.5} placeholder="Ví dụ: 20" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
