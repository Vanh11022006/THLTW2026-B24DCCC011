import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tabs } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { mockServices, initialAppointments } from './mockData';
import { useAppContext } from './AppContext';

interface DailyStats {
  date: string;
  count: number;
  revenue: number;
}

interface ServiceStats {
  serviceId: string;
  serviceName: string;
  count: number;
  totalRevenue: number;
  averageRevenue: number;
}

interface EmployeeStats {
  employeeId: string;
  employeeName: string;
  count: number;
  totalRevenue: number;
  averageRevenue: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  revenue: number;
}

export const Statistics: React.FC = () => {
  const { appointments, employees } = useAppContext();
  const displayAppointments = appointments.length > 0 ? appointments : initialAppointments;

  const dailyStats = useMemo(() => {
    const stats: { [key: string]: DailyStats } = {};

    displayAppointments
      .filter(apt => apt.status !== 'CANCELLED')
      .forEach(apt => {
        if (!stats[apt.date]) {
          stats[apt.date] = { date: apt.date, count: 0, revenue: 0 };
        }
        stats[apt.date].count += 1;
        stats[apt.date].revenue += apt.totalPrice;
      });

    return Object.values(stats).sort((a, b) => b.date.localeCompare(a.date));
  }, [displayAppointments]);

  const monthlyStats = useMemo(() => {
    const stats: { [key: string]: MonthlyStats } = {};

    displayAppointments
      .filter(apt => apt.status !== 'CANCELLED')
      .forEach(apt => {
        const month = apt.date.substring(0, 7);
        if (!stats[month]) {
          stats[month] = { month, count: 0, revenue: 0 };
        }
        stats[month].count += 1;
        stats[month].revenue += apt.totalPrice;
      });

    return Object.values(stats).sort((a, b) => b.month.localeCompare(a.month));
  }, [displayAppointments]);

  const serviceStats = useMemo(() => {
    const stats: { [key: string]: ServiceStats } = {};

    displayAppointments
      .filter(apt => apt.status !== 'CANCELLED')
      .forEach(apt => {
        if (!stats[apt.serviceId]) {
          const service = mockServices.find(s => s.id === apt.serviceId);
          stats[apt.serviceId] = {
            serviceId: apt.serviceId,
            serviceName: service?.name || 'Unknown',
            count: 0,
            totalRevenue: 0,
            averageRevenue: 0,
          };
        }
        stats[apt.serviceId].count += 1;
        stats[apt.serviceId].totalRevenue += apt.totalPrice;
      });

    Object.values(stats).forEach(stat => {
      stat.averageRevenue = stat.totalRevenue / stat.count;
    });

    return Object.values(stats);
  }, [displayAppointments]);

  const employeeStats = useMemo(() => {
    const stats: { [key: string]: EmployeeStats } = {};

    displayAppointments
      .filter(apt => apt.status !== 'CANCELLED')
      .forEach(apt => {
        if (!stats[apt.employeeId]) {
          const employee = employees.find(e => e.id === apt.employeeId);
          stats[apt.employeeId] = {
            employeeId: apt.employeeId,
            employeeName: employee?.name || 'Unknown',
            count: 0,
            totalRevenue: 0,
            averageRevenue: 0,
          };
        }
        stats[apt.employeeId].count += 1;
        stats[apt.employeeId].totalRevenue += apt.totalPrice;
      });

    Object.values(stats).forEach(stat => {
      stat.averageRevenue = stat.totalRevenue / stat.count;
    });

    return Object.values(stats);
  }, [displayAppointments]);

  const totalRevenue = displayAppointments
    .filter(apt => apt.status !== 'CANCELLED')
    .reduce((sum, apt) => sum + apt.totalPrice, 0);

  const totalAppointments = displayAppointments.filter(apt => apt.status !== 'CANCELLED').length;

  const dailyColumns: ColumnsType<DailyStats> = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Số lịch hẹn', dataIndex: 'count', key: 'count' },
    {
      title: 'Doanh thu (VND)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => revenue.toLocaleString('vi-VN'),
    },
  ];

  const monthlyColumns: ColumnsType<MonthlyStats> = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Số lịch hẹn', dataIndex: 'count', key: 'count' },
    {
      title: 'Doanh thu (VND)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => revenue.toLocaleString('vi-VN'),
    },
  ];

  const serviceColumns: ColumnsType<ServiceStats> = [
    { title: 'Tên dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
    {
      title: 'Tổng doanh thu (VND)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue) => revenue.toLocaleString('vi-VN'),
    },
    {
      title: 'Doanh thu trung bình (VND)',
      dataIndex: 'averageRevenue',
      key: 'averageRevenue',
      render: (revenue) => revenue.toLocaleString('vi-VN', { maximumFractionDigits: 0 }),
    },
  ];

  const employeeColumns: ColumnsType<EmployeeStats> = [
    { title: 'Tên nhân viên', dataIndex: 'employeeName', key: 'employeeName' },
    { title: 'Số lượng lịch', dataIndex: 'count', key: 'count' },
    {
      title: 'Tổng doanh thu (VND)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue) => revenue.toLocaleString('vi-VN'),
    },
    {
      title: 'Doanh thu trung bình (VND)',
      dataIndex: 'averageRevenue',
      key: 'averageRevenue',
      render: (revenue) => revenue.toLocaleString('vi-VN', { maximumFractionDigits: 0 }),
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              suffix="VND"
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => (value as number).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số lịch hẹn"
              value={totalAppointments}
              suffix="lịch"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'daily',
            label: 'Thống kê theo ngày',
            children: <Table columns={dailyColumns} dataSource={dailyStats} rowKey="date" pagination={false} />,
          },
          {
            key: 'monthly',
            label: 'Thống kê theo tháng',
            children: <Table columns={monthlyColumns} dataSource={monthlyStats} rowKey="month" pagination={false} />,
          },
          {
            key: 'service',
            label: 'Doanh thu theo dịch vụ',
            children: <Table columns={serviceColumns} dataSource={serviceStats} rowKey="serviceId" pagination={false} />,
          },
          {
            key: 'employee',
            label: 'Doanh thu theo nhân viên',
            children: <Table columns={employeeColumns} dataSource={employeeStats} rowKey="employeeId" pagination={false} />,
          },
        ]}
      />
    </>
  );
};
