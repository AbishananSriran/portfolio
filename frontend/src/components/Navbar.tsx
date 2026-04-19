import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 backdrop-blur-xl bg-background/70 border-b border-border/30">

      {/* LEFT */}
      <div className="flex items-center gap-3 text-foreground">
        <a href="#" className="text-gradient text-base sm:text-lg md:text-xl font-semibold tracking-tight">
          Abishanan Sriranjan
        </a>

        <div className="hidden md:block h-5 w-px bg-white/50" />

        <a href="#" className="hidden md:block text-sm md:text-lg text-muted-foreground hover:text-foreground">
          abi.gg
        </a>
      </div>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
        <a href="#about" className={`hover:text-foreground transition-colors ${activeSection === "about" ? "text-foreground" : "text-muted-foreground"}`}>About</a>
        <a href="#experience" className={`hover:text-foreground transition-colors ${activeSection === "experience" ? "text-foreground" : "text-muted-foreground"}`}>Experience</a>
        <a href="#work" className={`hover:text-foreground transition-colors ${activeSection === "work" ? "text-foreground" : "text-muted-foreground"}`}>Work</a>
        <a href="#contact" className={`hover:text-foreground transition-colors ${activeSection === "contact" ? "text-foreground" : "text-muted-foreground"}`}>Contact</a>

        <div className="h-5 w-px bg-white/50" />

        <a 
          href="https://github.com/AbishananSriran" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-foreground transition-colors text-lg"
        >
          <FaGithub />
        </a>
        <a 
          href="https://linkedin.com/in/abishanan-sriran" 
          target="_blank"
          rel="noopener noreferrer" 
          className="hover:text-foreground transition-colors text-lg"
        >
          <FaLinkedin />
        </a>
      </div>

      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </button>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full left-0 w-full backdrop-blur-xl bg-background/95 border-b border-border/30 flex flex-col items-center gap-4 py-6 text-muted-foreground md:hidden"
          >
            <a 
              className={`hover:text-foreground transition-colors ${activeSection === "about" ? "text-foreground" : "text-muted-foreground"}`} 
              href="#about" onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              className={`hover:text-foreground transition-colors ${activeSection === "experience" ? "text-foreground" : "text-muted-foreground"}`} 
              href="#experience" onClick={() => setIsOpen(false)}
            >
              Experience
            </a>
            <a 
              className={`hover:text-foreground transition-colors ${activeSection === "work" ? "text-foreground" : "text-muted-foreground"}`} 
              href="#work" onClick={() => setIsOpen(false)}
            >
              Work
            </a>
            <a 
              className={`hover:text-foreground transition-colors ${activeSection === "contact" ? "text-foreground" : "text-muted-foreground"}`} 
              href="#contact" onClick={() => setIsOpen(false)}
            >
              Contact
            </a>

            <div className="flex gap-4 text-lg pt-2">
              <a 
                href="https://github.com/AbishananSriran" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-foreground transition-colors"
              >
                <FaGithub />
              </a>
              <a 
                href="https://linkedin.com/in/abishanan-sriran" 
                target="_blank"
                rel="noopener noreferrer" 
                className="hover:text-foreground transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;