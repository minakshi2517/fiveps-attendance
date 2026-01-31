/**
 * Stats card component with animated counter and gradient background.
 */
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { staggerItem } from '../../utils/animations';

export default function StatsCard({
    icon: Icon,
    title,
    value,
    suffix = '',
    gradient = 'from-primary-500 to-primary-700',
    iconGradient = 'from-white/20 to-white/5',
    delay = 0,
}) {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

    useEffect(() => {
        const controls = animate(0, numericValue, {
            duration: 1.5,
            ease: 'easeOut',
            onUpdate: (v) => setDisplayValue(Math.round(v)),
        });

        return () => controls.stop();
    }, [numericValue]);

    return (
        <motion.div
            className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${gradient}
        shadow-lg hover:shadow-xl
        transition-all duration-300
      `}
            variants={staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            whileHover={{
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 }
            }}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
                    <motion.p
                        className="text-4xl font-bold text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {displayValue}{suffix}
                    </motion.p>
                </div>

                {Icon && (
                    <div className={`
            w-14 h-14 rounded-xl flex items-center justify-center
            bg-gradient-to-br ${iconGradient}
            backdrop-blur-sm
          `}>
                        <Icon className="w-8 h-8 text-white/90" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
