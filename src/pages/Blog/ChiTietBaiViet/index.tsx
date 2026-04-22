import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Tag, Typography, Space, Button, Row, Col, Divider, List } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { mockPosts, Post } from '../data';

const { Title, Text } = Typography;

const ChiTietBaiViet: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const currentPost = mockPosts.find(p => p.slug === slug);
    
    if (currentPost) {
      setPost({ ...currentPost, viewCount: currentPost.viewCount + 1 });
      
      const related = mockPosts.filter(p => 
        p.id !== currentPost.id && 
        p.status === 'PUBLISHED' &&
        p.tags.some(tag => currentPost.tags.includes(tag))
      ).slice(0, 3);
      
      setRelatedPosts(related);
    }
  }, [slug]);

  if (!post) {
    return (
      <PageContainer>
        <Card style={{ textAlign: 'center', padding: 50 }}>
          <Title level={3}>Không tìm thấy bài viết!</Title>
          <Button type="primary" onClick={() => history.push('/blog/trang-chu')}>
            Về trang chủ
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title=" "
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog/trang-chu')}>
          Quay lại danh sách
        </Button>
      ]}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              {post.tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
            </div>
            
            <Title level={1} style={{ marginTop: 0 }}>{post.title}</Title>
            
            <Space split={<Divider type="vertical" />} style={{ marginBottom: 24, flexWrap: 'wrap' }}>
              <Text type="secondary"><UserOutlined /> {post.author}</Text>
              <Text type="secondary"><CalendarOutlined /> {post.createdAt}</Text>
              <Text type="secondary"><EyeOutlined /> {post.viewCount} lượt xem</Text>
            </Space>

            {post.coverImage && (
              <img 
                src={post.coverImage} 
                alt={post.title} 
                style={{ width: '100%', borderRadius: 8, marginBottom: 24, maxHeight: 400, objectFit: 'cover' }} 
              />
            )}
            <Typography style={{ fontSize: 16, lineHeight: 1.8 }}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </Typography>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card title="Bài viết liên quan" style={{ position: 'sticky', top: 24 }}>
            {relatedPosts.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={relatedPosts}
                renderItem={item => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <a onClick={() => history.push(`/blog/bai-viet/${item.slug}`)}>
                      <Text strong style={{ color: '#1890ff' }}>{item.title}</Text>
                    </a>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.createdAt}</Text>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Chưa có bài viết liên quan.</Text>
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ChiTietBaiViet;