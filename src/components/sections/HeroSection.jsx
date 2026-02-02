import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function HeroSection() {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow ${isPrecision ? 'bg-cyber-blue/10' : 'bg-safety-orange/10'
                    }`} />
                <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow ${isPrecision ? 'bg-cyber-blue/5' : 'bg-safety-orange/5'
                    }`} style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                >
                    <Sparkles className={`w-4 h-4 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`} />
                    <span className="text-sm text-text-muted">AI-Enhanced Architectural Visualization</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                >
                    <span className="text-text-primary">Hybrid</span>
                    <br />
                    <span className={`bg-clip-text text-transparent ${isPrecision
                        ? 'bg-gradient-to-r from-cyber-blue via-cyan-400 to-blue-400'
                        : 'bg-gradient-to-r from-safety-orange via-orange-400 to-yellow-400'
                        }`}>
                        Workflow
                    </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-12 font-light"
                >
                    Complete project control with strategic flexibility.
                    <br className="hidden sm:block" />
                    <span className="text-text-primary">Precision</span> when you need it. <span className="text-text-primary">Artistic freedom</span> when you want it.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#stage-1"
                        className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${isPrecision
                            ? 'bg-cyber-blue text-deep-black glow-blue hover:bg-cyber-blue/90'
                            : 'bg-safety-orange text-deep-black glow-orange hover:bg-safety-orange/90'
                            }`}
                    >
                        Explore Workflow
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 border border-white/20 text-text-primary rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-300"
                    >
                        Start a Project
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator - positioned at bottom of section */}
            <motion.a
                href="#stage-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 cursor-pointer group"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-text-dim text-xs uppercase tracking-widest group-hover:text-text-muted transition-colors">Scroll to explore</span>
                    <ArrowDown className="w-5 h-5 text-text-dim group-hover:text-text-muted transition-colors" />
                </motion.div>
            </motion.a>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-black to-transparent" />
        </section>
    );
}
