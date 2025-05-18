
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  
  // Initialize theme from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (prefersDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <motion.button
      className={`relative flex items-center justify-center w-14 h-7 rounded-full p-1 transition-colors ${
        isDark ? 'bg-slate-700' : 'bg-sky-200'
      }`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
      
      {/* Track icons */}
      <span className={`absolute left-2 text-yellow-300 ${isDark ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        ☀️
      </span>
      <span className={`absolute right-2 text-indigo-200 ${isDark ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        🌙
      </span>
      
      {/* Moving handle */}
      <motion.div
        className={`w-5 h-5 rounded-full ${isDark ? 'bg-indigo-200' : 'bg-yellow-300'}`}
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
