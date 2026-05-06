export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  tags: string[];
}

const STORAGE_KEY = 'MY_KANBAN_TASKS';

export const getTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  
  const initialData: Task[] = [
    {
      id: 'task-1',
      title: 'Thiết kế giao diện Dashboard',
      description: 'Sử dụng Ant Design Card để làm thẻ thống kê.',
      deadline: '2026-05-15',
      priority: 'HIGH',
      status: 'DONE',
      tags: ['Design', 'UI/UX'],
    },
    {
      id: 'task-2',
      title: 'Tích hợp react-beautiful-dnd',
      description: 'Cài đặt và cấu hình DragDropContext, Droppable, Draggable.',
      deadline: '2026-05-20',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      tags: ['Frontend', 'Library'],
    },
    {
      id: 'task-3',
      title: 'Làm chức năng lọc Table',
      description: 'Lọc task theo trạng thái và độ ưu tiên trên trang Danh sách.',
      deadline: '2026-05-25',
      priority: 'MEDIUM',
      status: 'TODO',
      tags: ['Logic'],
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const PriorityConfig = {
  HIGH: { text: 'Cao', color: 'red' },
  MEDIUM: { text: 'Trung bình', color: 'orange' },
  LOW: { text: 'Thấp', color: 'green' },
};

export const StatusConfig = {
  TODO: { text: 'Cần làm', color: 'default' },
  IN_PROGRESS: { text: 'Đang làm', color: 'processing' },
  DONE: { text: 'Hoàn thành', color: 'success' },
};