import React from 'react';
import { Tabs, Card, Spin } from 'antd';
import { useStudyTracker } from './useStudyTracker';
import { SubjectManagement } from './SubjectManagement';
import { StudyProgress } from './StudyProgress';
import { MonthlyGoals } from './MonthlyGoals';

const Bai2StudyTracker: React.FC = () => {
  const {
    data,
    addSubject,
    updateSubject,
    deleteSubject,
    addSession,
    updateSession,
    deleteSession,
    setMonthlyGoal,
    deleteMonthlyGoal,
  } = useStudyTracker();

  React.useEffect(() => {
    console.log('StudyTracker data:', data);
  }, [data]);

  // Check if data loaded
  if (!data || !data.subjects) {
    return <Spin />;
  }

  const tabItems = [
    {
      key: '1',
      tab: 'Danh mục môn học',
      children: (
        <div style={{ marginTop: '20px' }}>
          <SubjectManagement
            subjects={data.subjects}
            onAddSubject={addSubject}
            onUpdateSubject={updateSubject}
            onDeleteSubject={deleteSubject}
          />
        </div>
      ),
    },
    {
      key: '2',
      tab: 'Tiến độ học tập',
      children: (
        <div style={{ marginTop: '20px' }}>
          <StudyProgress
            subjects={data.subjects}
            sessions={data.sessions}
            onAddSession={addSession}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
          />
        </div>
      ),
    },
    {
      key: '3',
      tab: 'Mục tiêu hàng tháng',
      children: (
        <div style={{ marginTop: '20px' }}>
          <MonthlyGoals
            subjects={data.subjects}
            sessions={data.sessions}
            monthlyGoals={data.monthlyGoals}
            onSetGoal={setMonthlyGoal}
            onDeleteGoal={deleteMonthlyGoal}
          />
        </div>
      ),
    },
  ];

  return (
    <Card style={{ margin: '20px' }}>
      <h1 style={{ marginBottom: '24px' }}>Bài 2: Ứng dụng quản lý tiến độ học tập</h1>
      <Tabs children={tabItems.map((item) => (
        <Tabs.TabPane key={item.key} tab={item.tab}>
          {item.children}
        </Tabs.TabPane>
      ))} />
    </Card>
  );
};

export default Bai2StudyTracker;
