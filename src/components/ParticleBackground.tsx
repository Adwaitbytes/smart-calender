
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const ParticleBackground = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const { left, top } = backgroundRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - left,
          y: e.clientY - top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Generate particles
  const particles = useMemo(() => {
    const particleCount = Math.min(50, Math.max(25, Math.floor(dimensions.width / 50)));
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Percentage position
      y: Math.random() * 100,
      size: Math.random() * 8 + 2, // Size between 2 and 10
      opacity: Math.random() * 0.5 + 0.2, // Opacity between 0.2 and 0.7
      duration: Math.random() * 25 + 20, // Animation duration
      delay: Math.random() * 15, // Animation delay
    }));
  }, [dimensions]);

  const getBackgroundStyle = () => {
    // Calculate parallax effect based on mouse position
    const moveX = mousePosition.x / dimensions.width * 30; // max 30px movement
    const moveY = mousePosition.y / dimensions.height * 30; // max 30px movement
    
    return {
      backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.2) 0%, transparent 70%), radial-gradient(circle at 80% 60%, hsl(var(--secondary) / 0.2) 0%, transparent 60%), radial-gradient(circle at 50% 90%, hsl(var(--accent) / 0.15) 0%, transparent 50%)',
      backgroundPosition: `calc(30% + ${moveX * 0.3}px) calc(30% + ${moveY * 0.3}px), calc(80% - ${moveX * 0.2}px) calc(60% - ${moveY * 0.2}px), calc(50% + ${moveX * 0.1}px) calc(90% + ${moveY * 0.1}px)`
    };
  };

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 -z-10 overflow-hidden w-full h-full"
      style={getBackgroundStyle()}
    >
      {/* Moving gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.12) 0%, transparent 70%), radial-gradient(circle at 20% 20%, hsl(var(--secondary) / 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          x: mousePosition.x / dimensions.width * 40 - 20, // -20px to +20px range
          y: mousePosition.y / dimensions.height * 40 - 20, // -20px to +20px range
        }}
        transition={{
          x: { duration: 0.8, ease: "easeOut" },
          y: { duration: 0.8, ease: "easeOut" },
          scale: {
            repeat: Infinity,
            duration: 30,
            ease: "easeInOut"
          }
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
      />
      
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`
            absolute rounded-full backdrop-blur-[1px]
            ${Math.random() > 0.5 ? 'bg-primary/30' : 'bg-secondary/30'}
            ${Math.random() > 0.7 ? 'bg-accent/30' : ''}
          `}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            x: mousePosition.x / dimensions.width * 20 * (Math.random() - 0.5), // subtle random movement
            y: mousePosition.y / dimensions.height * 20 * (Math.random() - 0.5), // subtle random movement
          }}
          transition={{
            x: { duration: 0.5, ease: "easeOut" },
            y: { duration: 0.5, ease: "easeOut" },
            scale: {
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: {
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, particle.opacity, 0],
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
