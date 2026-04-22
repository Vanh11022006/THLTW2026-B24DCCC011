import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { Line, Column, Pie } from '@ant-design/charts';
import { DollarOutlined, TeamOutlined, EnvironmentOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { mockDiemDen } from '../../data';

const ThongKe: React.FC = () => {
  // Mock data - thống kê từ các lịch trình
  const mockStatistics = {
    totalItineraries: 45,
    totalRevenue: 85500000,
    monthlyItineraries: [
      { month: 'Tháng 1', count: 5, revenue: 12000000 },
      { month: 'Tháng 2', count: 8, revenue: 18500000 },
      { month: 'Tháng 3', count: 6, revenue: 14000000 },
      { month: 'Tháng 4', count: 10, revenue: 22500000 },
      { month: 'Tháng 5', count: 9, revenue: 15000000 },
      { month: 'Tháng 6', count: 7, revenue: 3500000 },
    ],
    budgetBreakdown: [
      { category: 'Lưu trú (35%)', value: 35 },
      { category: 'Ăn uống (30%)', value: 30 },
      { category: 'Di chuyển (25%)', value: 25 },
      { category: 'Phát sinh (10%)', value: 10 },
    ],
    popularDestinations: [
      { name: 'Vịnh Hạ Long', count: 15, revenue: 22500000 },
      { name: 'Bản Cát Cát', count: 12, revenue: 9600000 },
      { name: 'Phố Cổ Hội An', count: 18, revenue: 9000000 },
      { name: 'Bãi Sao', count: 10, revenue: 20000000 },
    ],
  };

  // Config for Line Chart - Lịch trình theo tháng
  const lineConfig = {
    data: mockStatistics.monthlyItineraries,
    xField: 'month',
    yField: 'count',
    seriesField: 'month',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // Config for Column Chart - Doanh thu theo tháng
  const columnConfig = {
    data: mockStatistics.monthlyItineraries,
    xField: 'month',
    yField: 'revenue',
    seriesField: 'month',
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000a6',
        opacity: 0.6,
      },
    },
  };

  // Config for Pie Chart - Phân bổ chi phí
  const pieConfig = {
    data: mockStatistics.budgetBreakdown,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  const popularDestinationsColumns = [
    {
      title: 'Tên điểm đến',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Số lần được chọn',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: 'Doanh thu (VND)',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 150,
      render: (revenue: number) => revenue.toLocaleString('vi-VN'),
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: 'Tỷ lệ',
      key: 'percentage',
      render: (_: any, record: any) => {
        const percentage = ((record.revenue / mockStatistics.totalRevenue) * 100).toFixed(1);
        return `${percentage}%`;
      },
    },
  ];

  return (
    <PageContainer
      title="Thống kê"
      subTitle="Xem thống kê về lịch trình, doanh thu và địa điểm phổ biến"
    >
      {/* KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lịch trình"
              value={mockStatistics.totalItineraries}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={mockStatistics.totalRevenue}
              suffix="VND"
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Điểm đến"
              value={mockDiemDen.length}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trung bình/Lịch trình"
              value={(mockStatistics.totalRevenue / mockStatistics.totalItineraries).toLocaleString('vi-VN')}
              suffix="VND"
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Số lượt lịch trình theo tháng" bordered={false}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Doanh thu theo tháng" bordered={false}>
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card title="Phân bổ chi phí (Trung bình)" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* Địa điểm phổ biến */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card
            title="Địa điểm phổ biến"
            extra={<Tag color="blue">Top {mockStatistics.popularDestinations.length}</Tag>}
            bordered={false}
          >
            <Table
              dataSource={mockStatistics.popularDestinations}
              columns={popularDestinationsColumns}
              rowKey="name"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={1}>
                    <strong>Tổng cộng</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>{mockStatistics.popularDestinations.reduce((sum, item) => sum + item.count, 0)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{mockStatistics.totalRevenue.toLocaleString('vi-VN')}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong>100%</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ThongKe;
