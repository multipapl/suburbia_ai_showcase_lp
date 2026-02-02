import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Palette, ChevronDown } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

/**
 * Sticky Scenario Switcher
 * 
 * A floating pill that appears after scrolling past Stage 3 (the fork section),
 * allowing users to switch between A/B scenarios without scrolling back up.
 * 
 * Features:
 * - Appears after passing Stage 3
 * - Compact pill design in bottom-right corner
 * - Expands on hover/tap to show both options
 * - Hardware-accelerated animations
 */

export default function StickyScenarioSwitcher({ isIntegrated = false }) {
    const { scenario, selectScenario } = useScenario();
    const [isVisible, setIsVisible] = useState(false);

    const isPrecision = scenario === 'A';

    // Track scroll position to show/hide the switcher (only if not integrated)
    useEffect(() => {
        if (isIntegrated) return;

        const handleScroll = () => {
            const stage3 = document.getElementById('stage-3');
            if (stage3) {
                const stage3Top = stage3.getBoundingClientRect().top;
                setIsVisible(stage3Top < 200);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleScenario = () => {
        selectScenario(isPrecision ? 'B' : 'A');
    };

    return (
        <AnimatePresence>
            {(isVisible || isIntegrated) && (
                <motion.div
                    initial={isIntegrated ? false : { opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={isIntegrated ? { opacity: 0, scale: 0.8 } : { opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={isIntegrated ? "" : "fixed bottom-24 right-6 z-50"}
                    style={{ willChange: 'transform, opacity' }}
                >
                    <motion.button
                        layout
                        onClick={toggleScenario}
                        className={`relative backdrop-blur-xl rounded-xl border shadow-lg overflow-hidden flex items-center gap-3 px-3 py-2 transition-colors duration-300 ${isPrecision
                            ? 'bg-cyber-blue/5 border-cyber-blue/20 hover:border-cyber-blue/40'
                            : 'bg-safety-orange/5 border-safety-orange/20 hover:border-safety-orange/40'
                            } ${isIntegrated ? 'border-none bg-transparent shadow-none !px-0' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isPrecision ? 'bg-cyber-blue text-deep-black shadow-[0_0_15px_rgba(0,209,255,0.3)]' : 'bg-safety-orange text-deep-black shadow-[0_0_15px_rgba(255,138,0,0.3)]'
                            }`}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={scenario}
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isPrecision ? <Crosshair size={16} /> : <Palette size={16} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="text-left min-w-[80px]">
                            <div className={`font-bold text-xs transition-colors duration-300 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'
                                }`}>
                                {isPrecision ? 'Precision' : 'Artistic'}
                            </div>
                            <div className="text-[10px] text-text-dim flex items-center gap-1 uppercase tracking-wider font-medium opacity-80">
                                <span>Scenario</span>
                            </div>
                        </div>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
