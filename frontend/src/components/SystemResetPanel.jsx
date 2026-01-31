/**
 * System reset panel with glassmorphism design.
 * Improved layout with action buttons at bottom of each card.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trash2, AlertTriangle, Database, RefreshCw,
    CheckCircle
} from 'lucide-react';
import { GlassCard, GradientButton } from './ui';
import ConfirmDialog from './ConfirmDialog';
import { studentsAPI, attendanceAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function SystemResetPanel() {
    const [isResettingAttendance, setIsResettingAttendance] = useState(false);
    const [isResettingStudents, setIsResettingStudents] = useState(false);
    const [showAttendanceConfirm, setShowAttendanceConfirm] = useState(false);
    const [showStudentsConfirm, setShowStudentsConfirm] = useState(false);

    const handleResetAttendance = async () => {
        setIsResettingAttendance(true);
        try {
            await attendanceAPI.resetToday();
            toast.success("Today's attendance has been reset");
        } catch (error) {
            toast.error('Failed to reset attendance');
        } finally {
            setIsResettingAttendance(false);
            setShowAttendanceConfirm(false);
        }
    };

    const handleResetStudents = async () => {
        setIsResettingStudents(true);
        try {
            await studentsAPI.deleteAll();
            toast.success('All students have been deleted');
        } catch (error) {
            toast.error('Failed to delete students');
        } finally {
            setIsResettingStudents(false);
            setShowStudentsConfirm(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Warning Banner */}
            <motion.div
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-amber-300 mb-1">Danger Zone</h4>
                    <p className="text-sm text-amber-400/70">
                        These actions are destructive and cannot be undone. Please proceed with caution.
                    </p>
                </div>
            </motion.div>

            {/* Reset Options - Side by side with equal heights */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Reset Attendance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                >
                    <GlassCard className="h-full flex flex-col" hover={false}>
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                            <RefreshCw className="w-6 h-6 text-amber-400" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                            Reset Today's Attendance
                        </h3>
                        <p className="text-sm text-white/50 mb-6 flex-grow">
                            Clear all attendance records for today. This will allow students to mark attendance again.
                        </p>

                        <GradientButton
                            variant="secondary"
                            size="md"
                            loading={isResettingAttendance}
                            onClick={() => setShowAttendanceConfirm(true)}
                            className="w-full mt-auto"
                        >
                            {isResettingAttendance ? 'Processing...' : "Reset Today's Attendance"}
                        </GradientButton>
                    </GlassCard>
                </motion.div>

                {/* Delete Students Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="h-full flex flex-col" hover={false}>
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                            Delete All Students
                        </h3>
                        <p className="text-sm text-white/50 mb-6 flex-grow">
                            Remove all registered students and their face encodings. This action is irreversible.
                        </p>

                        <GradientButton
                            variant="danger"
                            size="md"
                            loading={isResettingStudents}
                            onClick={() => setShowStudentsConfirm(true)}
                            className="w-full mt-auto"
                        >
                            {isResettingStudents ? 'Processing...' : 'Delete All Students'}
                        </GradientButton>
                    </GlassCard>
                </motion.div>
            </div>

            {/* System Info */}
            <GlassCard hover={false}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Database className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">System Information</h3>
                        <p className="text-sm text-white/50">Database and storage status</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-xs text-white/50 mb-1">Database</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white">SQLite</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-xs text-white/50 mb-1">Storage</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Local</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-xs text-white/50 mb-1">Face Models</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Loaded</span>
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-xs text-white/50 mb-1">API Status</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-white">Online</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Confirm Dialogs */}
            <ConfirmDialog
                isOpen={showAttendanceConfirm}
                onClose={() => setShowAttendanceConfirm(false)}
                onConfirm={handleResetAttendance}
                title="Reset Today's Attendance"
                message="Are you sure you want to reset all attendance records for today? Students will be able to mark attendance again."
                confirmText="Reset Attendance"
                variant="warning"
            />

            <ConfirmDialog
                isOpen={showStudentsConfirm}
                onClose={() => setShowStudentsConfirm(false)}
                onConfirm={handleResetStudents}
                title="Delete All Students"
                message="Are you sure you want to delete ALL registered students? This will remove all student data and face encodings. This action cannot be undone."
                confirmText="Delete All"
                variant="danger"
            />
        </div>
    );
}
