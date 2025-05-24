import { useEffect, useState } from "react";
import Loader1 from "../../components/UI/loader1/Loader1.jsx";

const AppLoaderWrapper = ({ children }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const MIN_LOAD_TIME = 1000;
        const start = Date.now();

        const onLoad = () => {
        const elapsed = Date.now() - start;
        const delay = Math.max(MIN_LOAD_TIME - elapsed, 0);
        setTimeout(() => setReady(true), delay);
        };

        if (document.readyState === "complete") {
        onLoad();
        } else {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
        }
    }, []);

    return ready ? children : <Loader1 />;
};

export default AppLoaderWrapper;