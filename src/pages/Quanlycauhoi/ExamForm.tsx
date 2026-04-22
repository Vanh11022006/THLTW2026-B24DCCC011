import React from 'react';
import { Form, Button, Select, InputNumber, Space, Divider, Row, Col, message } from 'antd'; // Đã thêm message
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Subject, KnowledgeBlock, Difficulty } from './types';

interface Props {
  form: any;
  subjects?: Subject[];
  knowledgeBlocks?: KnowledgeBlock[];
  savedTemplates?: any[]; 
  onFinish: (values: any) => void;
  onSaveTemplate?: (values: any) => void; 
}

const difficulties: Difficulty[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const ExamForm: React.FC<Props> = ({ 
  form, 
  subjects = [], 
  knowledgeBlocks = [], 
  savedTemplates = [], 
  onFinish, 
  onSaveTemplate 
}) => {
  
  const handleApplyTemplate = (templateId: string) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      form.setFieldsValue({
        subjectId: template.subjectId,
        configs: template.configs
      });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="subjectId" label="Chọn môn học" rules={[{ required: true, message: 'Vui lòng chọn môn!' }]}>
            <Select placeholder="-- Chọn môn học --" options={subjects.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Hoặc dùng cấu trúc đã lưu:">
            <Select placeholder="-- Chọn cấu trúc mẫu --" allowClear onChange={handleApplyTemplate}>
              {savedTemplates.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Cấu trúc chi tiết</Divider>

      <Form.List name="configs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'kbId']} rules={[{ required: true, message: 'Thiếu khối kiến thức' }]}>
                  <Select placeholder="Khối kiến thức" style={{ width: 150 }}>
                    {knowledgeBlocks.map(kb => (
                      <Select.Option key={kb.id} value={kb.id}>{kb.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item {...restField} name={[name, 'difficulty']} rules={[{ required: true, message: 'Thiếu mức độ' }]}>
                  <Select placeholder="Mức độ" style={{ width: 120 }}>
                    {difficulties.map(d => (
                      <Select.Option key={d} value={d}>{d}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Thiếu số lượng' }]}>
                  <InputNumber min={1} placeholder="Số lượng" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm tiêu chí</Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button 
          icon={<SaveOutlined />} 
          onClick={() => {
            form.validateFields()
              .then((values: any) => {
                if(onSaveTemplate) onSaveTemplate(values);
              })
              .catch((errorInfo: any) => {
                message.error('Vui lòng điền đầy đủ Môn học và các tiêu chí trước khi lưu!');
                console.log("Chi tiết lỗi form:", errorInfo);
              });
          }}
        >
          Lưu thành cấu trúc mẫu
        </Button>
        <Button type="primary" htmlType="submit">
          Tạo đề thi tự động
        </Button>
      </Space>
    </Form>
  );
};

export default ExamForm;