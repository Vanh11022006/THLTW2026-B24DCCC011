import React from 'react';
import { Tabs } from 'antd';
import Exams from './Exams';
import Questions from './Questions';

const QuanLyCauHoiPage: React.FC = () => {
  return (
    <div style={{ background: '#f0f2f5', padding: '24px', minHeight: '100vh' }}>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Quản lý Đề thi" key="1">
          <Exams />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Ngân hàng Câu hỏi" key="2">
          <Questions />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default QuanLyCauHoiPage;