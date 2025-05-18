
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCharacterProps {
  onTaskCompleted?: boolean;
  onTaskCreated?: boolean;
}

const FloatingCharacter = ({ onTaskCompleted, onTaskCreated }: FloatingCharacterProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [characterState, setCharacterState] = useState<'idle' | 'excited' | 'happy'>('idle');
  
  useEffect(() => {
    if (onTaskCompleted) {
      const messages = [
        "Great job! 🎉",
        "Task completed! ✨",
        "Progress feels good! 👍",
        "You're on a roll! 🔥"
      ];
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setCharacterState('happy');
      const timer = setTimeout(() => {
        setMessage(null);
        setCharacterState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (onTaskCreated) {
      const messages = [
        "New task added! 📝",
        "Planning ahead! 📅",
        "Great organization! 🌟",
        "Let's get it done! 💪"
      ];
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setCharacterState('excited');
      const timer = setTimeout(() => {
        setMessage(null);
        setCharacterState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onTaskCompleted, onTaskCreated]);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-10 pointer-events-none">
      <motion.div
        className="w-20 h-20 sm:w-28 sm:h-28"
        animate={{ 
          y: [0, -8, 0],
          rotate: characterState === 'excited' ? [0, -5, 5, -5, 0] : 0
        }}
        transition={{ 
          y: {
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          },
          rotate: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{
            scale: characterState === 'happy' ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: 0.5
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
            alt="Floating character"
            className="w-full h-full object-contain rounded-full shadow-lg"
          />
          
          {/* Glow effect when active */}
          <AnimatePresence>
            {(characterState !== 'idle') && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  characterState === 'happy' ? 'bg-primary/20' : 'bg-secondary/20'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {message && (
            <motion.div
              className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-xl whitespace-nowrap border border-white/20 dark:border-white/10"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
            >
              <div className="text-sm font-medium">{message}</div>
              <div className="absolute w-4 h-4 bg-white/90 dark:bg-slate-800/90 transform rotate-45 left-1/2 -ml-2 -bottom-2 border-r border-b border-white/20 dark:border-white/10"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FloatingCharacter;
