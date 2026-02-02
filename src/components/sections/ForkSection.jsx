import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Palette } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';
import KeyFocusBadge from '../ui/KeyFocusBadge';
import Checkpoint from '../ui/Checkpoint';
import SmartMedia from '../ui/SmartMedia';

export default function ForkSection({ stage }) {
    const { scenario, selectScenario } = useScenario();

    const currentScenario = scenario === 'A' ? stage.scenarioA : stage.scenarioB;
    const isPrecision = scenario === 'A';

    return (
        <section id={`stage-${stage.id}`} className="relative pt-12 pb-24 md:pt-16 md:pb-32">
            {/* Background Accent */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full ${isPrecision ? 'bg-gradient-to-b from-cyber-blue/5 to-transparent' : 'bg-gradient-to-b from-safety-orange/5 to-transparent'
                        }`}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className={`text-8xl md:text-9xl font-bold block mb-4 ${isPrecision ? 'text-cyber-blue/10' : 'text-safety-orange/10'
                        }`}>
                        03
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
                        {stage.title}
                    </h2>
                    <p className="text-xl text-text-muted mb-8">
                        Choose Your Strategy
                    </p>

                    {/* Header Image - uses scenario-specific media if available */}
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={scenario}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                            >
                                <SmartMedia
                                    src={currentScenario.headerMediaUrl || stage.mediaUrl}
                                    srcs={currentScenario.headerMediaUrls || stage.mediaUrls}
                                    stageId={stage.id}
                                    title={stage.title}
                                    autoPlayInterval={5000}
                                    enableLightbox={true}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Scenario Switcher */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-center gap-4 mb-6"
                >
                    {/* Scenario A Button */}
                    <button
                        onClick={() => selectScenario('A')}
                        className={`group relative flex-1 max-w-md p-6 rounded-2xl border-2 transition-all duration-500 ${scenario === 'A'
                            ? 'border-cyber-blue bg-cyber-blue/10 glow-blue-pulse'
                            : 'border-white/10 hover:border-white/20 bg-surface/50'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${scenario === 'A' ? 'bg-cyber-blue text-deep-black' : 'bg-surface-lighter text-text-muted'
                                }`}>
                                <Crosshair size={28} />
                            </div>
                            <div className="text-left">
                                <h3 className={`text-xl font-bold ${scenario === 'A' ? 'text-cyber-blue' : 'text-text-primary'}`}>
                                    Scenario A: Precision
                                </h3>
                                <p className="text-text-muted text-sm">Total Control • Technical Accuracy</p>
                            </div>
                        </div>
                        {scenario === 'A' && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyber-blue"
                            />
                        )}
                    </button>

                    {/* Scenario B Button */}
                    <button
                        onClick={() => selectScenario('B')}
                        className={`group relative flex-1 max-w-md p-6 rounded-2xl border-2 transition-all duration-500 ${scenario === 'B'
                            ? 'border-safety-orange bg-safety-orange/10 glow-orange-pulse'
                            : 'border-white/10 hover:border-white/20 bg-surface/50'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${scenario === 'B' ? 'bg-safety-orange text-deep-black' : 'bg-surface-lighter text-text-muted'
                                }`}>
                                <Palette size={28} />
                            </div>
                            <div className="text-left">
                                <h3 className={`text-xl font-bold ${scenario === 'B' ? 'text-safety-orange' : 'text-text-primary'}`}>
                                    Scenario B: Artistic
                                </h3>
                                <p className="text-text-muted text-sm">Agile & Fast • Creative Freedom</p>
                            </div>
                        </div>
                        {scenario === 'B' && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-safety-orange"
                            />
                        )}
                    </button>
                </motion.div>

                {/* Micro-copy Hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-center text-sm text-text-dim mb-16"
                >
                    {isPrecision
                        ? "✓ Choose this if you need 100% architectural accuracy and full control over every detail."
                        : "✓ Choose this for faster turnaround with creative freedom and AI-assisted generation."
                    }
                </motion.p>

                {/* Scenario Description */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={scenario}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className={`text-center max-w-3xl mx-auto mb-20 p-8 rounded-2xl ${isPrecision
                            ? 'border border-cyber-blue/20 bg-cyber-blue/5'
                            : 'border border-safety-orange/20 bg-safety-orange/5'
                            }`}
                    >
                        <p className="text-lg text-text-muted">
                            {currentScenario.descriptionEn}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Sub-Stages */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={scenario + '-substages'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-20"
                    >
                        {currentScenario.subStages.map((subStage, index) => (
                            <motion.div
                                key={subStage.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                            >
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    {/* Sub-stage Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className={`text-5xl font-bold ${isPrecision ? 'text-gradient-blue' : 'text-gradient-orange'
                                            }`}>
                                            {subStage.id}
                                        </span>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPrecision
                                            ? 'bg-cyber-blue/20 text-cyber-blue'
                                            : 'bg-safety-orange/20 text-safety-orange'
                                            }`}>
                                            {subStage.tag}
                                        </div>
                                    </div>

                                    {/* Gradient Title */}
                                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${isPrecision ? 'text-gradient-blue' : 'text-gradient-orange'
                                        }`}>
                                        {subStage.title}
                                    </h3>
                                    <p className={`text-lg font-medium mb-4 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'
                                        }`}>
                                        {subStage.subtitle}
                                    </p>

                                    <p className="text-text-muted leading-relaxed mb-6">
                                        {subStage.descriptionEn}
                                    </p>

                                    {/* Key Focus & Checkpoint */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {subStage.keyFocus.map((focus, i) => (
                                            <KeyFocusBadge key={i} label={focus} />
                                        ))}
                                        {subStage.checkpoint && (
                                            <Checkpoint label={subStage.checkpoint} />
                                        )}
                                    </div>
                                </div>

                                {/* Media with Transition */}
                                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                    <motion.div
                                        key={`${scenario}-${subStage.id}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <SmartMedia
                                            src={subStage.mediaUrl}
                                            srcs={subStage.mediaUrls}
                                            stageId={subStage.id}
                                            title={subStage.title}
                                            autoPlayInterval={4000}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
