/**
 * Framer Motion animation variants for consistent animations across the app.
 */

// Page transition variants
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Fade in animation
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
};

// Slide up animation
export const slideUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
    },
};

// Slide down animation
export const slideDown = {
    initial: { opacity: 0, y: -30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Scale in animation
export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 },
    },
};

// Stagger children animation
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerFast = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05,
        },
    },
};

// Stagger item animation
export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Hover scale effect
export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 },
};

export const hoverScaleLarge = {
    scale: 1.05,
    transition: { duration: 0.2 },
};

// Tap effect
export const tapScale = {
    scale: 0.98,
};

// Card hover animation
export const cardHover = {
    y: -8,
    transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
    },
};

// Button hover animation
export const buttonHover = {
    y: -2,
    boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
    transition: { duration: 0.2 },
};

// Navbar animation
export const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Mobile menu animation
export const mobileMenuVariants = {
    closed: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    open: {
        opacity: 1,
        height: 'auto',
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

// Modal animation
export const modalOverlay = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
};

export const modalContent = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 },
    },
};

// Stats counter animation
export const counterAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

// Pulse glow effect
export const pulseGlow = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.2)',
            '0 0 40px rgba(139, 92, 246, 0.4)',
            '0 0 20px rgba(139, 92, 246, 0.2)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Float animation
export const floatAnimation = {
    animate: {
        y: [0, -20, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Rotate animation for icons
export const spinAnimation = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// Success checkmark animation
export const checkmarkPath = {
    initial: { pathLength: 0 },
    animate: {
        pathLength: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Error X animation
export const errorPath = {
    initial: { pathLength: 0 },
    animate: {
        pathLength: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};
