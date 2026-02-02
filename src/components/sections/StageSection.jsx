import { motion } from 'framer-motion';
import { useScenario } from '../../context/ScenarioContext';
import KeyFocusBadge from '../ui/KeyFocusBadge';
import Checkpoint from '../ui/Checkpoint';
import SmartMedia from '../ui/SmartMedia';

export default function StageSection({ stage }) {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <section
            id={`stage-${stage.id}`}
            className="relative py-24 md:py-32 border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className={stage.id % 2 === 0 ? 'lg:order-2' : ''}
                    >
                        {/* Stage Number */}
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className={`text-6xl md:text-7xl font-bold ${isPrecision ? 'text-cyber-blue/20' : 'text-safety-orange/20'
                                }`}>
                                {String(stage.id).padStart(2, '0')}
                            </span>
                            {stage.checkpoint && (
                                <Checkpoint label={stage.checkpoint} />
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
                            {stage.title}
                        </h2>
                        <p className={`text-lg md:text-xl font-medium mb-6 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'
                            }`}>
                            {stage.subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-text-muted text-lg leading-relaxed mb-8">
                            {stage.descriptionEn}
                        </p>

                        {/* Key Focus */}
                        <div className="flex flex-wrap gap-3">
                            {stage.keyFocus.map((focus, index) => (
                                <KeyFocusBadge key={index} label={focus} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Media */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className={stage.id % 2 === 0 ? 'lg:order-1' : ''}
                    >
                        <SmartMedia
                            src={stage.mediaUrl}
                            srcs={stage.mediaUrls}
                            stageId={stage.id}
                            title={stage.title}
                            showPlayButton={stage.id === 6}
                            autoPlayInterval={stage.id === 5 ? 3000 : 5000}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
