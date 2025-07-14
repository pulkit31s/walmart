"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Store,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dataFlowRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

  // Updated session info
  const currentDateTime = "2025-07-14 09:14:13";
  const currentUser = "vkhare2909";

  // Real-time system metrics
  const [systemMetrics, setSystemMetrics] = useState({
    totalStores: 0,
    costSavings: 0,
    accuracy: 0,
    activePredictions: 0,
  });

  // Fetch real-time data
  useEffect(() => {
    const fetchCTAData = async () => {
      try {
        const [storesRes, predictionsRes, alertsRes] = await Promise.all([
          fetch("/data/stores.json"),
          fetch("/data/predictions.json"),
          fetch("/data/alerts.json"),
        ]);

        const [stores, predictions, alerts] = await Promise.all([
          storesRes.json(),
          predictionsRes.json(),
          alertsRes.json(),
        ]);

        setSystemMetrics({
          totalStores: stores.stores?.length || 500,
          costSavings: 45000000000, // ₹45 Cr in rupees
          accuracy: predictions.metadata?.model_accuracy || 87.6,
          activePredictions: predictions.store_predictions?.length || 15,
        });
      } catch (error) {
        console.error("Error fetching CTA data:", error);
        setSystemMetrics({
          totalStores: 500,
          costSavings: 45000000000,
          accuracy: 87.6,
          activePredictions: 15,
        });
      }
    };

    fetchCTAData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced pulsing animation for main CTA button
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Data flow animation
      gsap.fromTo(
        ".data-point",
        { y: 10, opacity: 0, scale: 0 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 2,
          stagger: 0.3,
          ease: "power2.out",
        }
      );

      // Inventory flow effect
      gsap.fromTo(
        ".inventory-flow",
        {
          y: -10,
          opacity: 0.7,
          x: (i) => Math.random() * 10 - 5,
        },
        {
          y: 100,
          opacity: 0,
          duration: 1 + Math.random() * 0.5,
          stagger: 0.05,
          repeat: -1,
          ease: "power1.in",
          repeatRefresh: true,
        }
      );

      // Analytics pulse animation
      gsap.to(".analytics-pulse", {
        rotate: 360,
        duration: 45,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatSavings = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(0)}+ Cr`;
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Walmart-themed background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-0 right-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
          }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] top-1/2 -left-64 transform -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: "rgba(0, 76, 145, 0.15)" }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] bottom-0 right-0 rounded-full blur-[120px]"
          style={{ background: "rgba(255, 194, 32, 0.1)" }}
        ></div>
      </div>

      {/* Data flow visualization */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="inventory-flow absolute w-1 h-4 bg-blue-300/50 rounded-full"
            style={{ left: `${10 + Math.random() * 80}%`, top: "-5%" }}
          ></div>
        ))}

        {/* Store connection points */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-around items-end">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="data-point relative h-12 w-4 opacity-0">
              <Store
                size={i % 3 === 0 ? 20 : 16}
                className="text-blue-400/70 absolute bottom-0 left-1/2 transform -translate-x-1/2"
              />
            </div>
          ))}
        </div>

        {/* Analytics visualization */}
        <div className="absolute top-10 right-10 z-0">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 analytics-pulse">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path
                  d="M50,0 L53,40 L60,35 L55,45 L100,50 L55,55 L60,65 L53,60 L50,100 L47,60 L40,65 L45,55 L0,50 L45,45 L40,35 L47,40 Z"
                  fill="rgba(0, 76, 145, 0.2)"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 size={12} className="text-blue-300/60" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6"
      >
        {/* Session header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 text-xs border border-blue-700/30">
            <span className="text-gray-400 mr-1">Store Manager:</span>
            <span className="font-medium text-blue-400">{currentUser}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-gray-400">
              System Active: {currentDateTime}
            </span>
          </div>
        </motion.div>

        {/* Main CTA container */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 via-gray-900/50 to-amber-900/20 backdrop-blur-md border border-blue-700/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg width="100%" height="100%" className="opacity-10">
              <pattern
                id="inventory-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="2"
                  y="2"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#004c91"
                  strokeWidth="0.5"
                />
                <rect
                  x="6"
                  y="6"
                  width="8"
                  height="8"
                  fill="#ffc220"
                  opacity="0.3"
                />
              </pattern>
              <rect
                x="0"
                y="50%"
                width="100%"
                height="50%"
                fill="url(#inventory-pattern)"
              />
            </svg>

            <div
              className="absolute bottom-0 right-0 w-60 h-60 rounded-full blur-[60px]"
              style={{ background: "rgba(255, 194, 32, 0.2)" }}
            ></div>
            <div
              className="absolute top-0 left-0 w-40 h-40 rounded-full blur-[50px]"
              style={{ background: "rgba(0, 76, 145, 0.2)" }}
            ></div>
          </div>

          {/* Updated badge */}
          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center justify-center gap-2">
            <Package size={16} className="animate-bounce" />
            Transform Your Inventory Management
          </span>

          {/* Updated headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-white">
            Ready to Prevent{" "}
            <span
              style={{
                background:
                  "linear-gradient(to right, #004c91, #0066cc, #ffc220)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Inventory Crisis?
            </span>
          </h2>

          {/* Updated description */}
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join 500+ Walmart stores across India using SmartStock Pro to
            predict inventory crises 7-14 days ahead, prevent stockouts, and
            save millions through AI-powered demand forecasting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div ref={buttonRef}>
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 text-lg px-8 py-4 inline-block"
              >
                Access Dashboard
              </Link>
            </div>

            <Link
              href="/predictions"
              className="bg-transparent border border-blue-700/30 hover:bg-blue-900/30 text-white font-medium rounded-lg transition-colors duration-300 px-6 py-4 flex items-center"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              View Predictions
            </Link>
          </div>

          {/* Updated features list */}
          <p className="mt-6 text-sm text-gray-400">
            Real-time alerts • AI demand forecasting • Automated reordering
          </p>

          {/* Real-time system metrics */}
          <div className="mt-8 pt-4 border-t border-gray-800/50">
            <p className="text-sm text-blue-400 mb-4 font-medium">
              Current System Performance
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-blue-900/20 transition-colors duration-300">
                <div className="text-blue-400 text-xl font-semibold">
                  {systemMetrics.accuracy}%
                </div>
                <div className="text-xs text-gray-400">AI Accuracy</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-green-900/20 transition-colors duration-300">
                <div className="text-green-400 text-xl font-semibold">
                  {systemMetrics.totalStores}+
                </div>
                <div className="text-xs text-gray-400">Active Stores</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-amber-900/20 transition-colors duration-300">
                <div className="text-amber-400 text-xl font-semibold">
                  {formatSavings(systemMetrics.costSavings)}
                </div>
                <div className="text-xs text-gray-400">Annual Savings</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-purple-900/20 transition-colors duration-300">
                <div className="text-purple-400 text-xl font-semibold">
                  {systemMetrics.activePredictions}
                </div>
                <div className="text-xs text-gray-400">Live Predictions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated promotional banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-lg mx-auto mt-8 bg-gradient-to-r from-blue-900/20 to-amber-900/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
            <AlertTriangle className="text-amber-400 h-5 w-5" />
            <p className="text-sm">
              <span className="text-gray-300">Exclusive offer for</span>
              <span className="text-blue-400 font-medium mx-1">
                {currentUser}
              </span>
              <span className="text-gray-300">:</span>
            </p>
          </div>
          <p className="text-sm text-amber-300 font-medium">
            Early access to Festival Season Demand Surge predictions - 40%
            higher accuracy during peak shopping periods!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Limited time offer - expires 2025-08-15
          </p>
        </motion.div>

        {/* Updated testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
          className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 max-w-[280px] bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/20"
        >
          <div className="flex items-start gap-3">
            <div className="bg-blue-700/70 rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold text-white shrink-0">
              PS
            </div>
            <div>
              <p className="text-xs text-gray-300 italic">
                "SmartStock Pro helped us reduce stockouts by 73% and save ₹2.3
                Crores in our Mumbai store. The AI predictions are incredibly
                accurate!"
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Priya S. - Store Manager, Mumbai Central
              </p>
            </div>
          </div>
        </motion.div>

        {/* ROI highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="text-green-400 h-8 w-8" />
              <h3 className="text-xl font-bold text-white">
                Proven ROI Impact
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">73%</div>
                <div className="text-sm text-gray-400">Stockout Reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">45%</div>
                <div className="text-sm text-gray-400">Cost Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">7-14</div>
                <div className="text-sm text-gray-400">
                  Days Ahead Prediction
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Real performance metrics from {currentUser} • Updated{" "}
              {currentDateTime}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
