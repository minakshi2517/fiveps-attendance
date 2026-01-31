/**
 * Floating navbar with glassmorphism effect.
 * Dark mode only - light mode removed.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Scan } from 'lucide-react';
import { navbarVariants, mobileMenuVariants } from '../../utils/animations';

export default function FloatingNavbar({
    onNavigate,
    currentPage = 'home',
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Nav items - removed Demo
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'features', label: 'Features' },
        { id: 'dashboard', label: 'Dashboard' },
    ];

    // Check if we should show Get Started button
    const showGetStarted = currentPage !== 'dashboard';

    return (
        <motion.nav
            className={`
        w-full max-w-5xl mx-auto
        ${isScrolled ? 'glass-navbar shadow-lg' : 'bg-transparent'}
        rounded-2xl transition-all duration-300
      `}
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onNavigate?.('home')}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Scan className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">
                            Face<span className="text-primary-400">Auth</span>
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate?.(item.id)}
                                className={`
                  px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${currentPage === item.id
                                        ? 'bg-primary-500/20 text-primary-300'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-3">
                        {/* CTA Button - Hidden on dashboard */}
                        {showGetStarted && (
                            <motion.button
                                className="hidden sm:flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onNavigate?.('dashboard')}
                            >
                                Get Started
                            </motion.button>
                        )}

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden mt-4 pt-4 border-t border-white/10"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate?.(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`
                      px-4 py-3 rounded-xl text-left font-medium
                      transition-all duration-200
                      ${currentPage === item.id
                                                ? 'bg-primary-500/20 text-primary-300'
                                                : 'text-white/70 hover:text-white hover:bg-white/5'
                                            }
                    `}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                {showGetStarted && (
                                    <button
                                        className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold text-center"
                                        onClick={() => {
                                            onNavigate?.('dashboard');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Get Started
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
