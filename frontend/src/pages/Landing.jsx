/**
 * Modern landing page with glassmorphism design.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scan, Shield, MapPin, Zap, Users, Camera,
    CheckCircle, ArrowRight, Github, Star,
    Fingerprint, Eye, Clock, Lock
} from 'lucide-react';
import { FeatureCard, GradientButton, StatsCard } from '../components/ui';
import AcknowledgmentPopup from '../components/AcknowledgmentPopup';
import { staggerContainer, staggerItem, slideUp } from '../utils/animations';

export default function Landing({ onNavigate }) {
    const [showAcknowledgment, setShowAcknowledgment] = useState(false);
    const features = [
        {
            icon: Scan,
            title: 'Face Recognition',
            description: 'Advanced AI-powered face detection and matching with 99%+ accuracy in real-time.',
            gradient: 'from-primary-500 to-primary-700',
        },
        {
            icon: MapPin,
            title: 'GPS Verification',
            description: 'Geofencing ensures attendance is marked only from authorized locations.',
            gradient: 'from-secondary-500 to-secondary-700',
        },
        {
            icon: Shield,
            title: 'Anti-Spoofing',
            description: 'Liveness detection prevents photo-based proxy attendance attempts.',
            gradient: 'from-accent-pink to-rose-600',
        },
        {
            icon: Zap,
            title: 'Real-time Processing',
            description: 'Instant face detection and attendance marking in milliseconds.',
            gradient: 'from-accent-orange to-amber-600',
        },
        {
            icon: Lock,
            title: 'Fully Offline',
            description: 'All data stored locally. No cloud dependencies. Complete privacy control.',
            gradient: 'from-emerald-500 to-green-600',
        },
        {
            icon: Eye,
            title: 'Live Tracking',
            description: 'Continuous face tracking with smooth bounding box animations.',
            gradient: 'from-cyan-500 to-blue-600',
        },
    ];

    const stats = [
        { icon: Users, title: 'Students Tracked', value: 1000, suffix: '+' },
        { icon: CheckCircle, title: 'Accuracy Rate', value: 99, suffix: '%' },
        { icon: Clock, title: 'Response Time', value: 50, suffix: 'ms' },
        { icon: Fingerprint, title: 'Daily Check-ins', value: 5000, suffix: '+' },
    ];

    return (
        <div className="min-h-screen bg-dark-950 overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-mesh opacity-50 pointer-events-none" />
            <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-8 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
                            variants={staggerItem}
                        >
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-sm text-primary-300 font-medium">Secure Attendance System</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                            variants={staggerItem}
                        >
                            <span className="text-white">Face Recognition</span>
                            <br />
                            <span className="gradient-text">Attendance System</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                            variants={staggerItem}
                        >
                            Prevent proxy attendance with AI-powered face recognition and GPS verification.
                            Fully offline, privacy-focused, and production-ready.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            variants={staggerItem}
                        >
                            <GradientButton
                                variant="gradient"
                                size="lg"
                                icon={Camera}
                                onClick={() => onNavigate?.('dashboard')}
                            >
                                Open Dashboard
                            </GradientButton>
                            <GradientButton
                                variant="secondary"
                                size="lg"
                                icon={Github}
                                onClick={() => window.open('https://github.com', '_blank')}
                            >
                                View on GitHub
                            </GradientButton>
                        </motion.div>
                    </motion.div>

                    {/* Demo Preview */}
                    <motion.div
                        className="mt-20 max-w-5xl mx-auto"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent-pink/20 to-secondary-500/20 rounded-3xl blur-2xl" />

                            {/* Preview Card */}
                            <div className="relative glass-card p-2 overflow-hidden">
                                <div className="aspect-video rounded-2xl bg-dark-900 overflow-hidden relative">
                                    {/* Mock camera feed */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950 flex items-center justify-center">
                                        <div className="text-center">
                                            <motion.div
                                                className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    boxShadow: [
                                                        '0 0 20px rgba(139, 92, 246, 0.2)',
                                                        '0 0 40px rgba(139, 92, 246, 0.4)',
                                                        '0 0 20px rgba(139, 92, 246, 0.2)',
                                                    ]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Camera className="w-12 h-12 text-primary-400" />
                                            </motion.div>
                                            <p className="text-white/60 text-lg">Camera Preview</p>
                                            <p className="text-white/40 text-sm mt-1">Click "Open Dashboard" to start</p>
                                        </div>
                                    </div>

                                    {/* Mock detection overlay - removed to fix overlap */}

                                    {/* Stats overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                                        <div className="glass px-3 py-2 rounded-lg text-xs">
                                            <span className="text-white/60">FPS:</span>
                                            <span className="text-primary-400 font-bold ml-1">30</span>
                                        </div>
                                        <div className="glass px-3 py-2 rounded-lg text-xs">
                                            <span className="text-white/60">Confidence:</span>
                                            <span className="text-green-400 font-bold ml-1">98.5%</span>
                                        </div>
                                        <div className="glass px-3 py-2 rounded-lg text-xs">
                                            <span className="text-white/60">Status:</span>
                                            <span className="text-green-400 font-bold ml-1">Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <StatsCard
                                key={index}
                                icon={stat.icon}
                                title={stat.title}
                                value={stat.value}
                                suffix={stat.suffix}
                                gradient={
                                    index === 0 ? 'from-primary-500 to-primary-700' :
                                        index === 1 ? 'from-emerald-500 to-green-600' :
                                            index === 2 ? 'from-secondary-500 to-secondary-700' :
                                                'from-accent-pink to-rose-600'
                                }
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6" id="features">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        variants={slideUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Powerful <span className="gradient-text">Features</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Experience seamless attendance management with our advanced tools
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                gradient={feature.gradient}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="relative glass-card p-12 text-center overflow-hidden"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                                Set up your secure attendance system in minutes. No credit card required.
                            </p>
                            <div className="relative flex justify-center">
                                <GradientButton
                                    variant="gradient"
                                    size="lg"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                    onClick={() => onNavigate?.('dashboard')}
                                >
                                    Open Dashboard
                                </GradientButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer - Compact Layout */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    {/* Main Footer Row */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <Scan className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">
                                Face<span className="text-primary-400">Auth</span>
                            </span>
                        </div>

                        {/* Credits */}
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">Built with ❤️ by</span>
                            <button
                                onClick={() => setShowAcknowledgment(true)}
                                className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
                            >
                                Mohammad Fayas Khan
                            </button>
                            <button
                                onClick={() => setShowAcknowledgment(true)}
                                className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-medium hover:bg-primary-500/30 transition-all"
                            >
                                ✨ Credits
                            </button>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a href="https://www.linkedin.com/in/mohammadfayaskhan/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors text-xs">
                                LinkedIn
                            </a>
                            <span className="text-gray-700">•</span>
                            <a href="https://github.com/MohammadFayasKhan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-xs">
                                GitHub
                            </a>
                            <span className="text-gray-700">•</span>
                            <a href="https://leetcode.com/u/fayaskhanx/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-400 transition-colors text-xs">
                                LeetCode
                            </a>
                            <span className="text-gray-700">•</span>
                            <a href="https://www.instagram.com/fayaskhanx" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-400 transition-colors text-xs">
                                Instagram
                            </a>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-600">
                        <a href="mailto:fayaskhanmohammad@gmail.com" className="text-primary-400/70 hover:text-primary-400 transition-colors">
                            fayaskhanmohammad@gmail.com
                        </a>
                        <span className="hidden sm:inline">•</span>
                        <span>© {new Date().getFullYear()} FaceAuth</span>
                    </div>
                </div>
            </footer>

            {/* Acknowledgment Popup */}
            <AcknowledgmentPopup
                isOpen={showAcknowledgment}
                onClose={() => setShowAcknowledgment(false)}
            />
        </div>
    );
}
