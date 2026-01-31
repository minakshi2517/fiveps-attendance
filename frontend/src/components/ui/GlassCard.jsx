/**
 * Glassmorphism card component with hover effects.
 */
import { motion } from 'framer-motion';
import { cardHover, tapScale } from '../../utils/animations';

export default function GlassCard({
    children,
    className = '',
    hover = true,
    onClick,
    padding = 'p-6',
}) {
    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            className={`
        glass-card
        ${padding}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            whileHover={hover ? cardHover : undefined}
            whileTap={onClick ? tapScale : undefined}
            onClick={onClick}
        >
            {children}
        </Component>
    );
}
