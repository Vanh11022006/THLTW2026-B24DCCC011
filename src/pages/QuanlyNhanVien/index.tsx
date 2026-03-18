import React from 'react';
import { Tabs, Card } from 'antd';
import { AppProvider } from './AppContext';
import { BookingForm } from './user';
import { AppointmentManager } from './admin';
import { EmployeeManagement } from './EmployeeManagement';
import { ServiceManagement } from './ServiceManagement';
import { ReviewManagement } from './ReviewManagement';
import { Statistics } from './Statistics';

const TabsContent = () => {
  const items = [
    {
      key: '1',
      label: '📅 Đặt lịch hẹn',
      children: <BookingForm />,
    },
    {
      key: '2',
      label: '📋 Quản lý lịch hẹn',
      children: <AppointmentManager />,
    },
    {
      key: '3',
      label: '👥 Quản lý nhân viên',
      children: <EmployeeManagement />,
    },
    {
      key: '4',
      label: '🛠️ Quản lý dịch vụ',
      children: <ServiceManagement />,
    },
    {
      key: '5',
      label: '⭐ Đánh giá & Phản hồi',
      children: <ReviewManagement />,
    },
    {
      key: '6',
      label: '📊 Thống kê & Báo cáo',
      children: <Statistics />,
    },
  ];

  return (
    <Card style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Hệ thống Quản lý Nhân viên & Dịch vụ</h1>
      <Tabs items={items} />
    </Card>
  );
};

export default () => {
  return (
    <AppProvider>
      <TabsContent />
    </AppProvider>
  );
};
