import { useState, useEffect, useCallback, useRef } from 'react';
import workflowConfig from '../data/workflowConfig.json';

export function useScrollProgress() {
    const [activeStage, setActiveStage] = useState(1);
    const [stageProgress, setStageProgress] = useState(0); // 0-100 within current stage
    const [globalProgress, setGlobalProgress] = useState(0);

    const calculateProgress = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
        setGlobalProgress(Math.min(scrollProgress * 100, 100));

        const stages = workflowConfig.stages;
        const viewportTrigger = scrollTop + window.innerHeight * 0.35; // 35% from top

        let currentStage = stages[0]?.id || 1;
        let currentProgress = 0;

        // Build a map of stage positions
        const stagePositions = [];
        for (const stage of stages) {
            const el = document.getElementById(`stage-${stage.id}`);
            if (el) {
                const rect = el.getBoundingClientRect();
                stagePositions.push({
                    id: stage.id,
                    top: scrollTop + rect.top,
                    bottom: scrollTop + rect.bottom,
                    height: rect.height
                });
            }
        }

        // Find active stage and calculate progress within it
        for (let i = stagePositions.length - 1; i >= 0; i--) {
            const pos = stagePositions[i];

            if (viewportTrigger >= pos.top) {
                currentStage = pos.id;

                // Calculate progress within this stage
                const progressWithinStage = (viewportTrigger - pos.top) / pos.height;
                currentProgress = Math.min(Math.max(progressWithinStage * 100, 0), 100);
                break;
            }
        }

        setActiveStage(currentStage);
        setStageProgress(currentProgress);
    }, []);

    useEffect(() => {
        // Throttle scroll handler for performance
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    calculateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', calculateProgress, { passive: true });

        // Initial calculation after DOM ready
        const timer = setTimeout(calculateProgress, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', calculateProgress);
            clearTimeout(timer);
        };
    }, [calculateProgress]);

    const scrollToStage = useCallback((stageId) => {
        const element = document.getElementById(`stage-${stageId}`);
        if (element) {
            const headerOffset = 100; // Account for fixed header + some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    return { activeStage, stageProgress, globalProgress, scrollToStage };
}
