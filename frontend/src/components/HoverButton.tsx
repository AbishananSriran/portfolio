import { motion } from "framer-motion";

export default function HoverButton({ children, onClick, ariaLabel, ...props }) {
    const { type, className } = props;
    const linkClassName = className || "";

    return (
        <motion.button
            type={type || "button"}
            onClick={onClick}
            className={`link-chip flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 ${linkClassName}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-label={ariaLabel}
        >  
            {children}
        </motion.button>
    );
}