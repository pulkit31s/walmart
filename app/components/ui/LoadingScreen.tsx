"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hyperspeed, { hyperspeedPresets } from "./Hyperspeed";
import { Sprout } from "lucide-react";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hyperspeedActive, setHyperspeedActive] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const currentDateTime = "2025-04-18 17:26:54";
  const currentUser = "vkhare2909";

  useEffect(() => {
    const hyperspeedTimer = setTimeout(() => {
      setHyperspeedActive(true);
    }, 300);

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(hyperspeedTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            {hyperspeedActive && (
              <Hyperspeed
                effectOptions={{
                  onSpeedUp: () => {},
                  onSlowDown: () => {},
                  distortion: "turbulentDistortion",
                  length: 400,
                  roadWidth: 10,
                  islandWidth: 2,
                  lanesPerRoad: 4,
                  fov: 90,
                  fovSpeedUp: 150,
                  speedUp: 2,
                  carLightsFade: 0.4,
                  totalSideLightSticks: 20,
                  lightPairsPerRoadWay: 40,
                  shoulderLinesWidthPercentage: 0.05,
                  brokenLinesWidthPercentage: 0.1,
                  brokenLinesLengthPercentage: 0.5,
                  lightStickWidth: [0.12, 0.5],
                  lightStickHeight: [1.3, 1.7],
                  movingAwaySpeed: [60, 80],
                  movingCloserSpeed: [-120, -160],
                  carLightsLength: [400 * 0.03, 400 * 0.2],
                  carLightsRadius: [0.05, 0.14],
                  carWidthPercentage: [0.3, 0.5],
                  carShiftX: [-0.8, 0.8],
                  carFloorSeparation: [0, 5],
                  colors: {
                    roadColor: 0x081008,
                    islandColor: 0x0a100a,
                    background: 0x000000,
                    shoulderLines: 0xffffff,
                    brokenLines: 0xffffff,
                    leftCars: [0x48bb78, 0x38a169, 0x2f855a],
                    rightCars: [0xf6ad55, 0xed8936, 0xdd6b20],
                    sticks: 0x48bb78,
                  },
                }}
              />
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" className="absolute inset-0">
                <pattern
                  id="grow-pattern"
                  patternUnits="userSpaceOnUse"
                  width="60"
                  height="60"
                  patternTransform="rotate(45)"
                >
                  <path
                    d="M30,0 Q15,30 30,60 M30,0 Q45,30 30,60"
                    fill="none"
                    stroke="#48BB78"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M30,20 Q40,30 30,40"
                    fill="none"
                    stroke="#48BB78"
                    strokeWidth="0.3"
                  />
                  <path
                    d="M30,20 Q20,30 30,40"
                    fill="none"
                    stroke="#48BB78"
                    strokeWidth="0.3"
                  />
                </pattern>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#grow-pattern)"
                />
              </svg>
            </div>
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.2,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
          >
            <div className="p-8 rounded-2xl backdrop-blur-md bg-black/30 border border-green-800/20 shadow-2xl">
              <motion.div
                ref={logoRef}
                className="relative flex flex-col items-center"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sprout className="h-8 w-8 text-green-500" />
                  </motion.div>

                  <motion.h1
                    className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-amber-400"
                    animate={{
                      backgroundPosition: ["0% center", "100% center"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{
                      backgroundSize: "200% auto",
                    }}
                  >
                    Digital Ardhti
                  </motion.h1>
                </div>

                <motion.div
                  className="absolute inset-0 blur-xl opacity-50 bg-gradient-to-r from-green-400 via-green-500 to-amber-400 rounded-full"
                  animate={{
                    backgroundPosition: ["0% center", "100% center"],
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                    zIndex: -1,
                  }}
                />
              </motion.div>

              <div className="mt-6 relative">
                <div className="h-2 w-full rounded-full bg-gray-800/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-green-400 to-amber-400 rounded-full relative"
                    initial={{ width: "5%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      className="absolute -top-1 left-1/4"
                      animate={{
                        opacity: [0, 1],
                        scale: [0, 1],
                        rotate: [-10, 0],
                      }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <Sprout className="h-3 w-3 text-green-200" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 left-1/2"
                      animate={{
                        opacity: [0, 1],
                        scale: [0, 1],
                        rotate: [10, 0],
                      }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                    >
                      <Sprout className="h-3 w-3 text-green-200" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 left-3/4"
                      animate={{
                        opacity: [0, 1],
                        scale: [0, 1],
                        rotate: [-5, 0],
                      }}
                      transition={{ delay: 1.8, duration: 0.4 }}
                    >
                      <Sprout className="h-3 w-3 text-green-200" />
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute top-0 left-0 h-2 w-12 bg-white blur-md"
                  animate={{
                    x: ["-10%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    times: [0, 0.8, 1],
                  }}
                />
              </div>

              <motion.p
                className="mt-4 text-center text-sm text-gray-400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Preparing your agricultural dashboard...
              </motion.p>

              <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <span>{currentUser}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <span>{currentDateTime}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
