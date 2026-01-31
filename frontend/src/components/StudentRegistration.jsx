/**
 * Student registration form with glassmorphism design.
 */
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import {
    X, Camera, User, Mail, CreditCard, Image, Trash2,
    Check, AlertCircle, Upload, Loader2
} from 'lucide-react';
import { GlassCard, GradientButton } from './ui';
import { staggerContainer, staggerItem } from '../utils/animations';
import { studentsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function StudentRegistration({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        enrollment_id: '',
        email: '',
    });
    const [capturedImages, setCapturedImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: 'user',
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc && capturedImages.length < 5) {
            setCapturedImages(prev => [...prev, imageSrc]);
            toast.success(`Photo ${capturedImages.length + 1} captured!`);
        }
    }, [capturedImages.length]);

    const removeImage = (index) => {
        setCapturedImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.enrollment_id.trim()) {
            newErrors.enrollment_id = 'Enrollment ID is required';
        }
        if (capturedImages.length === 0) {
            newErrors.images = 'At least one photo is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name.trim());
            formDataObj.append('enrollment_id', formData.enrollment_id.trim());
            if (formData.email) {
                formDataObj.append('email', formData.email.trim());
            }

            // Convert base64 images to blobs and append
            for (let i = 0; i < capturedImages.length; i++) {
                const response = await fetch(capturedImages[i]);
                const blob = await response.blob();
                formDataObj.append('images', blob, `photo_${i}.jpg`);
            }

            await studentsAPI.register(formDataObj);
            toast.success('Student registered successfully!');
            onSuccess?.();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlassCard className="relative" hover={false}>
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Register New Student</h2>
                        <p className="text-white/50">Add a new student to the system</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <motion.div variants={staggerItem}>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Full Name *
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <User className="w-5 h-5 text-white/40" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`glass-input w-full pl-12 py-3 ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Enter full name"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                        )}
                    </motion.div>

                    <motion.div variants={staggerItem}>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Enrollment ID *
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <CreditCard className="w-5 h-5 text-white/40" />
                            </div>
                            <input
                                type="text"
                                name="enrollment_id"
                                value={formData.enrollment_id}
                                onChange={handleInputChange}
                                className={`glass-input w-full pl-12 py-3 ${errors.enrollment_id ? 'border-red-500' : ''}`}
                                placeholder="Enter enrollment ID"
                            />
                        </div>
                        {errors.enrollment_id && (
                            <p className="text-red-400 text-sm mt-1">{errors.enrollment_id}</p>
                        )}
                    </motion.div>

                    <motion.div variants={staggerItem} className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Email (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Mail className="w-5 h-5 text-white/40" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="glass-input w-full pl-12 py-3"
                                placeholder="Enter email address"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Photo Capture Section */}
                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Face Photos</h3>
                            <p className="text-sm text-white/50">Capture 1-5 photos for better recognition</p>
                        </div>
                        <span className={`badge ${capturedImages.length > 0 ? 'badge-success' : 'badge-warning'}`}>
                            {capturedImages.length}/5 photos
                        </span>
                    </div>

                    {errors.images && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.images}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Webcam */}
                        <div className="rounded-2xl overflow-hidden bg-dark-800 aspect-video relative">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                            />

                            {/* Capture button overlay */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                <motion.button
                                    type="button"
                                    onClick={captureImage}
                                    disabled={capturedImages.length >= 5}
                                    className={`
                                        w-14 h-14 rounded-full flex items-center justify-center
                                        ${capturedImages.length >= 5
                                            ? 'bg-white/20 cursor-not-allowed'
                                            : 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30'
                                        }
                                    `}
                                    whileHover={{ scale: capturedImages.length < 5 ? 1.1 : 1 }}
                                    whileTap={{ scale: capturedImages.length < 5 ? 0.9 : 1 }}
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Captured images preview */}
                        <div className="space-y-3">
                            <p className="text-sm text-white/60">Captured Photos:</p>
                            {capturedImages.length === 0 ? (
                                <div className="aspect-video rounded-xl bg-white/5 flex items-center justify-center">
                                    <div className="text-center">
                                        <Image className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                        <p className="text-sm text-white/30">No photos yet</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {capturedImages.map((img, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative group rounded-xl overflow-hidden"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Captured ${index + 1}`}
                                                className="w-full aspect-square object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-400" />
                                            </button>
                                            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-xs text-white font-bold">
                                                {index + 1}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <GradientButton
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </GradientButton>
                    <GradientButton
                        type="submit"
                        variant="gradient"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={Check}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Registering...' : 'Register Student'}
                    </GradientButton>
                </div>
            </form>
        </GlassCard>
    );
}
