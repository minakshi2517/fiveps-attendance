/**
 * Admin login modal with glassmorphism.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { modalOverlay, modalContent } from '../utils/animations';
import { GradientButton } from './ui';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin({ isOpen, onClose, onSuccess }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(password);
            if (success) {
                onSuccess?.();
                setPassword('');
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    className="modal-content max-w-md p-8"
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

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Admin Access
                        </h2>
                        <p className="text-white/50">
                            Enter your admin password to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <Lock className="w-5 h-5 text-purple-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input w-full pl-12 pr-12 py-3"
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <GradientButton
                            type="submit"
                            variant="gradient"
                            size="lg"
                            loading={isLoading}
                            disabled={!password}
                            className="w-full"
                        >
                            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
                        </GradientButton>
                    </form>

                    <p className="mt-6 text-center text-xs text-white/30">
                        Default password: 786
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
