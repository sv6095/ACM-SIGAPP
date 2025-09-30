import { useInView, useAnimation, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Enhanced scroll animation hook with better UX
export const useScrollAnimation = (options: {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  distance?: number;
} = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    duration = 0.6,
    stagger = 0.1,
    direction = 'up',
    distance = 50
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold, 
    once: triggerOnce,
    margin: "-50px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  const getInitialVariant = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, scale: 0.95 };
      case 'down':
        return { opacity: 0, y: -distance, scale: 0.95 };
      case 'left':
        return { opacity: 0, x: distance, scale: 0.95 };
      case 'right':
        return { opacity: 0, x: -distance, scale: 0.95 };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  const getVisibleVariant = () => {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        stagger,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
      }
    };
  };

  const variants = {
    hidden: getInitialVariant(),
    visible: getVisibleVariant()
  };

  return { ref, controls, variants, isInView };
};

// Parallax scroll hook for depth effects
export const useParallax = (offset: number = 50) => {
  const y = useMotionValue(0);
  const ySpring = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const yTransform = useTransform(ySpring, [-300, 300], [offset, -offset]);

  return { y, yTransform };
};


// Staggered reveal hook for multiple elements
export const useStaggeredReveal = (staggerDelay: number = 0.1) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return { containerVariants, itemVariants };
};

// Magnetic effect hook for interactive elements
export const useMagnetic = (strength: number = 0.3) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (event.clientX - centerX) * strength;
    const distanceY = (event.clientY - centerY) * strength;
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    x: xSpring,
    y: ySpring,
    handleMouseMove,
    handleMouseLeave
  };
};
