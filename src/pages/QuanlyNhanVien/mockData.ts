import type { Service, Employee, Appointment } from './types';

export const mockServices: Service[] = [
  { id: 's1', name: 'Cắt tóc nam', price: 100000, durationMinutes: 30 },
  { id: 's2', name: 'Gội đầu massage', price: 150000, durationMinutes: 60 },
  { id: 's3', name: 'Nhuộm tóc', price: 250000, durationMinutes: 90 },
];

export const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'a@example.com',
    dailyLimit: 10,
    workSchedule: { start: '09:00', end: '17:00', workingDays: [0, 1, 2, 3, 4] },
    averageRating: 4.8,
    totalReviews: 25,
    createdAt: '2026-01-15',
  },
  {
    id: 'e2',
    name: 'Trần Thị B',
    phone: '0902345678',
    email: 'b@example.com',
    dailyLimit: 8,
    workSchedule: { start: '10:00', end: '18:00', workingDays: [0, 2, 3, 4, 5] },
    averageRating: 4.5,
    totalReviews: 18,
    createdAt: '2026-02-20',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'Trần B',
    customerPhone: '0901234567',
    customerEmail: 'b@example.com',
    serviceId: 's1',
    employeeId: 'e1',
    date: '2026-03-20',
    startTime: '10:00',
    endTime: '10:30',
    status: 'PENDING',
    totalPrice: 100000,
    createdAt: '2026-03-18',
  },
  {
    id: '2',
    customerName: 'Lê C',
    customerPhone: '0909888777',
    customerEmail: 'c@example.com',
    serviceId: 's2',
    employeeId: 'e1',
    date: '2026-03-20',
    startTime: '14:00',
    endTime: '15:00',
    status: 'CONFIRMED',
    totalPrice: 150000,
    createdAt: '2026-03-18',
  },
];
