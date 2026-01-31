/**
 * Student edit modal with glassmorphism design.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, CreditCard, Save, Loader2 } from 'lucide-react';
import { modalOverlay, modalContent } from '../utils/animations';
import { GradientButton } from './ui';
import { studentsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function StudentEditModal({ student, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: student?.name || '',
        enrollment_id: student?.enrollment_id || '',
        email: student?.email || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.enrollment_id.trim()) newErrors.enrollment_id = 'Enrollment ID is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await studentsAPI.update(student.id, formData);
            toast.success('Student updated successfully');
            onSuccess?.();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update student');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-white">
                                {student?.name?.charAt(0) || 'S'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Edit Student</h2>
                        <p className="text-white/50">Update student information</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`glass-input w-full pl-12 py-3 ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter full name"
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Enrollment ID *
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    name="enrollment_id"
                                    value={formData.enrollment_id}
                                    onChange={handleInputChange}
                                    className={`glass-input w-full pl-12 py-3 ${errors.enrollment_id ? 'border-red-500' : ''}`}
                                    placeholder="Enter enrollment ID"
                                />
                            </div>
                            {errors.enrollment_id && <p className="text-red-400 text-sm mt-1">{errors.enrollment_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Email (Optional)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="glass-input w-full pl-12 py-3"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <GradientButton
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </GradientButton>
                            <GradientButton
                                type="submit"
                                variant="gradient"
                                loading={isSubmitting}
                                icon={Save}
                                className="flex-1"
                            >
                                Save Changes
                            </GradientButton>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
