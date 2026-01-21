import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedHeading({ children, className = '', delay = 0 }: AnimatedTextProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: 100, opacity: 0, skewY: 3 }}
        whileInView={{ y: 0, opacity: 1, skewY: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.22, 1, 0.36, 1] 
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function AnimatedParagraph({ children, className = '', delay = 0 }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedBadge({ children, className = '', delay = 0 }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedLineProps {
  className?: string;
  delay?: number;
}

export function AnimatedLine({ className = '', delay = 0 }: AnimatedLineProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`h-1 bg-primary ${className}`}
    />
  );
}
