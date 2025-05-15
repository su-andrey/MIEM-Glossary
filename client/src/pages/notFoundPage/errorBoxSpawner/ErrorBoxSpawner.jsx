import { useEffect, useState, useRef } from 'react';
import ErrorBox from './../errorBox/ErrorBox';

const ErrorBoxSpawner = () => {
    const [boxes, setBoxes] = useState([]);
    const idCounter = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setBoxes(prev => {
            const newBoxes = [...prev];

            if (newBoxes.length >= 20) {
            const first = { ...newBoxes[0], isExiting: true };
            newBoxes[0] = first;
            }

            const top = `${Math.random() * 80}%`;
            const left = `${Math.random() * 80}%`;

            newBoxes.push({
            id: idCounter.current++,
            top,
            left,
            isExiting: false,
            });

            return newBoxes;
        });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const handleAnimationEnd = (id) => {
        setBoxes(prev => prev.filter(box => !(box.id === id && box.isExiting)));
    };

    return (
        <>
        {boxes.map(box => (
            <div
            key={box.id}
            style={{
                position: 'absolute',
                top: box.top,
                left: box.left,
                pointerEvents: 'none',
            }}
            >
            <ErrorBox
                isExiting={box.isExiting}
                onAnimationEnd={() => handleAnimationEnd(box.id)}
            />
            </div>
        ))}
        </>
    );
};

export default ErrorBoxSpawner;