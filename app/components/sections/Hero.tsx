"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import StoreNetworkVisualization from "../3d/GlobeVisualization";
import SparkleButton from "../ui/SparkleButton";
import {
  Package,
  Truck,
  Store,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gradientTextRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Updated current session info
  const currentTime = "2025-07-14 09:03:54";
  const currentUser = "vkhare2909";

  // Real-time metrics from JSON data
  const [storeMetrics, setStoreMetrics] = useState({
    totalStores: 0,
    totalRevenue: 0,
    criticalAlerts: 0,
    predictionAccuracy: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from JSON files
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [storesRes, salesRes, alertsRes, predictionsRes] =
          await Promise.all([
            fetch("/data/stores.json"),
            fetch("/data/sales_history.json"),
            fetch("/data/alerts.json"),
            fetch("/data/predictions.json"),
          ]);

        const [stores, sales, alerts, predictions] = await Promise.all([
          storesRes.json(),
          salesRes.json(),
          alertsRes.json(),
          predictionsRes.json(),
        ]);

        // Calculate real-time metrics
        setStoreMetrics({
          totalStores: stores.stores?.length || 500,
          totalRevenue: sales.metadata?.total_revenue || 12450000000,
          criticalAlerts: alerts.metadata?.critical || 8,
          predictionAccuracy: predictions.metadata?.model_accuracy || 87.6,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to demo data
        setStoreMetrics({
          totalStores: 500,
          totalRevenue: 12450000000,
          criticalAlerts: 8,
          predictionAccuracy: 87.6,
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    const animateText = async () => {
      try {
        if (headlineRef.current && subtitleRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Enhanced text animation with Walmart theme
          tl.fromTo(
            headlineRef.current.querySelectorAll("span"),
            {
              opacity: 0,
              y: 30,
              rotationX: -40,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              scale: 1,
              stagger: 0.15,
              duration: 1.2,
              ease: "power3.out",
            }
          );

          tl.fromTo(
            subtitleRef.current,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }

        // Particle animation for data flow effect
        if (particlesRef.current) {
          gsap.fromTo(
            ".data-particle",
            {
              opacity: 0,
              scale: 0,
              x: (i) => Math.random() * 200 - 100,
              y: (i) => Math.random() * 200 - 100,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 2,
              stagger: 0.1,
              ease: "power2.out",
              delay: 1,
            }
          );
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    animateText();

    // Enhanced parallax effect
    const parallaxEffect = gsap.to(".parallax-bg", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Floating animation for metric cards
    gsap.to(".floating-metric", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

    return () => {
      tl.kill();
      if (parallaxEffect && parallaxEffect.scrollTrigger) {
        parallaxEffect.scrollTrigger.kill();
      }
    };
  }, []);

  // Format revenue for display
  const formatRevenue = (revenue: number) => {
    return `₹${(revenue / 10000000).toFixed(0)}Cr`;
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(30, 41, 59) 50%, rgb(51, 65, 85) 100%)",
      }}
    >
      {/* Walmart-themed background gradients */}
      <div
        className="absolute inset-0 -z-10 parallax-bg"
        style={{ height: "150%" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(0, 76, 145, 0.3) 0%, rgba(0, 76, 145, 0.15) 25%, rgba(255, 194, 32, 0.1) 50%, transparent 80%)",
            height: "150%",
            width: "100%",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at 30% 60%, rgba(255, 194, 32, 0.2) 0%, transparent 60%)",
            height: "150%",
            width: "100%",
          }}
        />
      </div>

      {/* Data particles for visual effect */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="data-particle absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10"
        >
          {/* Updated badge for Walmart theme */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-sm font-medium border border-blue-400/20 inline-flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Inventory Crisis Predictor
            </span>
            <div className="mt-2 text-xs text-gray-400">
              Session: {currentUser} • {currentTime}
            </div>
          </motion.div>

          {/* Updated heading for SmartStock Pro */}
          <div className="mb-6">
            <h1
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight headline-text"
            >
              <span
                ref={gradientTextRef}
                className="walmart-gradient-text block mb-2"
              >
                SmartStock Pro
              </span>
              <span className="text-white inline-block mr-2">Preventing</span>
              <span className="ai-text relative inline-block text-white">
                Inventory Crisis
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 280 8"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M0,5 Q40,0 80,5 T160,5 T240,5"
                    fill="none"
                    stroke="url(#walmart-gradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient
                      id="walmart-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#004c91" />
                      <stop offset="50%" stopColor="#0066cc" />
                      <stop offset="100%" stopColor="#ffc220" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </div>

          {/* Updated subtitle for inventory focus */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-md"
          >
            Advanced AI system that predicts inventory crises 7-14 days ahead,
            preventing stockouts and reducing overstock waste across 500+
            Walmart stores in India.
          </p>

          {/* Updated CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SparkleButton
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Access Dashboard
            </SparkleButton>

            <Link
              href="/predictions"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all duration-300 flex items-center justify-center group"
            >
              View Predictions
              <TrendingUp className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </div>

          {/* Updated feature cards for retail/inventory theme */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-blue-700/30 rounded-xl p-4 flex flex-col items-center text-center hover:bg-blue-900/20 transition-colors duration-300 hover:scale-105 transform">
              <Package className="text-blue-400 mb-2" size={24} />
              <h3 className="text-sm font-medium text-white">
                Inventory Intelligence
              </h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-amber-700/30 rounded-xl p-4 flex flex-col items-center text-center hover:bg-amber-900/20 transition-colors duration-300 hover:scale-105 transform">
              <BarChart3 className="text-amber-400 mb-2" size={24} />
              <h3 className="text-sm font-medium text-white">
                Demand Forecasting
              </h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-green-700/30 rounded-xl p-4 flex flex-col items-center text-center hover:bg-green-900/20 transition-colors duration-300 hover:scale-105 transform">
              <Truck className="text-green-400 mb-2" size={24} />
              <h3 className="text-sm font-medium text-white">
                Supply Chain Optimization
              </h3>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-orange-700/30 rounded-xl p-4 flex flex-col items-center text-center hover:bg-orange-900/20 transition-colors duration-300 hover:scale-105 transform">
              <Target className="text-orange-400 mb-2" size={24} />
              <h3 className="text-sm font-medium text-white">Cost Reduction</h3>
            </div>
          </div>

          {/* Real-time savings indicator */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-4 border border-green-500/20"
            >
              <div className="flex items-center gap-3">
                <Zap className="text-yellow-400 h-6 w-6" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">
                    Real-time Impact
                  </p>
                  <p className="text-white text-lg font-bold">
                    ₹45+ Crores Annual Savings Potential
                  </p>
                  <p className="text-gray-400 text-xs">
                    Based on current inventory optimization
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 3D Store Network Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative h-[600px] w-full z-0"
        >
          <div className="absolute inset-0">
            <StoreNetworkVisualization />
          </div>

          {/* Real-time metric overlays */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="floating-metric absolute top-[20%] left-[20%] bg-gray-800/80 backdrop-blur-md border border-blue-500/30 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Store className="text-blue-400" size={16} />
              <div>
                <div className="text-xs font-medium text-gray-300">
                  Stores Connected
                </div>
                <div className="text-sm font-bold text-white">
                  {isLoading ? "Loading..." : `${storeMetrics.totalStores}+`}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="floating-metric absolute bottom-[30%] right-[15%] bg-gray-800/80 backdrop-blur-md border border-green-500/30 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-400" size={16} />
              <div>
                <div className="text-xs font-medium text-gray-300">
                  Monthly Revenue
                </div>
                <div className="text-sm font-bold text-white">
                  {isLoading
                    ? "Loading..."
                    : formatRevenue(storeMetrics.totalRevenue)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="floating-metric absolute top-[60%] left-[10%] bg-gray-800/80 backdrop-blur-md border border-red-500/30 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={16} />
              <div>
                <div className="text-xs font-medium text-gray-300">
                  Critical Alerts
                </div>
                <div className="text-sm font-bold text-white">
                  {isLoading ? "..." : storeMetrics.criticalAlerts}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="floating-metric absolute bottom-[10%] left-[40%] bg-gray-800/80 backdrop-blur-md border border-amber-500/30 p-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="text-amber-400" size={16} />
              <div>
                <div className="text-xs font-medium text-gray-300">
                  AI Accuracy
                </div>
                <div className="text-sm font-bold text-white">
                  {isLoading ? "..." : `${storeMetrics.predictionAccuracy}%`}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Updated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.6,
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <a
            href="#dashboard"
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm mb-2">Explore Dashboard</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Updated styles for Walmart theme */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100px) translateY(-20px);
            opacity: 0;
          }
        }

        /* Walmart gradient text styles */
        .walmart-gradient-text {
          background: linear-gradient(
            135deg,
            #004c91 0%,
            #0066cc 50%,
            #ffc220 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        .data-particle {
          animation: dataFlow 4s infinite linear;
          animation-delay: calc(var(--i) * 0.5s);
        }

        .floating-metric {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
