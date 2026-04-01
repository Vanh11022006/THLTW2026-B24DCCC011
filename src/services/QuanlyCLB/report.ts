import axios from '@/utils/axios';
import type { IReportStats } from '@/pages/QuanlyCLB/types';

const API_BASE = '/api/reports';

/**
 * Get statistics and report data
 */
export async function getReportStats(): Promise<IReportStats> {
  return axios.get(`${API_BASE}/stats`);
}

/**
 * Get chart data for applications by club and status
 */
export async function getChartData() {
  return axios.get(`${API_BASE}/chart-data`);
}

/**
 * Export report data
 */
export async function exportReport(format: 'xlsx' | 'csv') {
  return axios.get(`${API_BASE}/export`, {
    params: { format },
    responseType: 'arraybuffer',
  });
}
