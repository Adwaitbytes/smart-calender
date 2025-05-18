
import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Day } from '../types';

interface CalendarColumnProps {
  day: Day;
  onTaskClick: (taskId: string) => void;
}

const CalendarColumn = ({ day, onTaskClick }: CalendarColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
    data: {
      day: day.id
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Determine if today's column
  const isToday = day.fullName === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        className={`text-center mb-3 font-satoshi ${isToday ? 'relative' : ''}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={`font-bold text-xl ${isToday ? 'text-primary' : ''}`}>{day.fullName}</h2>
        {isToday && (
          <motion.div 
            className="absolute -bottom-2 left-0 right-0 mx-auto w-16 h-1 bg-primary rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 16, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        )}
      </motion.div>

      <motion.div
        ref={setNodeRef}
        className={`flex-1 glass-card rounded-xl p-4 overflow-y-auto flex flex-col gap-3 min-h-[400px] md:min-h-[500px]
          ${isOver ? 'ring-2 ring-primary/50 bg-white/40 dark:bg-white/10' : ''}
          ${isToday ? 'border-primary/30 shadow-lg shadow-primary/5' : ''}
          transition-all duration-300
        `}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        {day.tasks.length > 0 ? (
          day.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={itemVariants}
              transition={{ delay: index * 0.03 }}
            >
              <TaskCard
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center text-muted-foreground flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="opacity-60">No tasks yet</p>
            <p className="text-sm opacity-40">Drag tasks here or create a new one</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CalendarColumn;
