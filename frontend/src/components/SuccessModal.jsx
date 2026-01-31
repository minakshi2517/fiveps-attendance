import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';


const SuccessModal = ({
    isOpen,
    onClose,
    studentName,
    studentId,
    role,
    timestamp,
    confidenceScore,
    locationVerified,
    snapshotUrl,
    autoDismissMs = 5000,
}) => {
    React.useEffect(() => {
        if (isOpen && autoDismissMs > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoDismissMs);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoDismissMs, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8 text-center">
                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="relative">
                                        <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={2} />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.2, 1] }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                                        />
                                    </div>
                                </motion.div>

                                {/* Success Message */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold text-white mb-2"
                                >
                                    Attendance Marked Successfully!
                                </motion.h2>

                                {/* Student Info */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-3 mt-6"
                                >
                                    {/* Student Photo */}
                                    {snapshotUrl && (
                                        <div className="flex justify-center mb-4">
                                            <div className="relative">
                                                <img
                                                    src={snapshotUrl}
                                                    alt={studentName}
                                                    className="w-32 h-32 rounded-lg object-cover border-4 border-green-500/50"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {confidenceScore}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Student Details */}
                                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-2 text-left">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Name:</span>
                                            <span className="text-white font-semibold">{studentName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">ID:</span>
                                            <span className="text-white font-mono">{studentId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Role:</span>
                                            <span className="text-white">{role}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Time:</span>
                                            <span className="text-white">{timestamp}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Match Confidence:</span>
                                            <span className="text-green-400 font-semibold">{confidenceScore}%</span>
                                        </div>
                                    </div>

                                    {/* Location Status */}
                                    <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${locationVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        <CheckCircle size={20} />
                                        <span className="font-semibold">
                                            {locationVerified ? 'Location Verified ✓' : 'Location Not Verified'}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Auto-dismiss indicator */}
                                {autoDismissMs > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-6 text-gray-400 text-sm"
                                    >
                                        Auto-closing in {Math.ceil(autoDismissMs / 1000)} seconds...
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
