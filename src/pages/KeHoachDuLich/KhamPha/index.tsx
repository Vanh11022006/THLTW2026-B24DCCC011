import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Rate, Tag, Radio, Typography, Space, Button, Slider, Select, Modal, DatePicker, message } from 'antd';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { mockDiemDen } from '../data';
import type { Moment } from 'moment';

const { Title, Text } = Typography;

const KhamPhaDiemDen: React.FC = () => {
  const history = useHistory();
  const [filterType, setFilterType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('name');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  const handleAddToItinerary = (item: any) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedDate) {
      message.error('Vui lòng chọn ngày tham quan');
      return;
    }

    // Lưu vào localStorage để LichTrinh component có thể đọc
    const pendingItem = {
      ...selectedItem,
      visitDate: selectedDate.format('YYYY-MM-DD'),
    };
    localStorage.setItem('pendingAddToItinerary', JSON.stringify(pendingItem));
    
    message.success('Đi tới trang lịch trình để hoàn tất');
    setIsModalVisible(false);
    setSelectedDate(null);
    
    // Navigate tới trang LichTrinh
    history.push('/ke-hoach-du-lich/lich-trinh');
  };

  const dataHienThi = useMemo(() => {
    let filtered = mockDiemDen.filter(item => {
      const typeMatch = filterType === 'all' || item.type === filterType;
      const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
      const ratingMatch = item.rating >= minRating;
      return typeMatch && priceMatch && ratingMatch;
    });

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [filterType, priceRange, minRating, sortBy]);

  return (
    <PageContainer 
      title="Khám phá điểm đến" 
      subTitle="Tìm kiếm những địa điểm tuyệt vời cho chuyến đi của bạn"
    >
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Filter theo loại hình */}
          <div>
            <Text strong>Lọc theo loại hình:</Text>
            <div style={{ marginTop: 8 }}>
              <Radio.Group 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="all">Tất cả</Radio.Button>
                <Radio.Button value="biển">Du lịch Biển</Radio.Button>
                <Radio.Button value="núi">Khám phá Núi</Radio.Button>
                <Radio.Button value="thành phố">Thành phố</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Filter theo giá */}
          <div>
            <Text strong>Giá cả: {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')} VND</Text>
            <Slider
              range
              min={0}
              max={3000000}
              step={100000}
              value={priceRange}
              onChange={(value) => setPriceRange(value as [number, number])}
              style={{ marginTop: 8 }}
            />
          </div>

          {/* Filter theo đánh giá */}
          <div>
            <Text strong>Đánh giá tối thiểu:</Text>
            <div style={{ marginTop: 8 }}>
              <Radio.Group 
                value={minRating} 
                onChange={(e) => setMinRating(e.target.value)}
              >
                <Radio value={0}>Tất cả ⭐</Radio>
                <Radio value={3}>3 sao trở lên ⭐⭐⭐</Radio>
                <Radio value={4}>4 sao trở lên ⭐⭐⭐⭐</Radio>
                <Radio value={4.5}>4.5 sao trở lên ⭐⭐⭐⭐+</Radio>
              </Radio.Group>
            </div>
          </div>

          {/* Sort */}
          <div>
            <Text strong>Sắp xếp:</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 200, marginTop: 8 }}
            >
              <Select.Option value="name">Tên (A-Z)</Select.Option>
              <Select.Option value="price-asc">Giá (Thấp - Cao)</Select.Option>
              <Select.Option value="price-desc">Giá (Cao - Thấp)</Select.Option>
              <Select.Option value="rating-desc">Đánh giá (Cao nhất)</Select.Option>
            </Select>
          </div>
        </Space>
      </Card>

      <Row gutter={[24, 24]}>
        {dataHienThi.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
              actions={[
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={() => handleAddToItinerary(item)}
                >
                  Thêm vào lịch trình
                </Button>
              ]}
            >
              <Card.Meta 
                title={<Title level={4} style={{ margin: 0 }}>{item.name}</Title>} 
                description={
                  <Space style={{ marginTop: 8 }}>
                    <EnvironmentOutlined style={{ color: 'red' }}/>
                    <Text type="secondary">{item.location}</Text>
                  </Space>
                } 
              />
              
              <div style={{ marginTop: 16 }}>
                <Tag color={item.type === 'biển' ? 'blue' : item.type === 'núi' ? 'green' : 'magenta'}>
                  {item.type.toUpperCase()}
                </Tag>
                <Rate disabled defaultValue={item.rating} style={{ fontSize: 14, marginLeft: 8 }} />
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">{item.description}</Text>
              </div>

              <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                <Text strong style={{ fontSize: 18, color: '#cf1322' }}>
                  {item.price.toLocaleString('vi-VN')} VND
                </Text>
                <Text type="secondary" style={{ float: 'right' }}>
                  {item.timeToVisit}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={selectedItem ? `Thêm ${selectedItem.name} vào lịch trình` : 'Thêm vào lịch trình'}
        open={isModalVisible}
        onOk={handleConfirmAdd}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedDate(null);
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Chọn ngày tham quan:</Text>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            format="DD/MM/YYYY"
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        {selectedItem && (
          <Card size="small" style={{ backgroundColor: '#fafafa' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Địa điểm:</Text>
                <Text strong style={{ marginLeft: 8 }}>{selectedItem.name}</Text>
              </div>
              <div>
                <Text type="secondary">Vị trí:</Text>
                <Text strong style={{ marginLeft: 8 }}>{selectedItem.location}</Text>
              </div>
              <div>
                <Text type="secondary">Giá:</Text>
                <Text strong style={{ marginLeft: 8, color: '#cf1322' }}>
                  {selectedItem.price.toLocaleString('vi-VN')} VND
                </Text>
              </div>
              <div>
                <Text type="secondary">Thời gian tham quan:</Text>
                <Text strong style={{ marginLeft: 8 }}>{selectedItem.timeToVisit}</Text>
              </div>
            </Space>
          </Card>
        )}
      </Modal>
    </PageContainer>
  );
};

export default KhamPhaDiemDen;