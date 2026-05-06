import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Popconfirm, Tag, Modal, Form, Input, Select, InputNumber, Row, Col, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { mockExercises, Exercise } from '../data';

const ThuVienBaiTap: React.FC = () => {
  const [dataSource, setDataSource] = useState<Exercise[]>(mockExercises);
  const [searchText, setSearchText] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string | null>(null);
  const [filterDiff, setFilterDiff] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(undefined);
  const [form] = Form.useForm();

  const displayData = useMemo(() => {
    return dataSource.filter(ex => {
      let match = true;
      if (searchText) match = match && ex.name.toLowerCase().includes(searchText.toLowerCase());
      if (filterMuscle) match = match && ex.muscle === filterMuscle;
      if (filterDiff) match = match && ex.difficulty === filterDiff;
      return match;
    });
  }, [dataSource, searchText, filterMuscle, filterDiff]);

  const handleOpenForm = (record?: Exercise) => {
    setCurrentExercise(record);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource(dataSource.filter(item => item.id !== id));
    message.success('Đã xóa bài tập');
  };

  const handleFinish = (values: any) => {
    if (currentExercise) {
      setDataSource(dataSource.map(item => item.id === currentExercise.id ? { ...item, ...values } : item));
      message.success('Cập nhật thành công');
    } else {
      setDataSource([{ ...values, id: Date.now().toString() }, ...dataSource]);
      message.success('Thêm mới thành công');
    }
    setIsModalVisible(false);
  };

  return (
    <PageContainer>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}><Input placeholder="Tìm tên bài tập..." value={searchText} onChange={e => setSearchText(e.target.value)} allowClear /></Col>
          <Col xs={24} md={6}><Select placeholder="Chọn nhóm cơ" style={{ width: '100%' }} allowClear onChange={setFilterMuscle} options={['Chest','Back','Legs','Shoulders','Arms','Core','Full Body'].map(m => ({value:m}))} /></Col>
          <Col xs={24} md={6}><Select placeholder="Mức độ khó" style={{ width: '100%' }} allowClear onChange={setFilterDiff} options={['Dễ','Trung bình','Khó'].map(m => ({value:m}))} /></Col>
          <Col xs={24} md={4}><Button type="primary" icon={<PlusOutlined />} block onClick={() => handleOpenForm()}>Thêm bài tập</Button></Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {displayData.map(ex => (
          <Col xs={24} sm={12} lg={8} key={ex.id}>
            <Card
              hoverable
              title={ex.name}
              extra={<Tag color={ex.difficulty === 'Khó' ? 'red' : ex.difficulty === 'Trung bình' ? 'orange' : 'green'}>{ex.difficulty}</Tag>}
              actions={[
                <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => { setCurrentExercise(ex); setDetailModalVisible(true); }} />,
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenForm(ex)} />,
                <Popconfirm key="delete" title="Xóa?" onConfirm={() => handleDelete(ex.id)}><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm>
              ]}
            >
              <Tag color="blue" style={{ marginBottom: 8 }}>{ex.muscle}</Tag>
              <p style={{ minHeight: 45, color: 'gray', margin: '8px 0' }}>{ex.description}</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Calo đốt: {ex.calPerHour} kcal/giờ</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={currentExercise ? 'Sửa bài tập' : 'Thêm bài tập'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="muscle" label="Nhóm cơ" rules={[{ required: true }]}><Select options={['Chest','Back','Legs','Shoulders','Arms','Core','Full Body'].map(m => ({value:m}))} /></Form.Item>
          <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true }]}><Select options={['Dễ','Trung bình','Khó'].map(m => ({value:m}))} /></Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="calPerHour" label="Calo đốt/giờ" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Chi tiết bài tập" open={detailModalVisible} footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>Đóng</Button>]} onCancel={() => setDetailModalVisible(false)}>
        {currentExercise && (
          <div>
            <h2>{currentExercise.name}</h2>
            <Tag color="blue">{currentExercise.muscle}</Tag>
            <Tag color={currentExercise.difficulty === 'Khó' ? 'red' : currentExercise.difficulty === 'Trung bình' ? 'orange' : 'green'}>{currentExercise.difficulty}</Tag>
            <p style={{ marginTop: 16 }}><strong>Calo tiêu thụ trung bình:</strong> {currentExercise.calPerHour} kcal/giờ</p>
            <p><strong>Hướng dẫn chi tiết:</strong><br/>{currentExercise.description}</p>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ThuVienBaiTap;