import { useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  return { ref, isInView };
};

// Animation Variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const textReveal: Variants = {
  hidden: { 
    opacity: 0,
    y: 100,
    skewY: 7
  },
  visible: { 
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const lineReveal: Variants = {
  hidden: { 
    scaleX: 0,
    originX: 0
  },
  visible: { 
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const imageReveal: Variants = {
  hidden: { 
    clipPath: 'inset(0 100% 0 0)'
  },
  visible: { 
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
