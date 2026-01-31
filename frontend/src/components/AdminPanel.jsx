/**
 * Admin panel with glassmorphism design.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Users, Settings, Clock, Shield, LogOut,
    ChevronRight, Database, Trash2, RefreshCw
} from 'lucide-react';
import { GlassCard, GradientButton } from './ui';
import StudentManagementPanel from './StudentManagementPanel';
import TodaysAttendancePanel from './TodaysAttendancePanel';
import SystemResetPanel from './SystemResetPanel';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel({ onClose }) {
    const [activeTab, setActiveTab] = useState('students');
    const { logout } = useAuth();

    const tabs = [
        { id: 'students', label: 'Student Management', icon: Users },
        { id: 'attendance', label: "Today's Attendance", icon: Clock },
        { id: 'settings', label: 'System Reset', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        onClose?.();
    };

    return (
        <div className="min-h-screen bg-dark-950 pt-6 pb-12 px-6">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                            <p className="text-white/50">Manage students and attendance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <GradientButton
                            variant="ghost"
                            size="sm"
                            icon={LogOut}
                            onClick={handleLogout}
                        >
                            Logout
                        </GradientButton>
                        <motion.button
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    className="flex flex-wrap gap-2 mb-8"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                variants={staggerItem}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-5 py-3 rounded-xl font-medium
                                    transition-all duration-300
                                    ${activeTab === tab.id
                                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'students' && <StudentManagementPanel />}
                        {activeTab === 'attendance' && <TodaysAttendancePanel />}
                        {activeTab === 'settings' && <SystemResetPanel />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
