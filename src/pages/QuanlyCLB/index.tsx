import React, { useState } from 'react';
import { Card, Tabs, TabsProps } from 'antd';
import ClubList from './ClubList';
import ApplicationManagement from './ApplicationManagement';
import MemberManagement from './MemberManagement';
import Reports from './Reports';
import type { IClub } from './types';

const QuanlyCLB: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);
  const [activeTab, setActiveTab] = useState<string>('clubs');

  const handleViewMembers = (club: IClub) => {
    setSelectedClub(club);
    setActiveTab('members');
  };

  const items: TabsProps['items'] = [
    {
      key: 'clubs',
      label: '📚 Danh sách câu lạc bộ',
      children: <ClubList onViewMembers={handleViewMembers} />,
    },
    {
      key: 'applications',
      label: '📋 Quản lý đơn đăng ký',
      children: <ApplicationManagement />,
    },
    {
      key: 'members',
      label: '👥 Quản lý thành viên',
      children: <MemberManagement selectedClubId={selectedClub?.id} />,
    },
    {
      key: 'reports',
      label: '📊 Báo cáo và thống kê',
      children: <Reports />,
    },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={items}
          type="card"
        />
      </Card>
    </div>
  );
};

export default QuanlyCLB;
