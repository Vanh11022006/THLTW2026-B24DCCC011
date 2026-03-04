import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject } from './types';
import { SubjectModal } from './SubjectModal';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (name: string, color: string) => void;
  onUpdateSubject: (id: string, name: string, color: string) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();

  const handleAdd = () => {
    setSelectedSubject(undefined);
    setModalVisible(true);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa môn học',
      content: 'Bạn chắc chắn muốn xóa môn học này? Các buổi học liên quan cũng sẽ bị xóa.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        onDeleteSubject(id);
        message.success('Xóa môn học thành công');
      },
    });
  };

  const handleModalSubmit = (name: string, color: string) => {
    if (selectedSubject) {
      onUpdateSubject(selectedSubject.id, name, color);
      message.success('Cập nhật môn học thành công');
    } else {
      onAddSubject(name, color);
      message.success('Thêm môn học thành công');
    }
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: Subject) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Quản lý danh mục môn học" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm môn học</Button>}>
        {subjects.length === 0 ? (
          <Empty description="Chưa có môn học nào" />
        ) : (
          <Table columns={columns} dataSource={subjects} rowKey="id" pagination={false} />
        )}
      </Card>

      <SubjectModal
        visible={modalVisible}
        subject={selectedSubject}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};
