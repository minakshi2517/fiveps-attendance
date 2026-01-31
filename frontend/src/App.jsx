/**
 * Main App component with page navigation.
 * Dark mode only - light mode removed.
 */
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { FloatingNavbar } from './components/ui';
import { Landing } from './pages';
import Dashboard from './components/Dashboard';
import { pageVariants } from './utils/animations';

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    // Always apply dark mode
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const handleNavigate = (page) => {
        // Handle smooth scroll for feature sections
        if (page === 'features') {
            const element = document.getElementById('features');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }

        if (page === 'demo') {
            setCurrentPage('dashboard');
            return;
        }

        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return (
                    <motion.div
                        key="dashboard"
                        variants={pageVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        <Dashboard onBack={() => setCurrentPage('home')} />
                    </motion.div>
                );
            case 'home':
            default:
                return (
                    <motion.div
                        key="landing"
                        variants={pageVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        <Landing onNavigate={handleNavigate} />
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Floating Navbar - dark mode only */}
            <FloatingNavbar
                onNavigate={handleNavigate}
                currentPage={currentPage}
            />

            {/* Page Content */}
            <AnimatePresence mode="wait">
                {renderPage()}
            </AnimatePresence>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(26, 26, 26, 0.95)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
