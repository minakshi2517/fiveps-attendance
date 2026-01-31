/**
 * Attendance status component with fixed animations and location display.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, MapPin, Clock, Percent, AlertCircle } from 'lucide-react';
import { GlassCard } from './ui';
import { scaleIn } from '../utils/animations';

export default function AttendanceStatus({ result, student, deviceLocation }) {
    const getStatusConfig = () => {
        if (!result) {
            return {
                icon: AlertCircle,
                title: 'Ready to Scan',
                subtitle: 'Position your face in the camera frame',
                colorClass: 'text-purple-400',
                bgClass: 'bg-purple-500/20',
                borderClass: 'border-purple-500/20',
                gradientClass: 'from-purple-500/20 to-purple-700/10',
            };
        }

        if (result.success) {
            return {
                icon: CheckCircle,
                title: 'Attendance Marked!',
                subtitle: result.message || 'Successfully recorded',
                colorClass: 'text-emerald-400',
                bgClass: 'bg-emerald-500/20',
                borderClass: 'border-emerald-500/20',
                gradientClass: 'from-emerald-500/20 to-green-700/10',
            };
        }

        return {
            icon: XCircle,
            title: 'Verification Failed',
            subtitle: result.message || 'Please try again',
            colorClass: 'text-red-400',
            bgClass: 'bg-red-500/20',
            borderClass: 'border-red-500/20',
            gradientClass: 'from-red-500/20 to-rose-700/10',
        };
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <GlassCard className="h-full" hover={false}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Attendance Status</h2>
                    <p className="text-xs text-white/50">Recognition result</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={result ? (result.success ? 'success' : 'error') : 'ready'}
                    className={`relative p-6 rounded-2xl mb-6 overflow-hidden bg-gradient-to-br ${config.gradientClass} border ${config.borderClass}`}
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center ${config.bgClass} border-2 ${config.borderClass}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <Icon className={`w-10 h-10 ${config.colorClass}`} />
                        </motion.div>

                        <h3 className="text-xl font-bold text-white mb-2">
                            {config.title}
                        </h3>
                        <p className="text-sm text-white/60">
                            {config.subtitle}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Student Details */}
            {student && result?.success && (
                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                                {student.name?.charAt(0) || 'S'}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-white">{student.name}</p>
                            <p className="text-sm text-white/50">{student.enrollment_id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <Percent className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-white/50">Match</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-400">
                                {result.attendance?.confidence_score
                                    ? `${(result.attendance.confidence_score * 100).toFixed(1)}%`
                                    : '95%'
                                }
                            </p>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-white/50">Location</span>
                            </div>
                            <p className="text-sm font-semibold text-blue-400">
                                {result.attendance?.status === 'verified' ? 'Verified ✓' : 'Pending'}
                            </p>
                        </div>
                    </div>

                    {/* Location Coordinates Display */}
                    {deviceLocation && (
                        <div className="p-3 bg-white/5 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-medium text-white/70">GPS Verification</span>
                            </div>

                            <div className="text-xs">
                                <span className="text-white/50">Device Location: </span>
                                <span className="text-blue-400 font-mono">
                                    {deviceLocation.latitude?.toFixed(6)}, {deviceLocation.longitude?.toFixed(6)}
                                </span>
                            </div>

                            {result.attendance?.location_lat && (
                                <div className="text-xs">
                                    <span className="text-white/50">Recorded Location: </span>
                                    <span className="text-purple-400 font-mono">
                                        {result.attendance.location_lat?.toFixed(6)}, {result.attendance.location_lng?.toFixed(6)}
                                    </span>
                                </div>
                            )}

                            <div className="pt-2 border-t border-white/10">
                                <span className={`text-xs font-medium ${result.attendance?.status === 'verified'
                                        ? 'text-emerald-400'
                                        : 'text-orange-400'
                                    }`}>
                                    {result.attendance?.status === 'verified'
                                        ? '✓ Location verified - Within allowed zone'
                                        : '⚠ Location verification pending'
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/60">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Empty state when no result - show device location */}
            {!student && !result && (
                <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                        <p className="text-sm text-white/40">
                            Capture a photo to mark attendance
                        </p>
                    </div>

                    {/* Device location preview */}
                    {deviceLocation && (
                        <div className="p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-white/50">Current Location</span>
                            </div>
                            <p className="text-xs font-mono text-blue-400">
                                {deviceLocation.latitude?.toFixed(6)}, {deviceLocation.longitude?.toFixed(6)}
                            </p>
                        </div>
                    )}

                    {!deviceLocation && (
                        <div className="p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-400" />
                                <span className="text-xs text-orange-400">Waiting for GPS...</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </GlassCard>
    );
}
