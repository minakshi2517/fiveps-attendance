/**
 * Student management panel with glassmorphism design.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Users, Edit2, Eye, Trash2, Plus,
    AlertCircle, Loader2, Filter
} from 'lucide-react';
import { GlassCard, GradientButton } from './ui';
import StudentEditModal from './StudentEditModal';
import StudentViewModal from './StudentViewModal';
import ConfirmDialog from './ConfirmDialog';
import { staggerContainer, staggerItem } from '../utils/animations';
import { studentsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function StudentManagementPanel() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentsAPI.getAll();
            setStudents(data);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!studentToDelete) return;

        try {
            await studentsAPI.delete(studentToDelete.id);
            toast.success('Student deleted successfully');
            loadStudents();
        } catch (error) {
            toast.error('Failed to delete student');
        } finally {
            setShowDeleteConfirm(false);
            setStudentToDelete(null);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.enrollment_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <GlassCard hover={false}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Students</h3>
                        <p className="text-sm text-white/50">{students.length} registered</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="glass-input w-full pl-12 py-2.5"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No students found</p>
                    <p className="text-sm text-white/30">
                        {searchQuery ? 'Try a different search term' : 'Register your first student'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Enrollment ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-white/50">Email</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-white/50">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <motion.tr
                                    key={student.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    {student.name?.charAt(0) || 'S'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-white">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-white/70">{student.enrollment_id}</td>
                                    <td className="py-4 px-4 text-white/50">{student.email || '-'}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowViewModal(true);
                                                }}
                                                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowEditModal(true);
                                                }}
                                                className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 hover:bg-primary-500/20 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setStudentToDelete(student);
                                                    setShowDeleteConfirm(true);
                                                }}
                                                className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {showEditModal && selectedStudent && (
                <StudentEditModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedStudent(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedStudent(null);
                        loadStudents();
                    }}
                />
            )}

            {showViewModal && selectedStudent && (
                <StudentViewModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedStudent(null);
                    }}
                />
            )}

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setStudentToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Student"
                message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </GlassCard>
    );
}
