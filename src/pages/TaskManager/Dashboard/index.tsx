import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { getTasks, Task } from '../data';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.deadline < today && t.status !== 'DONE').length;

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Tổng số công việc" 
              value={totalTasks} 
              prefix={<ProfileOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Đã hoàn thành" 
              value={completedTasks} 
              valueStyle={{ color: '#3f8600' }} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Quá hạn" 
              value={overdueTasks} 
              valueStyle={{ color: '#cf1322' }} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;