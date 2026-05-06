import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Timeline } from 'antd';
import { Column, Line } from '@ant-design/plots';
import { FireOutlined, CalendarOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons';
import { mockWorkouts, mockHealthMetrics, mockGoals } from '../data';

const Dashboard: React.FC = () => {
  const currentMonth = new Date().toISOString().split('-')[1];
  const monthWorkouts = mockWorkouts.filter(w => w.date.includes(`-${currentMonth}-`) && w.status === 'COMPLETED');
  const totalWorkouts = monthWorkouts.length;
  const totalCalories = monthWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const streak = 3; 
  const completedGoals = mockGoals.filter(g => g.status === 'Đã đạt').length;
  const goalProgress = mockGoals.length > 0 ? Math.round((completedGoals / mockGoals.length) * 100) : 0;

  const columnConfig = {
    data: [
      { week: 'Tuần 1', value: 2 },
      { week: 'Tuần 2', value: 3 },
      { week: 'Tuần 3', value: 1 },
      { week: 'Tuần 4', value: 0 },
    ],
    xField: 'week',
    yField: 'value',
    color: '#1890ff',
  };

  const lineConfig = {
    data: [...mockHealthMetrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    xField: 'date',
    yField: 'weight',
    point: { size: 5, shape: 'diamond' },
    color: '#52c41a',
  };

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Buổi tập (Tháng)" value={totalWorkouts} prefix={<CalendarOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Calo đốt (Tháng)" value={totalCalories} prefix={<FireOutlined />} suffix="kcal" valueStyle={{ color: '#cf1322' }}/></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Streak (Ngày)" value={streak} prefix={<LineChartOutlined />} valueStyle={{ color: '#fa8c16' }}/></Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card><Statistic title="Mục tiêu hoàn thành" value={goalProgress} prefix={<TrophyOutlined />} suffix="%" valueStyle={{ color: '#3f8600' }}/></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title={`Số buổi tập theo tuần (Tháng ${currentMonth})`}>
            <Column {...columnConfig} height={250} />
          </Card>
          <Card title="Biến động cân nặng" style={{ marginTop: 16 }}>
            <Line {...lineConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              {[...mockWorkouts].reverse().slice(0, 5).map(w => (
                <Timeline.Item key={w.id} color={w.status === 'COMPLETED' ? 'green' : 'red'}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{w.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'gray' }}>{w.date} - {w.duration} phút ({w.calories} kcal)</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;