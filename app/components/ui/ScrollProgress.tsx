"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sprout } from "lucide-react";

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const currentDateTime = "2025-04-18 17:29:44";
  const currentUser = "vkhare2909";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const currentProgress = Math.round((window.scrollY / totalHeight) * 100);
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{
          scaleX,
          background: "linear-gradient(to right, #48BB78, #38A169, #F6AD55)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        className="fixed bottom-8 left-8 bg-gray-900/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs border border-green-800/20 z-40"
      >
        <div className="flex items-center space-x-2 text-gray-400">
          <span>{currentUser}</span>
          <span>•</span>
          <div className="flex items-center">
            <div
              className="w-4 h-1 bg-gradient-to-r from-green-500 to-amber-500 rounded-full mr-1"
              style={{
                width: `${Math.max(4, progress / 25)}px`,
              }}
            />
            <span>{progress}%</span>
          </div>
          <span>•</span>
          <span>{currentDateTime}</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        onClick={handleScrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg transition-colors z-40 group"
        aria-label="Scroll to top"
        title={`Scroll to top | ${currentUser} | ${currentDateTime}`}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <Sprout className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </motion.div>
      </motion.button>
    </>
  );
}
