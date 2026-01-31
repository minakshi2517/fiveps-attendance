/**
 * Acknowledgment popup showing developer credits.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Github, Instagram, Mail, Code2, Heart } from 'lucide-react';
import { modalOverlay, modalContent } from '../utils/animations';

export default function AcknowledgmentPopup({ isOpen, onClose }) {
    if (!isOpen) return null;

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/mohammadfayaskhan/',
            icon: Linkedin,
            color: 'hover:text-blue-400',
            bgColor: 'hover:bg-blue-500/20',
        },
        {
            name: 'GitHub',
            url: 'https://github.com/MohammadFayasKhan',
            icon: Github,
            color: 'hover:text-white',
            bgColor: 'hover:bg-gray-500/20',
        },
        {
            name: 'LeetCode',
            url: 'https://leetcode.com/u/fayaskhanx/',
            icon: Code2,
            color: 'hover:text-orange-400',
            bgColor: 'hover:bg-orange-500/20',
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/fayaskhanx',
            icon: Instagram,
            color: 'hover:text-pink-400',
            bgColor: 'hover:bg-pink-500/20',
        },
        {
            name: 'Email',
            url: 'mailto:fayaskhanmohammad@gmail.com',
            icon: Mail,
            color: 'hover:text-primary-400',
            bgColor: 'hover:bg-primary-500/20',
        },
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
                    className="modal-content max-w-lg p-8 m-4"
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

                    {/* Profile Image */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-accent-pink to-secondary-500 rounded-full blur-xl opacity-50" />
                        <motion.div
                            className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary-500/50"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <img
                                src="/fayas.jpg"
                                alt="Mohammad Fayas Khan"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <motion.h2
                            className="text-2xl font-bold text-white mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Mohammad Fayas Khan
                        </motion.h2>
                        <motion.p
                            className="text-primary-400 font-medium"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Full Stack Developer
                        </motion.p>
                    </div>

                    {/* About */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Passionate about building innovative solutions with modern technologies.
                            This Face Recognition Attendance System was built with{' '}
                            <Heart className="w-4 h-4 inline text-red-500" /> using React, FastAPI,
                            and advanced AI/ML techniques.
                        </p>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="flex justify-center gap-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {socialLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 transition-all ${link.color} ${link.bgColor}`}
                                    title={link.name}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </motion.div>

                    {/* Technologies Used */}
                    <motion.div
                        className="p-4 bg-white/5 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-sm font-semibold text-white mb-3 text-center">
                            Technologies Used
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['React', 'FastAPI', 'SQLite', 'OpenCV', 'Face Recognition', 'Framer Motion', 'TailwindCSS'].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Thank You */}
                    <motion.p
                        className="text-center text-gray-500 text-xs mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Thank you for using FaceAuth! 🚀
                    </motion.p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
