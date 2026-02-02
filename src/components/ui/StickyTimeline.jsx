import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useScenario } from '../../context/ScenarioContext';

export default function StickyTimeline({ stages }) {
    const { activeStage, stageProgress, scrollToStage } = useScrollProgress();
    const { scenario } = useScenario();

    const isPrecision = scenario === 'A';
    const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Progress Bar */}
                <div className="flex items-center gap-1 h-12">
                    {stages.map((stage) => {
                        const widthPercent = (stage.duration / totalDuration) * 100;
                        const isActive = activeStage === stage.id;
                        const isPast = activeStage > stage.id;

                        // Calculate progress width for the bar
                        let progressWidth = '0%';
                        if (isPast) {
                            progressWidth = '100%';
                        } else if (isActive) {
                            progressWidth = `${stageProgress}%`;
                        }

                        return (
                            <motion.button
                                key={stage.id}
                                onClick={() => scrollToStage(stage.id)}
                                style={{ width: `${widthPercent}%` }}
                                className={`relative group h-full flex flex-col justify-center px-2 rounded-lg transition-all duration-300 ${isActive
                                    ? isPrecision ? 'bg-cyber-blue/20' : 'bg-safety-orange/20'
                                    : isPast
                                        ? 'bg-white/5'
                                        : 'hover:bg-white/5'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Stage Number & Title */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className={`text-xs font-bold ${isActive
                                            ? isPrecision ? 'text-cyber-blue' : 'text-safety-orange'
                                            : isPast
                                                ? 'text-text-muted'
                                                : 'text-text-dim'
                                            }`}
                                    >
                                        {String(stage.id).padStart(2, '0')}
                                    </span>
                                    <span
                                        className={`text-xs font-medium truncate hidden sm:block ${isActive
                                            ? 'text-text-primary'
                                            : isPast
                                                ? 'text-text-muted'
                                                : 'text-text-dim'
                                            }`}
                                    >
                                        {stage.title}
                                    </span>
                                </div>

                                {/* Progress Indicator - smooth fill */}
                                <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className={isPrecision ? 'h-full bg-cyber-blue' : 'h-full bg-safety-orange'}
                                        initial={false}
                                        animate={{ width: progressWidth }}
                                        transition={{
                                            duration: 0.15,
                                            ease: 'linear'
                                        }}
                                    />
                                </div>

                                {/* Fork Indicator */}
                                {stage.isFork && (
                                    <div className={`absolute -top-1 right-1 w-2 h-2 rounded-full animate-pulse ${isPrecision ? 'bg-cyber-blue' : 'bg-safety-orange'
                                        }`} />
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-surface-light rounded-lg text-xs text-text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                    {stage.title}
                                    {stage.isFork && (
                                        <span className={`ml-2 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`}>★ Fork</span>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Mobile: Current Stage */}
                <div className="sm:hidden mt-2 text-center">
                    <span className={`font-medium ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`}>
                        {stages.find(s => s.id === activeStage)?.title || 'Workflow'}
                    </span>
                </div>
            </div>
        </div>
    );
}
