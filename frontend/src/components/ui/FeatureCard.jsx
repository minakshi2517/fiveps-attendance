/**
 * Feature card component with icon, title, description and hover effects.
 */
import { motion } from 'framer-motion';
import { staggerItem, hoverScale } from '../../utils/animations';

export default function FeatureCard({
    icon: Icon,
    title,
    description,
    gradient = 'from-primary-500 to-primary-700',
    delay = 0,
}) {
    return (
        <motion.div
            className="feature-card group"
            variants={staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
        >
            {/* Icon container with gradient background */}
            <div className={`
        w-14 h-14 rounded-2xl mb-5 flex items-center justify-center
        bg-gradient-to-br ${gradient}
        shadow-lg group-hover:shadow-xl
        transition-all duration-300
        group-hover:scale-110
      `}>
                {Icon && <Icon className="w-7 h-7 text-white" />}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {description}
            </p>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-pink to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl" />
        </motion.div>
    );
}
