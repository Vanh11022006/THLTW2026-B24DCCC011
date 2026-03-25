import React from 'react';
import { Tabs, Card } from 'antd';
import { AppProvider } from './AppContext';
import { SoVanBangManagement } from './SoVanBangManagement';
import { QuyetDinhManagement } from './QuyetDinhManagement';
import { BieuMauManagement } from './BieuMauManagement';
import { ThongTinVanBangManagement } from './ThongTinVanBangManagement';
import { TraCuuVanBang } from './TraCuuVanBang';
import type { SoVanBang, QuyetDinhTotNghiep, ThongTinVanBang, BieuMauPhuLuc } from './types';

const TabsContent = () => {
  const items = [
    {
      key: '1',
      label: '📚 Quản Lý Sổ Văn Bằng',
      children: <SoVanBangManagement />,
    },
    {
      key: '2',
      label: '📋 Quyết Định Tốt Nghiệp',
      children: <QuyetDinhManagement />,
    },
    {
      key: '3',
      label: '⚙️ Cấu Hình Biểu Mẫu Phụ Lục',
      children: <BieuMauManagement />,
    },
    {
      key: '4',
      label: '🎓 Thông Tin Văn Bằng',
      children: <ThongTinVanBangManagement />,
    },
    {
      key: '5',
      label: '🔍 Tra Cứu Văn Bằng',
      children: <TraCuuVanBang />,
    },
  ];

  return (
    <Card style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Hệ Thống Quản Lý Sổ Văn Bằng Tốt Nghiệp</h1>
      <Tabs items={items} />
    </Card>
  );
};

export const QuanLyVanBang: React.FC = () => {
  return (
    <AppProvider>
      <TabsContent />
    </AppProvider>
  );
};

// Export named exports
export {
  SoVanBangManagement,
  QuyetDinhManagement,
  BieuMauManagement,
  ThongTinVanBangManagement,
  TraCuuVanBang,
};

export default QuanLyVanBang;
