// Types for Study Tracker Application

export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in minutes
  content: string;
  notes: string;
  createdAt: number;
}

export interface MonthlyGoal {
  id: string;
  subjectId?: string; // undefined means total goal
  month: string; // YYYY-MM
  targetHours: number;
  createdAt: number;
}

export interface StudyData {
  subjects: Subject[];
  sessions: StudySession[];
  monthlyGoals: MonthlyGoal[];
}
