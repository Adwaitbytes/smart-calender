
export type TaskCategory = 'work' | 'personal' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  day: string; // 'sunday', 'monday', etc.
  completed: boolean;
  createdAt: string;
}

export interface Day {
  id: string;
  name: string;
  fullName: string;
  tasks: Task[];
}

export interface AppContext {
  days: Day[];
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newDay: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
}
