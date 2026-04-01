/**
 * Mock data generator for development and testing
 * This file provides utilities to generate realistic test data
 */

import type { IClub, IApplication, IActionHistory } from './types';
import dayjs from 'dayjs';

/**
 * Generate mock clubs
 */
export const generateMockClubs = (count: number = 5): IClub[] => {
  const clubNames = [
    'Badminton Club',
    'Basketball Club',
    'Football Club',
    'Volleyball Club',
    'Tennis Club',
    'Swimming Club',
    'Running Club',
    'Cycling Club',
    'Yoga Club',
    'Chess Club',
  ];

  const presidents = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D',
    'Hoàng Văn E',
  ];

  const descriptions = [
    '<p>Câu lạc bộ chuyên về thể thao năng động</p>',
    '<p>Câu lạc bộ dành cho những người yêu thích thể dục</p>',
    '<p>Câu lạc bộ phát triển kỹ năng và thể chất</p>',
  ];

  const clubs: IClub[] = [];

  for (let i = 0; i < Math.min(count, clubNames.length); i++) {
    clubs.push({
      id: `club_${i + 1}`,
      name: clubNames[i],
      avatar: `https://via.placeholder.com/150?text=${clubNames[i]}`,
      foundedDate: dayjs().subtract(Math.random() * 5, 'years').format('YYYY-MM-DD'),
      description: descriptions[i % descriptions.length],
      president: presidents[i % presidents.length],
      isActive: Math.random() > 0.2,
    });
  }

  return clubs;
};

/**
 * Generate mock applications
 */
export const generateMockApplications = (count: number = 20): IApplication[] => {
  const firstNames = [
    'Phạm', 'Nguyễn', 'Trần', 'Lê', 'Hoàng', 'Võ', 'Tạ', 'Phan', 'Dương', 'Vũ',
  ];

  const lastNames = [
    'Quốc Anh', 'Hương', 'Tuấn', 'Linh', 'Minh', 'Hùng', 'Thảo', 'Hiệu', 'Khoa', 'Trang',
  ];

  const talents = [
    'Chạy bộ',
    'Bơi lội',
    'Bóng rổ',
    'Cầu lông',
    'Bóng đá',
    'Yoga',
    'Fitness',
    'Cờ vua',
    'Võ thuật',
    'Nhảy',
  ];

  const reasons = [
    'Yêu thích thể thao',
    'Muốn rèn luyện sức khỏe',
    'Tìm bạn cùng sở thích',
    'Phát triển kỹ năng',
    'Hoạt động xã hội',
  ];

  const applications: IApplication[] = [];
  const statuses: Array<'Pending' | 'Approved' | 'Rejected'> = ['Pending', 'Approved', 'Rejected'];

  for (let i = 0; i < count; i++) {
    const status = statuses[i % 3];
    applications.push({
      id: `app_${i + 1}`,
      fullName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `user${i + 1}@example.com`,
      phone: `0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')}`,
      gender: ['Male', 'Female', 'Other'][i % 3] as any,
      address: `Địa chỉ ${i + 1}, Thành phố`,
      talent: talents[i % talents.length],
      clubId: `club_${(i % 5) + 1}`,
      reason: reasons[i % reasons.length],
      status,
      rejectNote: status === 'Rejected' ? 'Không đủ điều kiện' : undefined,
      createdAt: dayjs().subtract(Math.random() * 30, 'days').format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return applications;
};

/**
 * Generate mock action histories
 */
export const generateMockActionHistories = (applicationId: string, count: number = 3): IActionHistory[] => {
  const actions: Array<'Pending' | 'Approved' | 'Rejected'> = ['Pending', 'Approved', 'Rejected'];
  const histories: IActionHistory[] = [];
  const actionUsers = ['Admin', 'Manager1', 'Manager2'];

  for (let i = 0; i < count; i++) {
    histories.push({
      id: `history_${i + 1}`,
      applicationId,
      actionBy: actionUsers[i % actionUsers.length],
      action: actions[i % actions.length],
      timestamp: dayjs().subtract(count - i, 'days').format('YYYY-MM-DD HH:mm:ss'),
      note: `Action ${i + 1} note`,
    });
  }

  return histories;
};

/**
 * Generate mock statistics
 */
export const generateMockStats = () => {
  const totalApplications = 100;
  const pendingCount = Math.floor(totalApplications * 0.3);
  const approvedCount = Math.floor(totalApplications * 0.6);
  const rejectedCount = totalApplications - pendingCount - approvedCount;

  return {
    totalClubs: 5,
    totalApplications,
    pendingCount,
    approvedCount,
    rejectedCount,
  };
};

/**
 * Generate mock chart data
 */
export const generateMockChartData = () => {
  const clubs = ['Badminton', 'Basketball', 'Football', 'Volleyball', 'Tennis'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  const chartData: any[] = [];

  clubs.forEach((club) => {
    statuses.forEach((status) => {
      chartData.push({
        clubName: club,
        status: status as any,
        count: Math.floor(Math.random() * 20) + 1,
      });
    });
  });

  return chartData;
};

/**
 * Shuffle array utility
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate random email
 */
export const generateEmail = (name: string): string => {
  const sanitized = name.toLowerCase().replace(/\s+/g, '.');
  const randomNum = Math.floor(Math.random() * 10000);
  return `${sanitized}.${randomNum}@example.com`;
};

/**
 * Generate random phone number (Vietnam)
 */
export const generatePhoneNumber = (): string => {
  const prefix = '0';
  const providers = [9, 8, 7, 6, 5];
  const provider = providers[Math.floor(Math.random() * providers.length)];
  const remaining = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, '0');
  return `${prefix}${provider}${remaining}`;
};
