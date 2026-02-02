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

export default function StickyScenarioSwitcher() {
    const { scenario, selectScenario } = useScenario();
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const isPrecision = scenario === 'A';

    // Track scroll position to show/hide the switcher
    useEffect(() => {
        const handleScroll = () => {
            // Find Stage 3 section and check if we've scrolled to it
            const stage3 = document.getElementById('stage-3');
            if (stage3) {
                const stage3Top = stage3.getBoundingClientRect().top;
                // Show when Stage 3 top enters viewport (user starts seeing the fork section)
                // Using a threshold of 200px so it appears slightly before reaching the section
                setIsVisible(stage3Top < 200);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScenarioSelect = (s) => {
        selectScenario(s);
        setIsExpanded(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed bottom-24 right-6 z-50"
                    style={{ willChange: 'transform, opacity' }}
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    {/* Main Container */}
                    <motion.div
                        layout
                        className={`relative backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden ${isPrecision
                            ? 'bg-surface/90 border-cyber-blue/30'
                            : 'bg-surface/90 border-safety-orange/30'
                            }`}
                        style={{
                            boxShadow: isPrecision
                                ? '0 8px 32px rgba(0, 209, 255, 0.2)'
                                : '0 8px 32px rgba(255, 138, 0, 0.2)'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                /* Expanded State - Both Options */
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="p-2 flex flex-col gap-2"
                                >
                                    {/* Scenario A Option */}
                                    <button
                                        onClick={() => handleScenarioSelect('A')}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${scenario === 'A'
                                            ? 'bg-cyber-blue/20 border border-cyber-blue/50'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scenario === 'A' ? 'bg-cyber-blue text-deep-black' : 'bg-surface-lighter text-text-muted'
                                            }`}>
                                            <Crosshair size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-semibold text-sm ${scenario === 'A' ? 'text-cyber-blue' : 'text-text-primary'
                                                }`}>
                                                Precision
                                            </div>
                                            <div className="text-xs text-text-dim">Scenario A</div>
                                        </div>
                                        {scenario === 'A' && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="w-2 h-2 rounded-full bg-cyber-blue ml-auto"
                                            />
                                        )}
                                    </button>

                                    {/* Scenario B Option */}
                                    <button
                                        onClick={() => handleScenarioSelect('B')}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${scenario === 'B'
                                            ? 'bg-safety-orange/20 border border-safety-orange/50'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scenario === 'B' ? 'bg-safety-orange text-deep-black' : 'bg-surface-lighter text-text-muted'
                                            }`}>
                                            <Palette size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-semibold text-sm ${scenario === 'B' ? 'text-safety-orange' : 'text-text-primary'
                                                }`}>
                                                Artistic
                                            </div>
                                            <div className="text-xs text-text-dim">Scenario B</div>
                                        </div>
                                        {scenario === 'B' && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="w-2 h-2 rounded-full bg-safety-orange ml-auto"
                                            />
                                        )}
                                    </button>
                                </motion.div>
                            ) : (
                                /* Collapsed State - Current Scenario Pill */
                                <motion.button
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={() => setIsExpanded(true)}
                                    className="flex items-center gap-3 px-4 py-3"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPrecision ? 'bg-cyber-blue text-deep-black' : 'bg-safety-orange text-deep-black'
                                        }`}>
                                        {isPrecision ? <Crosshair size={20} /> : <Palette size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-semibold text-sm ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'
                                            }`}>
                                            {isPrecision ? 'Precision' : 'Artistic'}
                                        </div>
                                        <div className="text-xs text-text-dim">Tap to switch</div>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`ml-2 transition-transform ${isPrecision ? 'text-cyber-blue/60' : 'text-safety-orange/60'
                                            }`}
                                    />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
