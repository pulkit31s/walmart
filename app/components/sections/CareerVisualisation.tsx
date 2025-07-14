"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import {
  LineChart,
  AlertTriangle,
  Calendar,
  Package,
  BarChart3,
  Truck,
  TrendingUp,
  Store,
  Target,
  Clock,
} from "lucide-react";

export default function InventoryForecastSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Updated with current session info
  const currentDateTime = "2025-07-14 09:19:42";
  const currentUser = "vkhare2909";

  // Real-time system metrics
  const [simulatorMetrics, setSimulatorMetrics] = useState({
    activeSimulations: 0,
    totalPredictions: 0,
    accuracy: 0,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 70 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  // Fetch real-time data
  useEffect(() => {
    const fetchSimulatorData = async () => {
      try {
        const [predictionsRes, storesRes] = await Promise.all([
          fetch("/data/predictions.json"),
          fetch("/data/stores.json"),
        ]);

        const [predictions, stores] = await Promise.all([
          predictionsRes.json(),
          storesRes.json(),
        ]);

        setSimulatorMetrics({
          activeSimulations: stores.stores?.length || 500,
          totalPredictions: predictions.store_predictions?.length || 15,
          accuracy: predictions.metadata?.model_accuracy || 87.6,
        });
      } catch (error) {
        console.error("Error fetching simulator data:", error);
        setSimulatorMetrics({
          activeSimulations: 500,
          totalPredictions: 15,
          accuracy: 87.6,
        });
      }
    };

    fetchSimulatorData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in-up", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      const dataPoints = document.querySelectorAll(".data-flow");
      dataPoints.forEach((point, i) => {
        const el = point as HTMLElement;
        gsap.fromTo(
          el,
          {
            y: -20,
            opacity: 0.7,
            x: Math.random() * 10 - 5,
          },
          {
            y: 100,
            opacity: 0,
            duration: 1 + Math.random() * 0.5,
            delay: Math.random() * 0.3,
            repeat: -1,
            ease: "power1.in",
          }
        );
      });
    }
  }, [activeTab]);

  const tabItems = [
    {
      id: "demand-prediction",
      title: "Demand Prediction AI",
      icon: <Package className="mr-2 h-4 w-4" />,
      description:
        "AI-powered demand forecasting based on historical sales data, seasonal trends, customer behavior, and external factors like weather and festivals.",
      features: [
        "Dynamic demand estimations",
        "Seasonal trend analysis",
        "Customer behavior modeling",
        "External factor correlation",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    },
    {
      id: "crisis-forecast",
      title: "Crisis Forecasting",
      icon: <AlertTriangle className="mr-2 h-4 w-4" />,
      description:
        "Advanced crisis prediction system that identifies potential stockouts and overstock situations 7-14 days ahead with actionable recommendations.",
      features: [
        "14-day stockout predictions",
        "Overstock early warnings",
        "Automated reorder alerts",
        "Supplier performance tracking",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop",
    },
    {
      id: "revenue-optimizer",
      title: "Revenue Optimizer",
      icon: <LineChart className="mr-2 h-4 w-4" />,
      description:
        "Revenue optimization algorithms that analyze sales patterns across all Walmart stores in India to maximize profitability and minimize waste.",
      features: [
        "Revenue trend analysis",
        "Optimal pricing windows",
        "Cross-store demand mapping",
        "ROI optimization insights",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="forecast-simulator"
      className="py-24 relative"
      onMouseMove={handleMouseMove}
      style={{
        background:
          "linear-gradient(to bottom, rgb(17, 24, 39), rgba(30, 41, 59, 0.95))",
      }}
    >
      {/* Updated background pattern */}
      <div className="absolute inset-0 -z-10 opacity-15">
        <svg width="100%" height="100%">
          <pattern
            id="inventory-pattern"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect
              x="10"
              y="10"
              width="30"
              height="30"
              fill="none"
              stroke="#004c91"
              strokeWidth="0.5"
            />
            <rect
              x="20"
              y="20"
              width="10"
              height="10"
              fill="#ffc220"
              opacity="0.3"
            />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#inventory-pattern)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center text-xs text-gray-500 bg-gray-900/50 backdrop-blur-sm border border-gray-800 px-3 py-1 rounded-full mb-4">
            <span>Last simulation: {currentDateTime}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-400">{currentUser}</span>
          </div>

          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
            AI-POWERED INVENTORY INTELLIGENCE
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
            Smart Inventory Simulator
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Make data-driven inventory decisions with our advanced AI tools that
            predict demand, forecast crises, and optimize revenue across your
            entire store network.
          </p>

          {/* Real-time simulator metrics */}
          <div className="mt-8 inline-flex items-center gap-6 bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-blue-500/20">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {simulatorMetrics.activeSimulations}
              </div>
              <div className="text-xs text-gray-400">Active Simulations</div>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {simulatorMetrics.totalPredictions}
              </div>
              <div className="text-xs text-gray-400">Live Predictions</div>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">
                {simulatorMetrics.accuracy}%
              </div>
              <div className="text-xs text-gray-400">AI Accuracy</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 fade-in-up">
            {/* Updated tab navigation */}
            <div className="bg-gradient-to-r from-blue-900/30 to-amber-900/30 backdrop-blur-md border border-blue-800/30 p-1 rounded-xl mb-8">
              <div className="flex">
                {tabItems.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                      activeTab === index
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(0, 76, 145, 0.3), rgba(255, 194, 32, 0.2))",
                        }}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      {tab.icon}
                      {tab.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={activeTab}
              className="space-y-6"
            >
              <h3
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(to right, #004c91, #ffc220)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {tabItems[activeTab].title}
              </h3>

              <p className="text-gray-300">{tabItems[activeTab].description}</p>

              <ul className="space-y-3">
                {tabItems[activeTab].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 text-blue-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Run Simulation
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center border border-blue-500/20"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Adjust Parameters
                </motion.button>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>
                    Predictions update hourly with real-time sales and market
                    data
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="order-1 md:order-2 fade-in-up">
            <motion.div
              style={{ rotateX, rotateY, perspective: 1000 }}
              className="h-[400px] bg-gradient-to-br from-gray-900/80 via-blue-900/30 to-gray-900/80 backdrop-blur-md border border-blue-800/30 rounded-xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10"></div>
              <Image
                src={tabItems[activeTab].imageUrl}
                alt={tabItems[activeTab].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Demand Prediction Tab */}
              {activeTab === 0 && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-blue-700/40">
                    <div className="text-blue-400 text-sm font-semibold mb-3">
                      AC Demand Forecast - Mumbai Store
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-gray-800/60 p-2 rounded text-center">
                        <div className="text-amber-400 text-xs mb-1">
                          Current
                        </div>
                        <div className="text-white text-lg font-bold">12</div>
                        <div className="text-gray-400 text-xs">units/day</div>
                      </div>
                      <div className="bg-gray-800/60 p-2 rounded text-center">
                        <div className="text-amber-400 text-xs mb-1">
                          Predicted
                        </div>
                        <div className="text-white text-lg font-bold">28</div>
                        <div className="text-gray-400 text-xs">units/day</div>
                      </div>
                      <div className="bg-gray-800/60 p-2 rounded text-center">
                        <div className="text-amber-400 text-xs mb-1">Peak</div>
                        <div className="text-white text-lg font-bold">42</div>
                        <div className="text-gray-400 text-xs">units/day</div>
                      </div>
                    </div>

                    <div className="h-20 relative">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Current</span>
                        <span>Heatwave</span>
                        <span>Peak Summer</span>
                      </div>

                      <div className="h-12 w-full bg-gray-800/80 rounded-lg overflow-hidden">
                        <div className="h-full w-full relative">
                          <svg viewBox="0 0 100 40" className="h-full w-full">
                            <path
                              d="M0,35 C10,33 20,25 30,15 C40,8 50,5 60,8 C70,12 80,20 90,25 C100,30 100,35 100,35"
                              fill="url(#demand-gradient)"
                              opacity="0.7"
                            />
                            <path
                              d="M0,35 C10,33 20,25 30,15 C40,8 50,5 60,8 C70,12 80,20 90,25 C100,30 100,35 100,35"
                              stroke="#004c91"
                              strokeWidth="2"
                              fill="none"
                            />
                            <circle cx="50" cy="5" r="3" fill="#ffc220" />
                            <defs>
                              <linearGradient
                                id="demand-gradient"
                                x1="0%"
                                y1="0%"
                                x2="0%"
                                y2="100%"
                              >
                                <stop offset="0%" stopColor="#004c91" />
                                <stop offset="100%" stopColor="#004c9100" />
                              </linearGradient>
                            </defs>
                          </svg>

                          <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-full w-px bg-amber-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Crisis Forecasting Tab */}
              {activeTab === 1 && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end">
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute data-flow w-1 h-3 bg-blue-300/60 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 30}%`,
                        }}
                      ></div>
                    ))}

                    <div className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full bg-amber-400/30 backdrop-blur-sm flex items-center justify-center">
                      <AlertTriangle size={24} className="text-amber-300" />
                    </div>

                    <div className="absolute top-[30%] left-[30%] w-20 h-10 rounded-full bg-red-500/30 backdrop-blur-sm"></div>
                    <div className="absolute top-[25%] left-[25%] w-14 h-10 rounded-full bg-red-500/30 backdrop-blur-sm"></div>
                  </div>

                  <div className="p-4">
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-red-700/40">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-red-400 text-sm font-semibold">
                          Critical Alerts - Next 7 Days
                        </div>
                        <div className="text-xs text-gray-400">
                          Store: WM001 Gurgaon
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            day: "Day 2",
                            product: "LG AC 1.5T",
                            risk: "HIGH",
                            stock: "3 units",
                            color: "text-red-400",
                          },
                          {
                            day: "Day 5",
                            product: "Basmati Rice 5kg",
                            risk: "MED",
                            stock: "45 units",
                            color: "text-amber-400",
                          },
                          {
                            day: "Day 7",
                            product: "Samsung S24",
                            risk: "LOW",
                            stock: "12 units",
                            color: "text-green-400",
                          },
                        ].map((alert, i) => (
                          <div
                            key={i}
                            className="bg-gray-800/60 rounded p-2 flex justify-between items-center"
                          >
                            <div>
                              <div className="text-white text-xs font-medium">
                                {alert.product}
                              </div>
                              <div className="text-gray-400 text-[10px]">
                                {alert.day} • {alert.stock}
                              </div>
                            </div>
                            <div className={`text-xs font-bold ${alert.color}`}>
                              {alert.risk}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-red-300">
                          <Clock size={12} />
                          <span>Urgent reorder needed for 2 products</span>
                        </div>
                        <div className="text-amber-300">
                          Auto-orders: 3 scheduled
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Revenue Optimizer Tab */}
              {activeTab === 2 && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-700/40">
                    <div className="text-green-400 text-sm font-semibold mb-3">
                      Revenue Optimization - Electronics Category
                    </div>

                    <div className="h-24 relative mb-2">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gray-600"></div>

                      <div className="flex justify-between h-full">
                        {["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map(
                          (month, i) => {
                            const height = [60, 40, 55, 75, 65, 85][i];
                            const isFuture = i > 2;

                            return (
                              <div
                                key={i}
                                className="flex flex-col items-center justify-end flex-1"
                              >
                                <div
                                  className={`w-5 rounded-t-sm ${
                                    isFuture
                                      ? "bg-green-400/50 border border-green-400"
                                      : "bg-blue-600"
                                  }`}
                                  style={{ height: `${height}%` }}
                                >
                                  <div className="text-[10px] text-white text-center -mt-5">
                                    ₹{Math.floor(40 + height / 5)}Cr
                                  </div>
                                </div>
                                <div className="text-gray-500 text-xs mt-1">
                                  {month}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-gray-800/60 p-2 rounded">
                        <div className="text-green-400 text-xs">Current</div>
                        <div className="text-white text-lg font-bold">
                          ₹48Cr
                        </div>
                        <div className="text-gray-400 text-xs">monthly</div>
                      </div>
                      <div className="bg-gray-800/60 p-2 rounded">
                        <div className="text-green-400 text-xs">Peak (Dec)</div>
                        <div className="text-white text-lg font-bold">
                          ₹57Cr
                        </div>
                        <div className="flex items-center text-green-400 text-xs">
                          <TrendingUp size={10} className="mr-1" />
                          <span>+18.8%</span>
                        </div>
                      </div>
                      <div className="bg-green-900/30 p-2 rounded border border-green-700/40">
                        <div className="text-green-400 text-xs">Action</div>
                        <div className="text-white text-sm font-bold">
                          Stock for festivals
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Updated background gradient */}
      <div
        className="absolute -z-10 bottom-0 left-0 w-full h-[500px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 76, 145, 0.15) 0%, rgba(17, 24, 39, 0) 70%)",
        }}
      ></div>
    </section>
  );
}
