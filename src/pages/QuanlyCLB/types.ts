export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export type Gender = 'Male' | 'Female' | 'Other';

export interface IClub {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string;
  president: string;
  isActive: boolean;
}

export interface IApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  talent: string;
  clubId: string;
  reason: string;
  status: ApplicationStatus;
  rejectNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IActionHistory {
  id: string;
  applicationId: string;
  actionBy: string;
  action: ApplicationStatus;
  timestamp: string;
  note?: string;
}

export interface IReportChartData {
  clubName: string;
  status: ApplicationStatus;
  count: number;
}

export interface IReportStats {
  totalClubs: number;
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  chartData: IReportChartData[];
}

export interface IClubMember extends IApplication {
  // Inherited from IApplication but only includes Approved members
}