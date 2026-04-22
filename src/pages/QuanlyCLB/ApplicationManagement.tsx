import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Table,
  Space,
  message,
  Popconfirm,
  Select,
  Drawer,
  Timeline,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, HistoryOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useRequest } from 'umi';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  approveApplication,
  rejectApplication,
  approveMultipleApplications,
  rejectMultipleApplications,
  getActionHistory,
} from '@/services/QuanlyCLB';
import { getClubs } from '@/services/QuanlyCLB/club';
import type { IApplication, ApplicationStatus, IActionHistory } from './types';
import dayjs from 'dayjs';

const ApplicationManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<IApplication | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectingIds, setRejectingIds] = useState<string[]>([]);
  const [rejectForm] = Form.useForm();
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState('Admin'); // Should get from auth

  // Fetch applications
  const { data: appsData, loading: loadingApps, refresh: refreshApps } = useRequest(
    () =>
      getApplications({
        page: currentPage,
        limit: pageSize,
        keyword: searchKeyword,
        status: filterStatus,
      }),
    {
      debounceWait: 300,
      manual: false,
      refreshDeps: [currentPage, pageSize, searchKeyword, filterStatus],
    }
  );

  // Fetch clubs
  const { data: clubsData } = useRequest(() => getClubs({ page: 1, limit: 1000 }));

  // Fetch action history
  const { data: historyData, loading: loadingHistory, run: fetchHistory } = useRequest(
    () =>
      getActionHistory(selectedAppId, {
        page: 1,
        limit: 100,
      }),
    {
      manual: true,
    }
  );

  const applications = appsData?.data?.items || [];
  const total = appsData?.data?.total || 0;
  const clubs = clubsData?.data?.items || [];
  const actionHistories = historyData?.data?.items || [];

  // Handle open history drawer
  const handleViewHistory = async (appId: string) => {
    setSelectedAppId(appId);
    setHistoryDrawerVisible(true);
    // Trigger fetch after state is updated
    setTimeout(() => fetchHistory(), 0);
  };

  // Handle open modal for create/edit
  const handleOpenModal = (app?: IApplication) => {
    if (app) {
      setEditingApp(app);
      form.setFieldsValue(app);
    } else {
      setEditingApp(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingApp(null);
    form.resetFields();
  };

  // Handle submit form
  const handleSubmit = async (values: any) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, values);
        message.success('Cập nhật đơn đăng ký thành công');
      } else {
        await createApplication({
          ...values,
          status: 'Pending',
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
        message.success('Thêm mới đơn đăng ký thành công');
      }

      handleCloseModal();
      refreshApps();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      message.success('Xóa đơn đăng ký thành công');
      refreshApps();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle approve single
  const handleApproveSingle = async (id: string) => {
    try {
      await approveApplication(id, currentUser);
      message.success('Duyệt đơn thành công');
      refreshApps();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle reject single
  const handleRejectSingle = (ids: string[]) => {
    setRejectingIds(ids);
    setIsRejectModalVisible(true);
    rejectForm.resetFields();
  };

  // Handle reject confirm
  const handleRejectConfirm = async (values: any) => {
    try {
      if (rejectingIds.length === 1) {
        await rejectApplication(rejectingIds[0], {
          actionBy: currentUser,
          rejectNote: values.rejectNote,
        });
      } else {
        await rejectMultipleApplications(rejectingIds, {
          actionBy: currentUser,
          rejectNote: values.rejectNote,
        });
      }

      message.success('Từ chối đơn thành công');
      setIsRejectModalVisible(false);
      rejectForm.resetFields();
      setRejectingIds([]);
      setSelectedRowKeys([]);
      refreshApps();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle approve multiple
  const handleApproveMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }

    try {
      await approveMultipleApplications(selectedRowKeys as string[], currentUser);
      message.success(`Duyệt ${selectedRowKeys.length} đơn thành công`);
      setSelectedRowKeys([]);
      refreshApps();
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  // Handle reject multiple
  const handleRejectMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }

    handleRejectSingle(selectedRowKeys as string[]);
  };

  // Get status tag color
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  // Get status label
  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'Chờ duyệt';
      case 'Approved':
        return 'Đã duyệt';
      case 'Rejected':
        return 'Từ chối';
      default:
        return status;
    }
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
      render: (clubId) => {
        const club = clubs.find((c) => c.id === clubId);
        return club?.name || 'N/A';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ApplicationStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Từ chối', value: 'Rejected' },
      ],
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space wrap>
          <Button
            type="text"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record.id)}
          >
            Lịch sử
          </Button>
          <Button
            type="dashed"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApproveSingle(record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleRejectSingle([record.id])}
              >
                Từ chối
              </Button>
            </>
          )}
          <Popconfirm
            title="Xóa đơn đăng ký"
            description="Bạn chắc chắn muốn xóa đơn đăng ký này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          allowClear
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 200 }}
          value={filterStatus}
          onChange={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
          options={[
            { label: 'Chờ duyệt', value: 'Pending' },
            { label: 'Đã duyệt', value: 'Approved' },
            { label: 'Từ chối', value: 'Rejected' },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm mới
        </Button>
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f5ff', borderRadius: 4 }}>
          <span style={{ marginRight: 16 }}>Đã chọn: {selectedRowKeys.length} đơn</span>
          <Button type="primary" size="small" onClick={handleApproveMultiple} style={{ marginRight: 8 }}>
            Duyệt {selectedRowKeys.length} đơn đã chọn
          </Button>
          <Button type="primary" danger size="small" onClick={handleRejectMultiple}>
            Không duyệt {selectedRowKeys.length} đơn đã chọn
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={applications}
        rowKey="id"
        loading={loadingApps}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getCheckboxProps: (record) => ({
            disabled: record.status !== 'Pending',
          }),
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
          showTotal: (total) => `Tổng cộng: ${total} đơn đăng ký`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* Modal Create/Edit Application */}
      <Modal
        title={editingApp ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCloseModal}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
          >
            <Input placeholder="Nhập SĐT" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select
              options={[
                { label: 'Nam', value: 'Male' },
                { label: 'Nữ', value: 'Female' },
                { label: 'Khác', value: 'Other' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Sở trường"
            name="talent"
            rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
          >
            <Input placeholder="Nhập sở trường" />
          </Form.Item>

          <Form.Item
            label="Câu lạc bộ"
            name="clubId"
            rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
          >
            <Select
              placeholder="Chọn câu lạc bộ"
              options={clubs.map((club) => ({
                label: club.name,
                value: club.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Lý do đăng ký"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do đăng ký" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Reject Application */}
      <Modal
        title={`Từ chối ${rejectingIds.length} đơn đăng ký`}
        open={isRejectModalVisible}
        onOk={() => rejectForm.submit()}
        onCancel={() => {
          setIsRejectModalVisible(false);
          rejectForm.resetFields();
          setRejectingIds([]);
        }}
      >
        <Form
          form={rejectForm}
          layout="vertical"
          onFinish={handleRejectConfirm}
          autoComplete="off"
        >
          <Form.Item
            label="Lý do từ chối (bắt buộc)"
            name="rejectNote"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer Action History */}
      <Drawer
        title={`Lịch sử thao tác`}
        placement="right"
        onClose={() => {
          setHistoryDrawerVisible(false);
          setSelectedAppId('');
        }}
        open={historyDrawerVisible}
        width={500}
      >
        {loadingHistory ? (
          <div>Đang tải...</div>
        ) : (
          <Timeline
            items={actionHistories.map((history: IActionHistory) => ({
              color:
                history.action === 'Approved'
                  ? 'green'
                  : history.action === 'Rejected'
                    ? 'red'
                    : 'blue',
              children: (
                <div>
                  <div>
                    <strong>{history.actionBy}</strong> - {getStatusLabel(history.action as ApplicationStatus)}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {dayjs(history.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                  {history.note && <div style={{ marginTop: 4 }}>{history.note}</div>}
                </div>
              ),
            }))}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ApplicationManagement;
