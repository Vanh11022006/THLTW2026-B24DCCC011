import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Rate, Space, Tag, Card, Empty } from 'antd';
import type { Review, Appointment } from './types';
import type { ColumnsType } from 'antd/es/table';
import { useAppContext } from './AppContext';

const mockReviews: Review[] = [
  {
    id: 'r1',
    appointmentId: 'apt1',
    employeeId: 'e1',
    customerName: 'Nguyễn Văn B',
    rating: 5,
    comment: 'Dịch vụ rất tốt, nhân viên thân thiện và chuyên nghiệp!',
    createdAt: '2026-03-17',
  },
  {
    id: 'r2',
    appointmentId: 'apt2',
    employeeId: 'e1',
    customerName: 'Trần Thị C',
    rating: 4,
    comment: 'Tổng thể khá good, có thể cải thiện thêm một chút.',
    createdAt: '2026-03-16',
    staffReply: 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện hơn.',
    staffReplyAt: '2026-03-17',
  },
];

export const ReviewManagement: React.FC = () => {
  const { appointments } = useAppContext();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();

  const handleAddReview = (appointment: Appointment) => {
    form.setFieldsValue({
      appointmentId: appointment.id,
      customerName: appointment.customerName,
      employeeId: appointment.employeeId,
    });
    setIsModalOpen(true);
  };

  const onFinishReview = (values: any) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      appointmentId: values.appointmentId,
      employeeId: values.employeeId,
      customerName: values.customerName,
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews([...reviews, newReview]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    replyForm.setFieldsValue({
      staffReply: review.staffReply || '',
    });
    setIsReplyModalOpen(true);
  };

  const onFinishReply = (values: any) => {
    if (selectedReview) {
      const updatedReviews = reviews.map(r =>
        r.id === selectedReview.id
          ? {
              ...r,
              staffReply: values.staffReply,
              staffReplyAt: new Date().toISOString().split('T')[0],
            }
          : r
      );
      setReviews(updatedReviews);
      setIsReplyModalOpen(false);
      replyForm.resetFields();
    }
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const reviewColumns: ColumnsType<Review> = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    { title: 'Bình luận', dataIndex: 'comment', key: 'comment', width: 300 },
    { title: 'Ngày đánh giá', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Phản hồi',
      key: 'reply',
      render: (_, record) => (
        <span style={{ color: record.staffReply ? 'green' : 'red' }}>
          {record.staffReply ? '✓ Đã phản hồi' : '✗ Chưa phản hồi'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => handleReply(record)}>
            {record.staffReply ? 'Sửa' : 'Phản hồi'}
          </Button>
          <Button danger size="small" onClick={() => handleDeleteReview(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const appointmentColumns: ColumnsType<Appointment> = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'COMPLETED' ? 'green' : 'blue'}>{status}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const hasReview = reviews.some(r => r.appointmentId === record.id);
        return (
          <Button
            type={hasReview ? 'default' : 'primary'}
            size="small"
            onClick={() => handleAddReview(record)}
            disabled={hasReview}
          >
            {hasReview ? 'Đã đánh giá' : 'Đánh giá'}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Card title="Danh sách đánh giá" style={{ marginBottom: 24 }}>
        {reviews.length === 0 ? (
          <Empty description="Chưa có đánh giá nào" />
        ) : (
          <Table columns={reviewColumns} dataSource={reviews} rowKey="id" pagination={false} />
        )}
      </Card>

      <Card title="Lịch hẹn hoàn thành - Cho phép đánh giá">
        <Table columns={appointmentColumns} dataSource={completedAppointments} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title="Thêm đánh giá"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinishReview}>
          <Form.Item name="appointmentId">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="customerName">
            <Input disabled />
          </Form.Item>
          <Form.Item name="employeeId">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Bình luận" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Nhập bình luận của bạn" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Phản hồi đánh giá"
        open={isReplyModalOpen}
        onOk={() => replyForm.submit()}
        onCancel={() => setIsReplyModalOpen(false)}
      >
        <Form form={replyForm} layout="vertical" onFinish={onFinishReply}>
          {selectedReview && (
            <>
              <div style={{ marginBottom: 16, padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                <strong>Đánh giá từ {selectedReview.customerName}:</strong>
                <br />
                <Rate disabled defaultValue={selectedReview.rating} />
                <p>{selectedReview.comment}</p>
              </div>
            </>
          )}
          <Form.Item name="staffReply" label="Phản hồi của nhân viên" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Nhập phản hồi" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
