import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    const navItems = [
        { label: 'Workflow', href: '#stage-1' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${isPrecision
                            ? 'bg-gradient-to-br from-cyber-blue to-cyan-600'
                            : 'bg-gradient-to-br from-safety-orange to-orange-600'
                            }`}>
                            <span className="text-deep-black font-bold text-lg">S</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-text-primary font-semibold text-lg tracking-tight">Suburbia</span>
                            <span className="text-text-muted font-light text-lg ml-1">Studio</span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`text-text-muted transition-colors duration-300 text-sm font-medium uppercase tracking-wider ${isPrecision ? 'hover:text-cyber-blue' : 'hover:text-safety-orange'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className={`px-5 py-2.5 border rounded-lg transition-all duration-300 text-sm font-medium ${isPrecision
                                ? 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20'
                                : 'bg-safety-orange/10 border-safety-orange/30 text-safety-orange hover:bg-safety-orange/20'
                                }`}
                        >
                            Start Project
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-dark border-t border-white/5"
                    >
                        <nav className="flex flex-col px-4 py-4 gap-2">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="py-3 px-4 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsMenuOpen(false)}
                                className={`mt-2 py-3 px-4 border rounded-lg text-center font-medium ${isPrecision
                                    ? 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue'
                                    : 'bg-safety-orange/10 border-safety-orange/30 text-safety-orange'
                                    }`}
                            >
                                Start Project
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
