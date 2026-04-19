import { motion } from "framer-motion";

export default function LinkChip({ href, children, ...props }) {
  const { className } = props;
  const linkClassName = className || "";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-chip flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 ${linkClassName}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.a>
  );
}