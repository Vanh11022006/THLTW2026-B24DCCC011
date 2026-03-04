import React from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Space } from 'antd';
import { StudySession, Subject } from './types';
import dayjs from 'dayjs';

interface SessionModalProps {
  visible: boolean;
  session?: StudySession;
  subjects: Subject[];
  onSubmit: (subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => void;
  onCancel: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({ visible, session, subjects, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(
        values.subjectId,
        values.date.format('YYYY-MM-DD'),
        values.startTime.format('HH:mm'),
        values.endTime.format('HH:mm'),
        values.content,
        values.notes || ''
      );
      form.resetFields();
    } catch (e) {
      console.error('Validation failed:', e);
    }
  };

  React.useEffect(() => {
    if (visible) {
      if (session) {
        form.setFieldsValue({
          subjectId: session.subjectId,
          date: dayjs(session.date),
          startTime: dayjs(session.startTime, 'HH:mm'),
          endTime: dayjs(session.endTime, 'HH:mm'),
          content: session.content,
          notes: session.notes,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, session, form]);

  return (
    <Modal
      title={session ? 'Sửa buổi học' : 'Thêm buổi học mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Môn học"
          name="subjectId"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select placeholder="Chọn môn học">
            {subjects.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                <span style={{ color: s.color }}>●</span> {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày học"
          name="date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item
            label="Giờ bắt đầu"
            name="startTime"
            rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Giờ kết thúc"
            name="endTime"
            rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Space>

        <Form.Item
          label="Nội dung đã học"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung đã học' }]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả nội dung bạn đã học..." />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (tùy chọn)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
