import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function Checkpoint({ label }) {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${isPrecision
                    ? 'border-cyber-blue/40 bg-cyber-blue/10'
                    : 'border-safety-orange/40 bg-safety-orange/10'
                }`}
        >
            <Flag className={`w-4 h-4 ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`} />
            <span className={`text-sm font-medium ${isPrecision ? 'text-cyber-blue' : 'text-safety-orange'}`}>{label}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isPrecision ? 'bg-cyber-blue' : 'bg-safety-orange'}`} />
        </motion.div>
    );
}
