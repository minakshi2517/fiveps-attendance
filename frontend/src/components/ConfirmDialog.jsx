/**
 * Confirm dialog with glassmorphism design.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { modalOverlay, modalContent } from '../utils/animations';
import { GradientButton } from './ui';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger', // danger, warning, primary
    loading = false,
}) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'bg-red-500/20',
            iconColor: 'text-red-400',
            button: 'danger',
        },
        warning: {
            icon: 'bg-amber-500/20',
            iconColor: 'text-amber-400',
            button: 'secondary',
        },
        primary: {
            icon: 'bg-primary-500/20',
            iconColor: 'text-primary-400',
            button: 'primary',
        },
    };

    const style = variantStyles[variant] || variantStyles.danger;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                variants={modalOverlay}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={onClose}
            >
                <motion.div
                    className="modal-content max-w-md p-6"
                    variants={modalContent}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${style.icon} flex items-center justify-center mb-4`}>
                        <AlertTriangle className={`w-7 h-7 ${style.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-white/60 mb-6">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <GradientButton
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            {cancelText}
                        </GradientButton>
                        <GradientButton
                            variant={style.button}
                            onClick={onConfirm}
                            loading={loading}
                            className="flex-1"
                        >
                            {confirmText}
                        </GradientButton>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
