/**
 * Today's attendance panel with glassmorphism design.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Search, Loader2, Download, RefreshCw } from 'lucide-react';
import { GlassCard, GradientButton } from './ui';
import { attendanceAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function TodaysAttendancePanel() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const data = await attendanceAPI.getToday();
            setAttendance(data);
        } catch (error) {
            toast.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendance.filter(record =>
        record.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const verifiedCount = attendance.filter(r => r.status === 'verified').length;
    const pendingCount = attendance.filter(r => r.status !== 'verified').length;

    return (
        <GlassCard hover={false}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Today's Attendance</h3>
                        <p className="text-sm text-white/50">{attendance.length} records</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Stats badges */}
                    <div className="badge badge-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {verifiedCount} verified
                    </div>
                    <div className="badge badge-warning">
                        <XCircle className="w-3 h-3 mr-1" />
                        {pendingCount} pending
                    </div>

                    {/* Refresh button */}
                    <motion.button
                        onClick={loadAttendance}
                        className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="glass-input w-full pl-12 py-2.5"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            ) : filteredAttendance.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No attendance records found</p>
                    <p className="text-sm text-white/30">
                        {searchQuery ? 'Try a different search term' : 'Attendance records will appear here'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Student</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Time</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Confidence</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((record, index) => (
                                <motion.tr
                                    key={record.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center
                                                ${record.status === 'verified'
                                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                                                    : 'bg-gradient-to-br from-amber-500 to-orange-600'
                                                }
                                            `}>
                                                <span className="text-sm font-bold text-white">
                                                    {record.student_name?.charAt(0) || 'S'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-white">{record.student_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-white/70">
                                        {new Date(record.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${(record.confidence_score || 0.95) >= 0.8
                                                            ? 'bg-emerald-500'
                                                            : 'bg-amber-500'
                                                        }`}
                                                    style={{ width: `${(record.confidence_score || 0.95) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-white/50">
                                                {((record.confidence_score || 0.95) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`badge ${record.status === 'verified'
                                                ? 'badge-success'
                                                : 'badge-warning'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </GlassCard>
    );
}
