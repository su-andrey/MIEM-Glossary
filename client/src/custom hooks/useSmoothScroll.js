import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const useSmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        lerp: 0.1,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
};

export default useSmoothScroll;