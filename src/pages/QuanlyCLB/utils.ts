import { APPLICATION_STATUS_MAP, APPLICATION_STATUS_COLOR, GENDER_MAP } from './constants';
import type { ApplicationStatus, Gender } from './types';

/**
 * Convert status to Vietnamese label
 */
export const getStatusLabel = (status: ApplicationStatus): string => {
  return APPLICATION_STATUS_MAP[status] || status;
};

/**
 * Get status color for badge/tag
 */
export const getStatusColor = (status: ApplicationStatus): string => {
  return APPLICATION_STATUS_COLOR[status] || 'default';
};

/**
 * Convert gender to Vietnamese label
 */
export const getGenderLabel = (gender: Gender): string => {
  return GENDER_MAP[gender] || gender;
};

/**
 * Format currency for Vietnamese Dong
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(1);
};

/**
 * Check if application can be approved/rejected
 */
export const canApproveOrReject = (status: ApplicationStatus): boolean => {
  return status === 'Pending';
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format (Vietnamese)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format date range for display
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${startDate} - ${endDate}`;
};

/**
 * Get application status statistics
 */
export interface StatusStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export const calculateStatusStats = (applications: any[]): StatusStats => {
  const stats: StatusStats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: applications.length,
  };

  applications.forEach((app) => {
    switch (app.status) {
      case 'Pending':
        stats.pending++;
        break;
      case 'Approved':
        stats.approved++;
        break;
      case 'Rejected':
        stats.rejected++;
        break;
      default:
        break;
    }
  });

  return stats;
};

/**
 * Transform chart data
 */
export const transformChartData = (data: any[]) => {
  return data.map((item) => ({
    ...item,
    statusLabel:
      item.status === 'Pending'
        ? 'Chờ duyệt'
        : item.status === 'Approved'
          ? 'Đã duyệt'
          : 'Từ chối',
  }));
};

/**
 * Download file
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
