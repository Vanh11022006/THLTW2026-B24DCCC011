import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Avatar, Typography, Row, Col, Divider, Space, Tag } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GioiThieu: React.FC = () => {
  return (
    <PageContainer title="Về Tác Giả">
      <Row justify="center">
        <Col xs={24} md={16} lg={12}>
          <Card style={{ textAlign: 'center', borderRadius: 16 }}>
            <Avatar 
              size={120} 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
              style={{ border: '4px solid #f0f0f0', marginBottom: 16 }}
            />
            <Title level={2} style={{ marginBottom: 0 }}>Hà Trọng Việt Anh</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>Web Developer & Tech Blogger</Text>
            
            <Divider />
            
            <Paragraph style={{ fontSize: 16, textAlign: 'justify' }}>
              Xin chào! Mình là sinh viên yêu thích lập trình và công nghệ. Blog này là nơi mình ghi chép lại hành trình học tập, chia sẻ những kiến thức về React, UmiJS, và những câu chuyện thú vị trong quá trình code. Rất vui được kết nối với mọi người!
            </Paragraph>

            <div style={{ margin: '24px 0' }}>
              <Title level={5} style={{ textAlign: 'left' }}>Kỹ năng (Skills)</Title>
              <div style={{ textAlign: 'left' }}>
                <Tag color="cyan">ReactJS</Tag>
                <Tag color="blue">TypeScript</Tag>
                <Tag color="geekblue">UmiJS</Tag>
                <Tag color="purple">Ant Design</Tag>
                <Tag color="green">Node.js</Tag>
              </div>
            </div>

            <Space size="large" style={{ marginTop: 16 }}>
              <a href="https://github.com/Vanh11022006" style={{ fontSize: 24, color: '#333' }}><GithubOutlined /></a>
              <a href="#" style={{ fontSize: 24, color: '#0077b5' }}><LinkedinOutlined /></a>
              <a href="#" style={{ fontSize: 24, color: '#ea4335' }}><MailOutlined /></a>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default GioiThieu;