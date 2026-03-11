import React, { useState } from 'react';
import { Table, Tag, Space, Select, Card, Button, Modal, Form, Input, message } from 'antd';
import { Subject, KnowledgeBlock, Question, Difficulty } from './types';


const mockSubjects: Subject[] = [{ id: 'S1', code: 'INT101', name: 'Lập trình Web', credits: 3 }];
const mockKBs: KnowledgeBlock[] = [{ id: 'KB1', name: 'Tổng quan' }, { id: 'KB2', name: 'Chuyên sâu' }];


const initialQuestions: Question[] = [
  { id: 'Q1', subjectId: 'S1', kbId: 'KB1', difficulty: 'Dễ', content: 'HTML là gì?' },
  { id: 'Q3', subjectId: 'S1', kbId: 'KB2', difficulty: 'Khó', content: 'Giải thích Virtual DOM trong React?' },
];

const Questions: React.FC = () => {
 
  const [questionsList, setQuestionsList] = useState<Question[]>(initialQuestions);
  

  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const filteredData = questionsList.filter(q => {
    return (filterSubject ? q.subjectId === filterSubject : true) && 
           (filterDifficulty ? q.difficulty === filterDifficulty : true);
  });

 
  const handleAddQuestion = (values: any) => {
    const newQuestion: Question = {
      id: `Q${Date.now()}`, 
      ...values
    };
    
   
    setQuestionsList([newQuestion, ...questionsList]);
    
    message.success('Thêm câu hỏi mới thành công!');
    setIsModalOpen(false); 
    form.resetFields();   
  };

  const columns = [
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { 
      title: 'Mức độ', 
      dataIndex: 'difficulty', 
      render: (diff: Difficulty) => {
        const color = diff === 'Dễ' ? 'green' : diff === 'Trung bình' ? 'blue' : diff === 'Khó' ? 'orange' : 'red';
        return <Tag color={color}>{diff}</Tag>;
      }
    },
    { 
      title: 'Môn học', 
      dataIndex: 'subjectId', 
      render: (id: string) => mockSubjects.find(s => s.id === id)?.name 
    },
    { 
      title: 'Khối kiến thức', 
      dataIndex: 'kbId', 
      render: (id: string) => mockKBs.find(kb => kb.id === id)?.name 
    }
  ];

  return (
    <Card title="Ngân hàng câu hỏi">
      <Space style={{ marginBottom: 16 }}>
        <Select placeholder="Lọc theo môn" style={{ width: 200 }} allowClear onChange={setFilterSubject} options={mockSubjects.map(s => ({ label: s.name, value: s.id }))} />
        <Select placeholder="Mức độ khó" style={{ width: 150 }} allowClear onChange={setFilterDifficulty} options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => ({ label: d, value: d }))} />
        
    
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm câu hỏi mới</Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="id" />


      <Modal 
        title="Thêm câu hỏi mới" 
        open={isModalOpen} 
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()} 
        okText="Lưu câu hỏi"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAddQuestion}>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập câu hỏi tự luận vào đây..." />
          </Form.Item>

          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
            <Select placeholder="Chọn môn học" options={mockSubjects.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>

          <Form.Item name="kbId" label="Khối kiến thức" rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}>
            <Select placeholder="Chọn khối kiến thức" options={mockKBs.map(kb => ({ label: kb.name, value: kb.id }))} />
          </Form.Item>

          <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}>
            <Select placeholder="Chọn mức độ" options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => ({ label: d, value: d }))} />
          </Form.Item>
        </Form>
      </Modal>

    </Card>
  );
};

export default Questions;