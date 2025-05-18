
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Day, AppContext as AppContextType } from '../types';
import { toast } from '@/components/ui/sonner';

const defaultDays: Day[] = [
  { id: 'sunday', name: 'Sun', fullName: 'Sunday', tasks: [] },
  { id: 'monday', name: 'Mon', fullName: 'Monday', tasks: [] },
  { id: 'tuesday', name: 'Tue', fullName: 'Tuesday', tasks: [] },
  { id: 'wednesday', name: 'Wed', fullName: 'Wednesday', tasks: [] },
  { id: 'thursday', name: 'Thu', fullName: 'Thursday', tasks: [] },
  { id: 'friday', name: 'Fri', fullName: 'Friday', tasks: [] },
  { id: 'saturday', name: 'Sat', fullName: 'Saturday', tasks: [] },
];

// Example tasks for demonstration
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Design meeting',
    description: 'Discuss new project wireframes',
    category: 'work',
    day: 'monday',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Grocery shopping',
    description: 'Buy fruits, vegetables and milk',
    category: 'personal',
    day: 'tuesday',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Project deadline',
    description: 'Submit final deliverables',
    category: 'urgent',
    day: 'wednesday',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Team sync',
    description: 'Weekly progress update',
    category: 'work',
    day: 'thursday',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Create context with default values
const AppContext = createContext<AppContextType>({
  days: defaultDays,
  tasks: defaultTasks,
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  moveTask: () => {},
  toggleTaskCompletion: () => {}
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  // Create days structure with tasks
  const days = defaultDays.map(day => ({
    ...day,
    tasks: tasks.filter(task => task.day === day.id)
  }));

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Task added successfully!');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    toast.success('Task updated!');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('Task deleted!');
  };

  const moveTask = (taskId: string, newDay: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, day: newDay } : task
      )
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <AppContext.Provider value={{
      days,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleTaskCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
