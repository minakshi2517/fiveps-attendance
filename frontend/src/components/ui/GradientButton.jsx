/**
 * Gradient button component with multiple variants.
 */
import { motion } from 'framer-motion';
import { buttonHover, tapScale } from '../../utils/animations';
import { Loader2 } from 'lucide-react';

export default function GradientButton({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    onClick,
    type = 'button',
}) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        gradient: 'btn-gradient',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-red-500/30',
        success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
    };

    return (
        <motion.button
            type={type}
            className={`
        btn
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center gap-2
        ${className}
      `}
            whileHover={!disabled && !loading ? buttonHover : undefined}
            whileTap={!disabled && !loading ? tapScale : undefined}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
                </>
            )}
        </motion.button>
    );
}
