/**
 * Modern loading spinner with gradient animation.
 */
import { motion } from 'framer-motion';

export default function LoadingSpinner({
    size = 'md',
    className = '',
    text = '',
}) {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-4',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <motion.div
                className={`
          ${sizes[size]}
          rounded-full
          border-primary-500/20
          border-t-primary-500
          animate-spin
        `}
                style={{
                    borderTopColor: '#8B5CF6',
                }}
            />
            {text && (
                <motion.p
                    className="text-white/60 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

// Full page loading state
export function LoadingScreen({ text = 'Loading...' }) {
    return (
        <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
            <div className="text-center">
                <motion.div
                    className="w-20 h-20 rounded-full border-4 border-primary-500/20 border-t-primary-500 mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <motion.p
                    className="text-white/70 text-lg font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {text}
                </motion.p>
            </div>
        </div>
    );
}

// Skeleton loader for content
export function Skeleton({ className = '', variant = 'text' }) {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-8 rounded-lg',
        card: 'h-48 rounded-2xl',
        circle: 'w-12 h-12 rounded-full',
        avatar: 'w-10 h-10 rounded-full',
    };

    return (
        <motion.div
            className={`
        bg-white/5 animate-pulse
        ${variants[variant]}
        ${className}
      `}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );
}
