import { Linkedin, Instagram, Globe } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function Footer() {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    const socialLinks = [
        { icon: Instagram, href: 'https://www.instagram.com/suburbiastudio/', label: 'Instagram' },
        { icon: Linkedin, href: 'https://www.linkedin.com/company/suburbia-studio/', label: 'LinkedIn' },
        { icon: Globe, href: 'https://suburbiastudio.com/', label: 'Website' },
    ];


    return (
        <footer className="bg-surface border-t border-white/5 py-12 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isPrecision
                                ? 'bg-gradient-to-br from-cyber-blue to-cyan-600'
                                : 'bg-gradient-to-br from-safety-orange to-orange-600'
                                }`}>
                                <span className="text-deep-black font-bold text-sm">S</span>
                            </div>
                            <span className="text-text-primary font-semibold">Suburbia Studio</span>
                        </div>
                        <p className="text-text-dim text-sm">
                            © 2026 Suburbia Studio. All rights reserved.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className={`p-3 rounded-lg border border-white/10 text-text-muted transition-all duration-300 ${isPrecision
                                    ? 'hover:text-cyber-blue hover:border-cyber-blue/30'
                                    : 'hover:text-safety-orange hover:border-safety-orange/30'
                                    }`}
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
