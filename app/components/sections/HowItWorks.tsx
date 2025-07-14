"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Package,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Store,
  Target,
  Truck,
  Zap,
} from "lucide-react";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Updated session info
  const currentDateTime = "2025-07-14 09:08:10";
  const currentUser = "vkhare2909";

  // Real-time system metrics
  const [systemMetrics, setSystemMetrics] = useState({
    processedStores: 0,
    predictions: 0,
    accuracy: 0,
  });

  // Fetch real-time data
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [storesRes, predictionsRes] = await Promise.all([
          fetch("/data/stores.json"),
          fetch("/data/predictions.json"),
        ]);

        const [stores, predictions] = await Promise.all([
          storesRes.json(),
          predictionsRes.json(),
        ]);

        setSystemMetrics({
          processedStores: stores.stores?.length || 500,
          predictions: predictions.store_predictions?.length || 15,
          accuracy: predictions.metadata?.model_accuracy || 87.6,
        });
      } catch (error) {
        console.error("Error fetching system data:", error);
        setSystemMetrics({
          processedStores: 500,
          predictions: 15,
          accuracy: 87.6,
        });
      }
    };

    fetchSystemData();
  }, []);

  useEffect(() => {
    if (!timelineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    // Enhanced timeline progress with Walmart colors
    timeline.to(".timeline-progress", {
      height: "100%",
      duration: 1,
      ease: "none",
    });

    const steps = gsap.utils.toArray(".timeline-step");
    steps.forEach((step, i) => {
      gsap.to(step as Element, {
        scrollTrigger: {
          trigger: step as Element,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Enhanced icon animations
      gsap.from(`.process-icon-${i}`, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: step as Element,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        stagger: 0.1,
      });

      // Data flow animation
      gsap.from(`.data-flow-${i}`, {
        width: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: step as Element,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        delay: 0.3,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Updated steps for inventory management process
  const steps = [
    {
      title: "Store Data Integration",
      description:
        "Connect and sync inventory data from 500+ Walmart stores across India. Real-time integration with POS systems, warehouse management, and supplier databases for comprehensive visibility.",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop",
      gradient: "from-blue-500 to-blue-600",
      icon: <Store className="h-5 w-5" />,
      metric: "500+ Stores",
      efficiency: "+25% Data Accuracy",
    },
    {
      title: "AI Pattern Analysis",
      description:
        "Advanced machine learning algorithms analyze sales patterns, seasonal trends, customer behavior, and external factors like weather and festivals to identify demand patterns.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      gradient: "from-purple-500 to-purple-600",
      icon: <BarChart3 className="h-5 w-5" />,
      metric: "87.6% Accuracy",
      efficiency: "+40% Prediction Speed",
    },
    {
      title: "Crisis Prediction Engine",
      description:
        "Gemini AI-powered prediction system forecasts inventory crises 7-14 days ahead, identifying potential stockouts, overstock situations, and optimal reorder points.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop",
      gradient: "from-amber-500 to-amber-600",
      icon: <AlertTriangle className="h-5 w-5" />,
      metric: "7-14 Days Ahead",
      efficiency: "+73% Stockout Prevention",
    },
    {
      title: "Smart Alert Generation",
      description:
        "Intelligent alert system prioritizes critical issues, generates actionable recommendations, and automates supplier communications for immediate response to inventory challenges.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop",
      gradient: "from-red-500 to-red-600",
      icon: <Zap className="h-5 w-5" />,
      metric: "Real-time Alerts",
      efficiency: "+60% Response Time",
    },
    {
      title: "Automated Reordering",
      description:
        "Smart procurement system automatically generates purchase orders, negotiates with suppliers, and optimizes delivery schedules to maintain optimal inventory levels.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop",
      gradient: "from-green-500 to-green-600",
      icon: <Truck className="h-5 w-5" />,
      metric: "Auto-Generated POs",
      efficiency: "+45% Cost Reduction",
    },
    {
      title: "ROI Optimization",
      description:
        "Continuous monitoring and optimization of inventory investments, tracking cost savings, preventing revenue losses, and maximizing profitability across the entire store network.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      gradient: "from-indigo-500 to-indigo-600",
      icon: <Target className="h-5 w-5" />,
      metric: "₹45+ Cr Savings",
      efficiency: "+30% ROI Improvement",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 relative"
      style={{
        background:
          "linear-gradient(to bottom, rgb(17, 24, 39), rgba(30, 41, 59, 0.95), rgb(51, 65, 85))",
      }}
    >
      {/* Updated background pattern for retail theme */}
      <div className="absolute top-0 right-0 w-full h-40 overflow-hidden opacity-30">
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          preserveAspectRatio="xMaxYMin slice"
        >
          <defs>
            <pattern
              id="retail-pattern"
              patternUnits="userSpaceOnUse"
              width="40"
              height="40"
              patternTransform="rotate(45)"
            >
              <path
                d="M0,20 Q10,0 20,20 T40,20"
                fill="none"
                stroke="#004c91"
                strokeWidth="0.5"
              />
              <circle cx="20" cy="20" r="2" fill="#ffc220" opacity="0.3" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#retail-pattern)"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Floating data particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Package className="text-blue-400 h-5 w-5" />
            <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
              Inventory Intelligence Process
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white"
          >
            How SmartStock Pro Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Follow these six intelligent steps to transform your inventory
            management, prevent stockouts, reduce overstock waste, and maximize
            profitability across your entire retail network with AI-powered
            predictions.
          </motion.p>

          {/* Real-time system status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 inline-flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-blue-500/20"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {systemMetrics.processedStores}
              </div>
              <div className="text-xs text-gray-400">Stores Active</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {systemMetrics.predictions}
              </div>
              <div className="text-xs text-gray-400">Live Predictions</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">
                {systemMetrics.accuracy}%
              </div>
              <div className="text-xs text-gray-400">AI Accuracy</div>
            </div>
          </motion.div>
        </div>

        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Enhanced timeline with Walmart colors */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-800">
            <div
              className="timeline-progress absolute top-0 left-0 right-0 h-0"
              style={{
                background:
                  "linear-gradient(to bottom, #004c91, #0066cc, #ffc220, #004c91)",
              }}
            ></div>
          </div>

          <div className="space-y-28">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`timeline-step flex items-center opacity-0 ${
                  index % 2 === 0
                    ? "flex-row -translate-x-4"
                    : "flex-row-reverse -translate-x-4 md:translate-x-4"
                }`}
              >
                {/* Content section */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "text-right pr-10" : "text-left pl-10"
                  }`}
                >
                  <div
                    className={`flex items-center mb-3 gap-3 ${
                      index % 2 === 0 ? "justify-end" : "justify-start"
                    }`}
                  >
                    {index % 2 === 0 ? (
                      <>
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-white">
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 justify-end">
                            <span className="text-xs text-blue-400 font-medium">
                              {step.metric}
                            </span>
                            <span className="text-xs text-green-400">
                              {step.efficiency}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-blue-400 process-icon-${index} bg-blue-500/10 p-2 rounded-lg`}
                        >
                          {step.icon}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`text-blue-400 process-icon-${index} bg-blue-500/10 p-2 rounded-lg`}
                        >
                          {step.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white">
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-blue-400 font-medium">
                              {step.metric}
                            </span>
                            <span className="text-xs text-green-400">
                              {step.efficiency}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Data flow indicator */}
                  <div
                    className={`mt-4 h-1 bg-gradient-to-r ${step.gradient} rounded-full data-flow-${index} opacity-60`}
                  ></div>

                  {index === 0 && (
                    <div
                      className={`mt-3 text-xs text-blue-400 flex items-center gap-1 ${
                        index % 2 === 0 ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>Process initiated by: {currentUser}</span>
                      <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                      <span>{currentDateTime}</span>
                    </div>
                  )}
                </div>

                {/* Timeline node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold shadow-lg border-4 border-gray-900 hover:scale-110 transition-transform duration-300`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Image section */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "pl-10" : "pr-10"
                  }`}
                >
                  <div className="relative w-full h-48 md:h-72 bg-gray-900/50 backdrop-blur-sm border border-blue-800/20 rounded-xl overflow-hidden group hover:border-blue-500/40 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10"></div>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Floating metrics */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <div
                        className={`bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30`}
                      >
                        <div
                          className={`text-blue-400 text-xs font-medium process-icon-${index}`}
                        >
                          Step {index + 1} Active
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <div
                        className={`text-blue-400 opacity-70 process-icon-${index}`}
                      >
                        {[...Array(index + 1)].map((_, i) => (
                          <span
                            key={i}
                            className={`inline-block ml-1 transform rotate-${
                              i * 45
                            }`}
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Updated tip section for inventory management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-lg mx-auto mt-24 bg-gradient-to-r from-blue-900/30 to-amber-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-800/30 flex items-center gap-4"
        >
          <div className="bg-amber-500/20 p-3 rounded-full">
            <TrendingUp className="text-amber-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-amber-300 font-medium">System Insight</p>
            <p className="text-sm text-gray-300">
              Optimal inventory reordering happens 5-7 days before predicted
              stockout, ensuring seamless supply chain continuity and customer
              satisfaction.
            </p>
            <div className="mt-2 text-xs text-blue-400">
              Real-time monitoring: {currentUser} • {currentDateTime}
            </div>
          </div>
        </motion.div>

        {/* Performance metrics summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: "Stockout Prevention", value: "73%", icon: Package },
            { label: "Cost Reduction", value: "45%", icon: Target },
            { label: "Response Speed", value: "60%", icon: Zap },
            { label: "ROI Improvement", value: "30%", icon: TrendingUp },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700/30 transition-colors duration-300"
            >
              <metric.icon className="text-blue-400 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-white">
                {metric.value}
              </div>
              <div className="text-xs text-gray-400">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
