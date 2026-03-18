export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number; 
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  dailyLimit: number;
  workSchedule: {
    start: string; 
    end: string;   
    workingDays: number[];
  };
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  employeeId: string;
  date: string; 
  startTime: string; 
  endTime: string; 
  status: AppointmentStatus;
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  employeeId: string;
  customerName: string;
  rating: number; 
  comment: string;
  createdAt: string;
  staffReply?: string;
  staffReplyAt?: string;
}

export interface DailyBookingCount {
  employeeId: string;
  date: string;
  count: number;
}