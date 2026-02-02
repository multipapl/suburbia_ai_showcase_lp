import { ScenarioProvider } from './context/ScenarioContext';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import StageSection from './components/sections/StageSection';
import ForkSection from './components/sections/ForkSection';
import ContactSection from './components/sections/ContactSection';
import StickyTimeline from './components/ui/StickyTimeline';
import StickyScenarioSwitcher from './components/ui/StickyScenarioSwitcher';
import workflowConfig from './data/workflowConfig.json';

function App() {
    const { stages } = workflowConfig;

    return (
        <ScenarioProvider>
            <Layout>
                <Header />
                <main>
                    <HeroSection />

                    {stages.map((stage) => (
                        stage.isFork ? (
                            <ForkSection key={stage.id} stage={stage} />
                        ) : (
                            <StageSection key={stage.id} stage={stage} />
                        )
                    ))}

                    <ContactSection />
                </main>
                <Footer />
                <StickyTimeline stages={stages} />
                <StickyScenarioSwitcher />
            </Layout>
        </ScenarioProvider>
    );
}

export default App;
