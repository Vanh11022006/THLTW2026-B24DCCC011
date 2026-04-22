import React, { useState } from 'react';
import {
  Button,
  Table,
  Space,
  message,
  Select,
  Modal,
  Input,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useRequest } from 'umi';
import { getApprovedMembers, changeClubForMembers } from '@/services/QuanlyCLB';
import { getClubs } from '@/services/QuanlyCLB/club';
import type { IApplication } from './types';
import dayjs from 'dayjs';

interface MemberManagementProps {
  selectedClubId?: string;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ selectedClubId }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedClubForChange, setSelectedClubForChange] = useState<string>('');
  const [currentUser] = useState('Admin');

  // Fetch approved members
  const { data: membersData, loading: loadingMembers, refresh: refreshMembers } = useRequest(
    () =>
      getApprovedMembers({
        page: currentPage,
        limit: pageSize,
        keyword: searchKeyword,
        clubId: selectedClubId,
      }),
    {
      debounceWait: 300,
      manual: false,
      refreshDeps: [currentPage, pageSize, searchKeyword, selectedClubId],
    }
  );

  // Fetch clubs
  const { data: clubsData } = useRequest(() => getClubs({ page: 1, limit: 1000 }));

  const members = membersData?.data?.items || [];
  const total = membersData?.data?.total || 0;
  const clubs = clubsData?.data?.items || [];

  // Handle change club
  const handleChangeClub = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thành viên');
      return;
    }

    if (!selectedClubForChange) {
      message.warning('Vui lòng chọn câu lạc bộ để chuyển đến');
      return;
    }

    handleConfirmChangeClub();
  };

  // Handle confirm change club
  const handleConfirmChangeClub = async () => {
    try {
      const selectedClub = clubs.find((c) => c.id === selectedClubForChange);
      Modal.confirm({
        title: 'Xác nhận chuyển câu lạc bộ',
        content: `Bạn có chắc chắn muốn chuyển ${selectedRowKeys.length} thành viên sang "${selectedClub?.name}"?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            await changeClubForMembers({
              memberIds: selectedRowKeys as string[],
              newClubId: selectedClubForChange,
              modifiedBy: currentUser,
            });

            message.success(
              `Chuyển ${selectedRowKeys.length} thành viên sang "${selectedClub?.name}" thành công`
            );
            setSelectedClubForChange('');
            setSelectedRowKeys([]);
            refreshMembers();
          } catch (error) {
            message.error('Có lỗi xảy ra');
            console.error(error);
          }
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Get current club name
  const getCurrentClubName = (clubId: string) => {
    const club = clubs.find((c) => c.id === clubId);
    return club?.name || 'N/A';
  };

  // Table columns
  const columns: TableColumnsType<IApplication> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderMap: Record<string, string> = {
          Male: 'Nam',
          Female: 'Nữ',
          Other: 'Khác',
        };
        return genderMap[gender] || gender;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sở trường',
      dataIndex: 'talent',
      key: 'talent',
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId) => getCurrentClubName(clubId),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Tìm kiếm thành viên..."
          allowClear
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
        />
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f5ff', borderRadius: 4 }}>
          <span style={{ marginRight: 16 }}>Đã chọn: {selectedRowKeys.length} thành viên</span>
          <Select
            placeholder="Chọn câu lạc bộ để chuyển đến"
            style={{ width: 250, marginRight: 8 }}
            value={selectedClubForChange}
            onChange={(value) => setSelectedClubForChange(value)}
            options={clubs.map((club) => ({
              label: club.name,
              value: club.id,
            }))}
          />
          <Button
            type="primary"
            onClick={handleChangeClub}
            disabled={!selectedClubForChange}
          >
            Chuyển CLB
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={members}
        rowKey="id"
        loading={loadingMembers}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng: ${total} thành viên`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default MemberManagement;
