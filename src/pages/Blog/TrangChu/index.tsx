import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { List, Card, Tag, Input, Typography, Space, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useDebounce } from 'ahooks';
import { mockPosts, mockTags, Post } from '../data';

const { Title, Paragraph, Text } = Typography;

const TrangChuBlog: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const debouncedSearchText = useDebounce(searchText, { wait: 300 });

  const filteredPosts = mockPosts.filter((post) => {
    const isPublished = post.status === 'PUBLISHED';
    const matchSearch = post.title.toLowerCase().includes(debouncedSearchText.toLowerCase()) || 
                        post.summary.toLowerCase().includes(debouncedSearchText.toLowerCase());
    const matchTag = selectedTag ? post.tags.includes(selectedTag) : true;

    return isPublished && matchSearch && matchTag;
  });

  return (
    <PageContainer title="Khám phá Bài viết mới nhất">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6}>
          <Card title="Tìm kiếm & Lọc" style={{ position: 'sticky', top: 24 }}>
            <Input
              placeholder="Nhập từ khóa..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ marginBottom: 24 }}
            />
            
            <Title level={5}>Thẻ (Tags) phổ biến</Title>
            <Space size={[0, 8]} wrap>
              <Tag.CheckableTag
                checked={selectedTag === null}
                onChange={() => setSelectedTag(null)}
              >
                Tất cả
              </Tag.CheckableTag>
              {mockTags.map((tag) => (
                <Tag.CheckableTag
                  key={tag}
                  checked={selectedTag === tag}
                  onChange={(checked) => setSelectedTag(checked ? tag : null)}
                >
                  {tag}
                </Tag.CheckableTag>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <List<Post>
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            dataSource={filteredPosts}
            pagination={{
              pageSize: 9,
              showSizeChanger: false,
            }}
            renderItem={(post) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img alt={post.title} src={post.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ marginBottom: 12 }}>
                    {post.tags.map((tag) => (
                      <Tag color="blue" key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  
                  <Title level={4} style={{ marginTop: 0, flex: 1 }}>
                    <a href={`/blog/bai-viet/${post.slug}`} style={{ color: 'inherit' }}>{post.title}</a>
                  </Title>
                  
                  <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                    {post.summary}
                  </Paragraph>

                  <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                    <Space split={<Text type="secondary">|</Text>} style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <UserOutlined /> <Text type="secondary">{post.author}</Text>
                      </Space>
                      <Space>
                         <CalendarOutlined /> <Text type="secondary">{post.createdAt}</Text>
                      </Space>
                    </Space>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary"><EyeOutlined /> {post.viewCount} lượt xem</Text>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default TrangChuBlog;