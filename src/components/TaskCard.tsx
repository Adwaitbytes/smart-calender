
import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { Check, Trash } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { toggleTaskCompletion, deleteTask } = useAppContext();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  // Dynamic styles based on task category and completion status
  const cardClasses = `
    task-card ${task.category} 
    text-white 
    ${task.completed ? 'opacity-70' : ''} 
    backdrop-blur-sm
    shadow-lg
  `;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cardClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
      whileTap={{ scale: 0.98 }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold ${task.completed ? 'line-through opacity-80' : ''}`}>
          {task.title}
        </h3>
        <div className="flex space-x-1">
          <motion.button
            className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
            onClick={handleCheck}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check size={16} className={task.completed ? "text-green-300" : "text-white"} />
          </motion.button>
          <motion.button 
            className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
            onClick={handleDelete}
            aria-label="Delete task"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash size={16} />
          </motion.button>
        </div>
      </div>
      
      {task.description && (
        <p className={`text-sm text-white/90 ${task.completed ? 'line-through opacity-70' : ''} mb-2`}>
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full inline-block">
          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
        </span>
        
        {task.completed && (
          <span className="text-xs bg-green-500/30 text-white px-2 py-1 rounded-full inline-block">
            Completed
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
