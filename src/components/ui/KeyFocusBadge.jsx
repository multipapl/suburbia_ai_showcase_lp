import { useScenario } from '../../context/ScenarioContext';

export default function KeyFocusBadge({ label }) {
    const { scenario } = useScenario();
    const isPrecision = scenario === 'A';

    return (
        <span
            className={`inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium ${isPrecision
                    ? 'bg-cyber-blue/10 border-cyber-blue/20 text-cyber-blue'
                    : 'bg-safety-orange/10 border-safety-orange/20 text-safety-orange'
                }`}
        >
            {label}
        </span>
    );
}
