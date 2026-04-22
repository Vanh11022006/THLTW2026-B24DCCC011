import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Alert, List, Button, Select, Typography, Statistic, Space, DatePicker, Tag, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import { mockDiemDen, DiemDen } from '../data';
import type { Moment } from 'moment';

const { Text } = Typography;

interface DiemDenInItinerary extends DiemDen {
  visitDate: string; // YYYY-MM-DD
}

const TaoLichTrinh: React.FC = () => {
  const [lichTrinh, setLichTrinh] = useState<DiemDenInItinerary[]>([]);
  const [selectedDiemDenId, setSelectedDiemDenId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  
  const NGAN_SACH_MAX = 5000000;

  // Đọc pending item từ localStorage khi component mount
  React.useEffect(() => {
    const pendingItem = localStorage.getItem('pendingAddToItinerary');
    if (pendingItem) {
      try {
        const item: DiemDenInItinerary = JSON.parse(pendingItem);
        setLichTrinh([item]);
        localStorage.removeItem('pendingAddToItinerary');
      } catch (error) {
        console.log('Error parsing pending item:', error);
      }
    }
  }, []); 

  const themDiemDen = () => {
    if (!selectedDiemDenId || !selectedDate) {
      alert('Vui lòng chọn điểm đến và ngày tham quan');
      return;
    }
    const diemDen = mockDiemDen.find(d => d.id === selectedDiemDenId);
    if (diemDen) {
      setLichTrinh([...lichTrinh, {
        ...diemDen,
        visitDate: selectedDate?.format('YYYY-MM-DD') || '',
      }]);
      setSelectedDiemDenId(null);
      setSelectedDate(null);
    }
  };

  const xoaDiemDen = (index: number) => {
    const listMoi = [...lichTrinh];
    listMoi.splice(index, 1);
    setLichTrinh(listMoi);
  };

  // Tính thời gian di chuyển (mock - giả sử 2h giữa các điểm)
  const tinhThoiGianDiChuyen = (index: number): string => {
    if (index === 0) return '---';
    return '2 giờ';
  };

  const lichTrinhHienThi = useMemo(() => {
    if (sortByDate) {
      return [...lichTrinh].sort((a, b) => a.visitDate.localeCompare(b.visitDate));
    }
    return lichTrinh;
  }, [lichTrinh, sortByDate]);

  const tongChiPhi = lichTrinh.reduce((sum, item) => sum + item.price, 0);
  const vuotNganSach = tongChiPhi > NGAN_SACH_MAX;

  const dataBieuDo = useMemo(() => {
    if (tongChiPhi === 0) return [];
    return [
      { category: 'Lưu trú (35%)', value: tongChiPhi * 0.35 },
      { category: 'Ăn uống (30%)', value: tongChiPhi * 0.30 },
      { category: 'Di chuyển (25%)', value: tongChiPhi * 0.25 },
      { category: 'Phát sinh (10%)', value: tongChiPhi * 0.10 },
    ];
  }, [tongChiPhi]);

  const configPie = {
    appendPadding: 10,
    data: dataBieuDo,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <PageContainer title="Lịch trình của tôi" subTitle="Lên kế hoạch và quản lý chi phí chuyến đi">
      
      {vuotNganSach && (
        <Alert
          message="Cảnh báo: Vượt quá ngân sách!"
          description={`Bạn đã vượt qua ngân sách dự kiến ${(tongChiPhi - NGAN_SACH_MAX).toLocaleString('vi-VN')} VND. Hãy xem xét lại lịch trình.`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Card 
            title="Chi tiết lịch trình" 
            extra={
              <Button 
                icon={<SortAscendingOutlined />}
                onClick={() => setSortByDate(!sortByDate)}
                type={sortByDate ? 'primary' : 'default'}
              >
                {sortByDate ? 'Sắp xếp theo ngày ✓' : 'Sắp xếp theo ngày'}
              </Button>
            }
          >
            <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space wrap align="center">
                  <Select
                    showSearch
                    style={{ width: 250 }}
                    placeholder="Chọn điểm đến..."
                    optionFilterProp="children"
                    value={selectedDiemDenId}
                    onChange={setSelectedDiemDenId}
                  >
                    {mockDiemDen.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name} - {item.price.toLocaleString()}đ
                      </Select.Option>
                    ))}
                  </Select>

                  <DatePicker
                    placeholder="Chọn ngày tham quan"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    format="DD/MM/YYYY"
                  />

                  <Button type="primary" icon={<PlusOutlined />} onClick={themDiemDen}>
                    Thêm
                  </Button>
                </Space>
              </Space>
            </Card>

            {lichTrinh.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                Chưa có điểm đến nào. Hãy thêm điểm đến vào lịch trình nhé!
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={lichTrinhHienThi}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => xoaDiemDen(lichTrinh.indexOf(item))}>
                        Xóa
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />}
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          <Tag color="blue">{item.visitDate}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical">
                          <Space>
                            <Text type="secondary">{item.location}</Text>
                            <Divider type="vertical" />
                            <Text type="secondary">Thời gian: {item.timeToVisit}</Text>
                            <Divider type="vertical" />
                            <Text type="secondary">Di chuyển: {tinhThoiGianDiChuyen(index)}</Text>
                          </Space>
                        </Space>
                      }
                    />
                    <div style={{ fontWeight: 'bold', color: '#cf1322' }}>
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Quản lý ngân sách" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Ngân sách dự kiến" value={NGAN_SACH_MAX} suffix="VND" />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Tổng chi phí hiện tại" 
                  value={tongChiPhi} 
                  suffix="VND" 
                  valueStyle={{ color: vuotNganSach ? '#cf1322' : '#3f8600' }} 
                />
              </Col>
            </Row>
          </Card>

          <Card title="Phân bổ chi phí">
            {tongChiPhi > 0 ? (
              <Pie {...configPie} />
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                Thêm điểm đến để xem biểu đồ
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default TaoLichTrinh;