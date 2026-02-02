import { createContext, useContext, useState } from 'react';

const ScenarioContext = createContext();

export function ScenarioProvider({ children }) {
    const [scenario, setScenario] = useState('A'); // 'A' for Precision, 'B' for Artistic

    const toggleScenario = () => {
        setScenario(prev => prev === 'A' ? 'B' : 'A');
    };

    const selectScenario = (s) => {
        setScenario(s);
    };

    return (
        <ScenarioContext.Provider value={{ scenario, toggleScenario, selectScenario }}>
            {children}
        </ScenarioContext.Provider>
    );
}

export function useScenario() {
    const context = useContext(ScenarioContext);
    if (!context) {
        throw new Error('useScenario must be used within a ScenarioProvider');
    }
    return context;
}
