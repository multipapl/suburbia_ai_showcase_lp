import { motion } from 'framer-motion';
import { Image, Play } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function MediaPlaceholder({ stageId, title }) {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`relative aspect-video rounded-2xl overflow-hidden border border-white/10 ${isPrecision
                    ? 'bg-gradient-to-br from-cyber-blue/20 via-surface to-surface-light'
                    : 'bg-gradient-to-br from-safety-orange/20 via-surface to-surface-light'
                }`}
        >
            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 animate-shimmer" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isPrecision ? 'bg-cyber-blue/20' : 'bg-safety-orange/20'
                    }`}>
                    <Image className={`w-8 h-8 ${isPrecision ? 'text-cyber-blue/60' : 'text-safety-orange/60'}`} />
                </div>
                <div className="text-center">
                    <p className="text-text-dim text-sm">Stage {stageId}</p>
                    <p className="text-text-muted text-base font-medium">{title}</p>
                </div>
            </div>

            {/* Play Button Overlay (for future video) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute bottom-4 right-4 w-12 h-12 rounded-full border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${isPrecision
                        ? 'bg-cyber-blue/20 border-cyber-blue/30'
                        : 'bg-safety-orange/20 border-safety-orange/30'
                    }`}
            >
                <Play className={`w-5 h-5 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`} />
            </motion.button>
        </motion.div>
    );
}
