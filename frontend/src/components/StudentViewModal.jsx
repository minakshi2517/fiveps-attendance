/**
 * Student view modal with glassmorphism design.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, CreditCard, Calendar, Hash, Camera } from 'lucide-react';
import { modalOverlay, modalContent } from '../utils/animations';
import { GradientButton } from './ui';

export default function StudentViewModal({ student, onClose }) {
    if (!student) return null;

    const infoItems = [
        { icon: User, label: 'Name', value: student.name },
        { icon: CreditCard, label: 'Enrollment ID', value: student.enrollment_id },
        { icon: Mail, label: 'Email', value: student.email || 'Not provided' },
        { icon: Hash, label: 'Student ID', value: `#${student.id}` },
        {
            icon: Calendar, label: 'Registered', value: student.created_at
                ? new Date(student.created_at).toLocaleDateString()
                : 'Unknown'
        },
        { icon: Camera, label: 'Face Encoding', value: student.face_encoding ? 'Registered' : 'Not set' },
    ];

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
                    className="modal-content max-w-lg p-8"
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
                        <motion.div
                            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <span className="text-3xl font-bold text-white">
                                {student.name?.charAt(0) || 'S'}
                            </span>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-1">{student.name}</h2>
                        <p className="text-white/50">{student.enrollment_id}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {infoItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="p-4 bg-white/5 rounded-xl"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <item.icon className="w-4 h-4 text-primary-400" />
                                    <span className="text-xs text-white/50">{item.label}</span>
                                </div>
                                <p className="text-sm font-medium text-white truncate">
                                    {item.value}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Close Button */}
                    <GradientButton
                        variant="secondary"
                        onClick={onClose}
                        className="w-full"
                    >
                        Close
                    </GradientButton>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
