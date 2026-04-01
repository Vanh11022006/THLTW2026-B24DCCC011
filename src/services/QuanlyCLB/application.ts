import axios from '@/utils/axios';
import type { IApplication, IActionHistory, ApplicationStatus } from '@/pages/QuanlyCLB/types';

const API_BASE = '/api/applications';
const HISTORY_BASE = '/api/action-histories';

/**
 * Get paginated list of applications
 */
export async function getApplications(params: {
  page: number;
  limit: number;
  status?: ApplicationStatus;
  clubId?: string;
  keyword?: string;
  sort?: any;
}) {
  return axios.get(`${API_BASE}/page`, { params });
}

/**
 * Get application by ID
 */
export async function getApplicationById(id: string) {
  return axios.get(`${API_BASE}/${id}`);
}

/**
 * Create new application
 */
export async function createApplication(payload: Omit<IApplication, 'id' | 'createdAt'>) {
  return axios.post(`${API_BASE}`, payload);
}

/**
 * Update application
 */
export async function updateApplication(id: string, payload: Partial<IApplication>) {
  return axios.put(`${API_BASE}/${id}`, payload);
}

/**
 * Delete application
 */
export async function deleteApplication(id: string) {
  return axios.delete(`${API_BASE}/${id}`);
}

/**
 * Approve single application
 */
export async function approveApplication(id: string, actionBy: string) {
  return axios.put(`${API_BASE}/${id}/approve`, { actionBy });
}

/**
 * Reject single application
 */
export async function rejectApplication(
  id: string,
  payload: { actionBy: string; rejectNote: string }
) {
  return axios.put(`${API_BASE}/${id}/reject`, payload);
}

/**
 * Approve multiple applications
 */
export async function approveMultipleApplications(
  ids: string[],
  actionBy: string
) {
  return axios.post(`${API_BASE}/bulk/approve`, { ids, actionBy });
}

/**
 * Reject multiple applications
 */
export async function rejectMultipleApplications(
  ids: string[],
  payload: { actionBy: string; rejectNote: string }
) {
  return axios.post(`${API_BASE}/bulk/reject`, { ids, ...payload });
}

/**
 * Get action history for an application
 */
export async function getActionHistory(
  applicationId: string,
  params: {
    page: number;
    limit: number;
  }
) {
  return axios.get(`${HISTORY_BASE}/application/${applicationId}`, { params });
}

/**
 * Create action history record
 */
export async function createActionHistory(payload: Omit<IActionHistory, 'id'>) {
  return axios.post(`${HISTORY_BASE}`, payload);
}

/**
 * Change club for members
 */
export async function changeClubForMembers(payload: {
  memberIds: string[];
  newClubId: string;
  modifiedBy: string;
}) {
  return axios.post(`${API_BASE}/bulk/change-club`, payload);
}

/**
 * Get approved members only
 */
export async function getApprovedMembers(params: {
  page: number;
  limit: number;
  clubId?: string;
  keyword?: string;
  sort?: any;
}) {
  return axios.get(`${API_BASE}/approved`, { params });
}
