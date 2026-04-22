import React, { useState } from 'react';
import { Button, Modal, Table, message, Card, Form, Tag, Divider, Space } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import ExamForm from './ExamForm';
import { Subject, KnowledgeBlock, Exam, Question } from './types';

const mockQuestions: Question[] = [
  { id: 'Q1', subjectId: 'S1', kbId: 'KB1', difficulty: 'Dễ', content: 'HTML là gì và các thành phần cơ bản?' },
  { id: 'Q2', subjectId: 'S1', kbId: 'KB1', difficulty: 'Dễ', content: 'Trình bày cách nhúng CSS vào trang HTML.' },
  { id: 'Q3', subjectId: 'S1', kbId: 'KB2', difficulty: 'Khó', content: 'Phân biệt giữa LocalStorage và SessionStorage.' },
  { id: 'Q4', subjectId: 'S1', kbId: 'KB2', difficulty: 'Khó', content: 'Giải thích cơ chế hoạt động của useEffect trong React.' },
];

const mockSubjects: Subject[] = [{ id: 'S1', code: 'INT101', name: 'Lập trình Web', credits: 3 }];
const mockKBs: KnowledgeBlock[] = [{ id: 'KB1', name: 'Tổng quan' }, { id: 'KB2', name: 'Chuyên sâu' }];

const Exams: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleCreate = (values: any) => {
    const { subjectId, configs } = values;
    let finalQuestions: Question[] = [];

    try {
      configs.forEach((config: any) => {
        const matches = mockQuestions.filter(q => 
          q.subjectId === subjectId && q.kbId === config.kbId && q.difficulty === config.difficulty
        );
        if (matches.length < config.quantity) {
          throw new Error(`Không đủ câu hỏi mức ${config.difficulty}`);
        }
        const shuffled = [...matches].sort(() => 0.5 - Math.random());
        finalQuestions = [...finalQuestions, ...shuffled.slice(0, config.quantity)];
      });

      const newExam: Exam = {
        id: `EXAM_${Date.now()}`,
        name: `Đề thi ${mockSubjects.find(s => s.id === subjectId)?.name} - Lần ${exams.length + 1}`,
        subjectId,
        questions: finalQuestions,
        createdAt: new Date().toLocaleString()
      };
      
      setExams([newExam, ...exams]);
      message.success("Tạo đề thi thành công!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSaveTemplate = (values: any) => {
    const newTemplate = {
      id: `TPL_${Date.now()}`,
      name: `Cấu trúc mẫu môn ${mockSubjects.find(s => s.id === values.subjectId)?.name}`,
      subjectId: values.subjectId,
      configs: values.configs
    };
    setTemplates([...templates, newTemplate]);
    message.success('Đã lưu cấu trúc mẫu!');
  };

  const columns = [
    { title: 'Tên đề thi', dataIndex: 'name', key: 'name' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Số câu', render: (_: any, record: Exam) => <Tag color="blue">{record.questions.length} câu</Tag> },
    { 
      title: 'Thao tác', 
      render: (_: any, record: Exam) => (
        <Button 
          type="primary" 
          ghost 
          icon={<EyeOutlined />} 
          onClick={() => setSelectedExam(record)} 
        >
          Xem đề
        </Button>
      ) 
    }
  ];

  return (
    <Card title="Lịch sử tạo đề thi" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Tạo đề mới</Button>}>
      
      <Table dataSource={exams} columns={columns} rowKey="id" />

      <Modal title="Thiết lập cấu trúc đề" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={700}>
        <ExamForm 
          form={form} 
          subjects={mockSubjects} 
          knowledgeBlocks={mockKBs} 
          savedTemplates={templates}
          onFinish={handleCreate} 
          onSaveTemplate={handleSaveTemplate} 
        />
      </Modal>
      
      <Modal
        title={<Space><FileTextOutlined /> Chi tiết đề thi</Space>}
        open={!!selectedExam}
        onCancel={() => setSelectedExam(null)}
        footer={[<Button key="close" onClick={() => setSelectedExam(null)}>Đóng</Button>]}
        width={800}
      >
        {selectedExam && (
          <div>
            <h3>{selectedExam.name}</h3>
            <p>Môn học: <b>{mockSubjects.find(s => s.id === selectedExam.subjectId)?.name}</b></p>
            <p>Ngày tạo: {selectedExam.createdAt}</p>
            <Divider>NỘI DUNG ĐỀ THI</Divider>
            
            {selectedExam.questions.map((q, index) => (
              <div key={q.id} style={{ marginBottom: '20px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Câu {index + 1}:</b>
                  <Tag color={q.difficulty === 'Khó' ? 'red' : 'green'}>{q.difficulty}</Tag>
                </div>
                <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                  {q.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

    </Card>
  );
};

export default Exams;