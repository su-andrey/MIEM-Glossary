import {motion} from "framer-motion"
const Line = () => {
    return (<motion.div
                layoutId="activeItem"
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                width: "100%",
                height: "calc(0.05*var(--index))",
                position: "absolute",
                bottom: "calc(-0.1*var(--index))",
                backgroundColor: "white",
                transformOrigin: "left",
                }}
            />
);}

export default Line;