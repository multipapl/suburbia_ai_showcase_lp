import { useScenario } from '../../context/ScenarioContext';

export default function Layout({ children }) {
    const { scenario } = useScenario();

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${scenario === 'A' ? 'selection:bg-cyber-blue/30' : 'selection:bg-safety-orange/30'
                }`}
        >
            {children}
        </div>
    );
}
