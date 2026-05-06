export interface Workout {
  id: string;
  date: string;
  name: string;
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
  duration: number; // phút
  calories: number;
  notes: string;
  status: 'COMPLETED' | 'MISSED';
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number; 
  height: number; 
  heartRate: number; 
  sleep: number; 
}

export interface Goal {
  id: string;
  name: string;
  type: 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

export interface Exercise {
  id: string;
  name: string;
  muscle: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  description: string;
  calPerHour: number;
}

export const mockWorkouts: Workout[] = [
  { id: '1', date: '2026-05-01', name: 'Chạy bộ công viên', type: 'Cardio', duration: 45, calories: 400, notes: 'Chạy tốc độ trung bình', status: 'COMPLETED' },
  { id: '2', date: '2026-05-03', name: 'Đẩy ngực ngang', type: 'Strength', duration: 60, calories: 350, notes: 'Đẩy 60kg, 4 hiệp', status: 'COMPLETED' },
  { id: '3', date: '2026-05-04', name: 'Yoga giãn cơ', type: 'Yoga', duration: 30, calories: 150, notes: 'Đau mỏi cơ nên tập nhẹ', status: 'COMPLETED' },
  { id: '4', date: '2026-05-05', name: 'HIIT đốt mỡ', type: 'HIIT', duration: 20, calories: 300, notes: 'Quá mệt, nghỉ sớm', status: 'MISSED' },
  { id: '5', date: '2026-05-06', name: 'Đạp xe trong nhà', type: 'Cardio', duration: 40, calories: 320, notes: 'Vừa đạp vừa xem phim', status: 'COMPLETED' },
];

export const mockHealthMetrics: HealthMetric[] = [
  { id: '1', date: '2026-05-01', weight: 75.5, height: 175, heartRate: 68, sleep: 7 },
  { id: '2', date: '2026-05-03', weight: 75.2, height: 175, heartRate: 65, sleep: 8 },
  { id: '3', date: '2026-05-06', weight: 74.8, height: 175, heartRate: 62, sleep: 7.5 },
];

export const mockGoals: Goal[] = [
  { id: '1', name: 'Giảm mỡ bụng', type: 'Giảm cân', targetValue: 70, currentValue: 74.8, deadline: '2026-08-01', status: 'Đang thực hiện' },
  { id: '2', name: 'Kéo xà 10 cái', type: 'Tăng cơ', targetValue: 10, currentValue: 4, deadline: '2026-06-15', status: 'Đang thực hiện' },
  { id: '3', name: 'Chạy 5km dưới 25 phút', type: 'Cải thiện sức bền', targetValue: 25, currentValue: 28, deadline: '2026-05-20', status: 'Đã đạt' },
];

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Push Up (Hít đất)', muscle: 'Chest', difficulty: 'Trung bình', description: 'Bài tập kinh điển phát triển ngực, vai và tay sau.', calPerHour: 400 },
  { id: '2', name: 'Squat (Gánh đùi)', muscle: 'Legs', difficulty: 'Dễ', description: 'Phát triển toàn diện thân dưới, đặc biệt là đùi trước.', calPerHour: 500 },
  { id: '3', name: 'Plank', muscle: 'Core', difficulty: 'Trung bình', description: 'Gồng chặt cơ bụng, giữ lưng thẳng, giúp lõi khỏe.', calPerHour: 300 },
  { id: '4', name: 'Pull Up (Kéo xà)', muscle: 'Back', difficulty: 'Khó', description: 'Phát triển cơ xô và lưng giữa, đòi hỏi sức mạnh.', calPerHour: 450 },
  { id: '5', name: 'Jumping Jacks', muscle: 'Full Body', difficulty: 'Dễ', description: 'Bài tập khởi động làm nóng toàn thân rất tốt.', calPerHour: 600 },
];

export const calculateBMI = (weight: number, heightCm: number) => {
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

export const getBMITag = (bmiValue: number) => {
  if (bmiValue < 18.5) return { color: 'blue', text: 'Thiếu cân' };
  if (bmiValue >= 18.5 && bmiValue <= 24.9) return { color: 'green', text: 'Bình thường' };
  if (bmiValue >= 25 && bmiValue <= 29.9) return { color: 'orange', text: 'Thừa cân' };
  return { color: 'red', text: 'Béo phì' };
};