import React, { useState } from 'react';
import { Card, Button, Space, Table, Modal, Tag, Tooltip, Empty, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject, StudySession } from './types';
import { SessionModal } from './SessionModal';

interface StudyProgressProps {
  subjects: Subject[];
  sessions: StudySession[];
  onAddSession: (subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => void;
  onUpdateSession: (id: string, subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => void;
  onDeleteSession: (id: string) => void;
}

export const StudyProgress: React.FC<StudyProgressProps> = ({
  subjects,
  sessions,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | undefined>();

  const handleAdd = () => {
    setSelectedSession(undefined);
    setModalVisible(true);
  };

  const handleEdit = (session: StudySession) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa buổi học',
      content: 'Bạn chắc chắn muốn xóa buổi học này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        onDeleteSession(id);
        message.success('Xóa buổi học thành công');
      },
    });
  };

  const handleModalSubmit = (subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => {
    if (selectedSession) {
      onUpdateSession(selectedSession.id, subjectId, date, startTime, endTime, content, notes);
      message.success('Cập nhật buổi học thành công');
    } else {
      onAddSession(subjectId, date, startTime, endTime, content, notes);
      message.success('Thêm buổi học thành công');
    }
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Môn học',
      key: 'subjectId',
      render: (_: any, record: StudySession) => {
        const subject = subjects.find((s) => s.id === record.subjectId);
        return subject ? (
          <Tag color={subject.color}>{subject.name}</Tag>
        ) : (
          'N/A'
        );
      },
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: StudySession, b: StudySession) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: any, record: StudySession) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Thời lượng',
      key: 'duration',
      render: (_: any, record: StudySession) => `${record.duration} phút`,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Tooltip title={content}>
          {content.length > 30 ? `${content.substring(0, 30)}...` : content}
        </Tooltip>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: StudySession) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Quản lý tiến độ học tập" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm buổi học</Button>}>
        {sessions.length === 0 ? (
          <Empty description="Chưa có buổi học nào" />
        ) : (
          <Table columns={columns} dataSource={sessions} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>

      <SessionModal
        visible={modalVisible}
        session={selectedSession}
        subjects={subjects}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};
