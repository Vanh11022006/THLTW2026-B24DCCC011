export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  viewCount: number;
  createdAt: string;
  author: string;
}

export const mockTags = ['React', 'UmiJS', 'JavaScript', 'Frontend', 'Lập trình'];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Hướng dẫn học React cho người mới bắt đầu',
    slug: 'huong-dan-hoc-react',
    summary: 'Bài viết này sẽ giúp bạn nắm bắt những khái niệm cơ bản nhất của React, từ Component đến State và Props.',
    content: '## Nội dung bài viết\n\nReact là một thư viện JavaScript...\n\n### 1. Component là gì?\nComponent là các khối xây dựng...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['React', 'Frontend', 'Lập trình'],
    status: 'PUBLISHED',
    viewCount: 150,
    createdAt: '2026-04-10',
    author: 'Nguyễn Văn A',
  },
  {
    id: '2',
    title: 'Sức mạnh của UmiJS trong dự án thực tế',
    slug: 'suc-manh-cua-umijs',
    summary: 'Tại sao nên chọn UmiJS thay vì Create React App? Khám phá cách UmiJS tối ưu hóa quy trình phát triển.',
    content: '## UmiJS là gì?\nUmiJS là một framework...',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['UmiJS', 'React', 'Frontend'],
    status: 'PUBLISHED',
    viewCount: 320,
    createdAt: '2026-04-15',
    author: 'Trần Thị B',
  },
  {
    id: '3',
    title: 'Sự khác biệt giữa Let, Const và Var',
    slug: 'let-const-var-javascript',
    summary: 'Giải thích chi tiết về Scope và Hoisting trong JavaScript thông qua 3 từ khóa khai báo biến phổ biến.',
    content: '## Giới thiệu\nTrong JavaScript hiện đại...',
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    tags: ['JavaScript', 'Lập trình'],
    status: 'PUBLISHED',
    viewCount: 89,
    createdAt: '2026-04-18',
    author: 'Lê Văn C',
  },
  {
    id: '4',
    title: 'Bản nháp: Các hook quan trọng',
    slug: 'cac-hook-quan-trong',
    summary: 'Bài viết đang viết dở...',
    content: 'Đang cập nhật...',
    coverImage: 'https://via.placeholder.com/800x400',
    tags: ['React'],
    status: 'DRAFT',
    viewCount: 0,
    createdAt: '2026-04-20',
    author: 'Nguyễn Văn A',
  }
];