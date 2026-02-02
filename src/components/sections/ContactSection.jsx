import { motion } from 'framer-motion';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function ContactSection() {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <section id="contact" className="relative py-32 md:py-40">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${isPrecision ? 'bg-cyber-blue/5' : 'bg-safety-orange/5'
                    }`} />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                        Ready to Start
                        <br />
                        <span className={isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}>Your Project?</span>
                    </h2>

                    <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12">
                        Let's discuss your vision and find the perfect approach — whether you need precision control or creative flexibility.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="mailto:hello@suburbia.studio"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group flex items-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${isPrecision
                                ? 'bg-cyber-blue text-deep-black'
                                : 'bg-safety-orange text-deep-black'
                                }`}
                        >
                            <Mail size={20} />
                            <span>Send Email</span>
                            <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>

                        <motion.a
                            href="#"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group flex items-center gap-3 px-8 py-4 border font-semibold rounded-xl transition-all duration-300 ${isPrecision
                                ? 'border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10'
                                : 'border-safety-orange/30 text-safety-orange hover:bg-safety-orange/10'
                                }`}
                        >
                            <MessageCircle size={20} />
                            <span>Schedule a Call</span>
                            <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
