import { Table, Button, Space, Popconfirm, Select, Modal, Tag, Input, DatePicker, Row, Col } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState, useMemo } from 'react';
import type { Order } from '../../models/quanlysanpham';
import { useOrder } from '../../models/quanlysanpham';
import dayjs from 'dayjs';

const OrderTable: React.FC = () => {
  const { orders, deleteOrder, updateOrderStatus } = useOrder();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'pending':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order: any) => {
      // Search by customer name or order ID
      if (
        searchText &&
        !order.customerName.toLowerCase().includes(searchText.toLowerCase()) &&
        !order.id.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }

      // Filter by date range
      if (dateRange) {
        const orderDate = dayjs(order.createdAt);
        if (
          orderDate.isBefore(dayjs(dateRange[0])) ||
          orderDate.isAfter(dayjs(dateRange[1]))
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort by date
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'descend' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [orders, searchText, statusFilter, dateRange, sortOrder]);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) return;

    updateOrderStatus(orderId, newStatus);
  };

  const handleShowDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      width: 100,
      render: (products: any[]) => products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130,
      render: (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount);
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: any, record: any) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          style={{ width: '100%' }}
        >
          <Select.Option value='pending'>
            <Tag color={getStatusColor('pending')}>Chờ xử lý</Tag>
          </Select.Option>
          <Select.Option value='completed'>
            <Tag color={getStatusColor('completed')}>Hoàn thành</Tag>
          </Select.Option>
          <Select.Option value='cancelled'>
            <Tag color={getStatusColor('cancelled')}>Đã hủy</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size='small'>
          <Button
            type='primary'
            size='small'
            icon={<EyeOutlined />}
            onClick={() => handleShowDetail(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa đơn hàng này?'
            onConfirm={() => deleteOrder(record.id)}
            okText='Có'
            cancelText='Không'
          >
            <Button danger size='small' icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tìm kiếm</label>
            <Input
              placeholder='Mã đơn/Tên khách hàng'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Trạng thái</label>
            <Select
              placeholder='Chọn trạng thái'
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value='Chờ xử lý'>Chờ xử lý</Select.Option>
              <Select.Option value='Đang giao'>Đang giao</Select.Option>
              <Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
              <Select.Option value='Đã hủy'>Đã hủy</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Thứ tự</label>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ width: '100%' }}
            >
              <Select.Option value={null}>Mặc định</Select.Option>
              <Select.Option value='descend'>Mới nhất</Select.Option>
              <Select.Option value='ascend'>Cũ nhất</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Khoảng ngày</label>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                  ]);
                } else {
                  setDateRange(null);
                }
              }}
            />
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredOrders.map((o: any) => ({ ...o, key: o.id }))}
        pagination={{
          pageSize: 5,
          total: filteredOrders.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
        }}
        bordered
        size='middle'
      />

      {/* Order Detail Modal */}
      <Modal
        title='Chi tiết đơn hàng'
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Mã đơn hàng:</strong> {selectedOrder.id}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Trạng thái:</strong>{' '}
              <Tag color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status}
              </Tag>
            </div>

            <h3>Thông tin khách hàng</h3>
            <div style={{ marginBottom: '8px' }}>
              <strong>Tên:</strong> {selectedOrder.customerName}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Số điện thoại:</strong> {selectedOrder.customerPhone}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Email:</strong> {selectedOrder.customerEmail}
            </div>

            <h3>Danh sách sản phẩm</h3>
            <Table
              columns={[
                {
                  title: 'ID Sản phẩm',
                  dataIndex: 'productId',
                  key: 'productId',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => {
                    return new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(price);
                  },
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record: any) => {
                    return new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(record.price * record.quantity);
                  },
                },
              ]}
              dataSource={selectedOrder.products.map((p: any, index: any) => ({
                ...p,
                key: index,
              }))}
              pagination={false}
              size='small'
            />

            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <h3>
                Tổng tiền:{' '}
                <span style={{ color: '#f5222d' }}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(selectedOrder.totalPrice)}
                </span>
              </h3>
            </div>

            <div style={{ marginTop: '16px', color: '#666', fontSize: '12px' }}>
              <strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTable;
