
import React, { useState } from 'react';
import { DndContext, useSensors, useSensor, PointerSensor, KeyboardSensor, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CalendarColumn from '@/components/CalendarColumn';
import AddTaskModal from '@/components/AddTaskModal';
import ThemeToggle from '@/components/ThemeToggle';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingCharacter from '@/components/FloatingCharacter';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Task } from '@/types';

const Index = () => {
  const { days, tasks, moveTask } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const newDay = over.id.toString();
      
      moveTask(taskId, newDay);
    }
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsAddModalOpen(true);
    }
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setSelectedTask(null);
  };

  // Trigger character animations
  const showTaskCompleted = () => {
    setTaskCompleted(true);
    setTimeout(() => setTaskCompleted(false), 100);
  };

  const showTaskCreated = () => {
    setTaskCreated(true);
    setTimeout(() => setTaskCreated(false), 100);
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <ParticleBackground />
      
      <header className="pt-8 pb-6 px-4 md:px-8 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-5xl font-satoshi font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Weekly Planner
            </h1>
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      <main className="px-4 md:px-8 pb-20 relative z-10">
        <motion.div 
          className="container max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 dark:border-white/10"
            transition={{ duration: 0.5 }}
          >
            <DndContext 
              sensors={sensors} 
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <AnimatePresence>
                  {days.map((day, index) => (
                    <motion.div
                      key={day.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CalendarColumn
                        day={day} 
                        onTaskClick={handleTaskClick} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </DndContext>
          </motion.div>

          <motion.div 
            className="mt-8 flex justify-center"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={handleAddNewTask} 
              className="group rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={22} />
              Add New Task
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={handleModalClose} 
        taskToEdit={selectedTask}
        initialDay={days[new Date().getDay()].id}
      />

      <FloatingCharacter 
        onTaskCompleted={taskCompleted} 
        onTaskCreated={taskCreated} 
      />
    </div>
  );
};

export default Index;
