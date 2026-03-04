import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Subject } from './types';

interface SubjectModalProps {
  visible: boolean;
  subject?: Subject;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ visible, subject, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.name, values.color);
      form.resetFields();
    } catch (e) {
      console.error('Validation failed:', e);
    }
  };

  React.useEffect(() => {
    if (visible) {
      if (subject) {
        form.setFieldsValue({
          name: subject.name,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, subject, form]);

  return (
    <Modal
      title={subject ? 'Sửa môn học' : 'Thêm môn học mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên môn học"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
        >
          <Input placeholder="Ví dụ: Toán, Văn, ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
