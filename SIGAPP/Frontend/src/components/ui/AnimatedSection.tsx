"use client";

import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredReveal } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

export const AnimatedSection = ({
  children,
  className = "",
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  stagger = false,
  staggerDelay = 0.1
}: AnimatedSectionProps) => {
  const { ref, controls, variants } = useScrollAnimation({
    direction,
    delay,
    duration,
    distance
  });

  const { containerVariants, itemVariants } = useStaggeredReveal(staggerDelay);

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

// Animated text component with typewriter effect
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'typewriter';
}

export const AnimatedText = ({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  type = 'fade'
}: AnimatedTextProps) => {
  const { ref, controls, variants } = useScrollAnimation({
    direction: 'fade',
    delay,
    duration
  });

  const getTextVariants = () => {
    switch (type) {
      case 'typewriter':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: text.length * 0.05,
              ease: "easeInOut"
            }
          }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay }
          }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay }
          }
        };
      default:
        return variants;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getTextVariants()}
      initial="hidden"
      animate={controls}
    >
      {text}
    </motion.div>
  );
};

// Animated card component with hover effects
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  magnetic?: boolean;
  delay?: number;
}

export const AnimatedCard = ({
  children,
  className = "",
  hover = true,
  magnetic = false,
  delay = 0
}: AnimatedCardProps) => {
  const { ref, controls, variants } = useScrollAnimation({
    direction: 'up',
    delay,
    distance: 30
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
      whileHover={hover ? {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : undefined}
      whileTap={{ scale: 0.98 }}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
};
