"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Package,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Store,
  Target,
  Truck,
  Zap,
  Brain,
  Shield,
  Users,
  Clock,
} from "lucide-react";
import {
  RiStore3Fill,
  RiBarChartBoxFill,
  RiAlertFill,
  RiCommunityFill,
  RiRobotFill,
  RiMoneyCnyBoxFill,
} from "react-icons/ri";
import Image from "next/image";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  currentUser?: string;
  currentTime?: string;
  imageUrl?: string;
  metric?: string;
  improvement?: string;
};

function FeatureCard({
  icon,
  title,
  description,
  delay,
  currentUser,
  currentTime,
  imageUrl,
  metric,
  improvement,
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900/50 backdrop-blur-md border border-blue-800/20 rounded-xl p-8 hover:bg-blue-900/15 transition-all duration-500 group flex flex-col h-full"
    >
      {imageUrl && (
        <div className="mb-6 w-full h-48 overflow-hidden rounded-lg relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40 z-10"></div>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Performance overlay */}
          {metric && (
            <div className="absolute top-4 right-4 z-20 bg-blue-600/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-white text-sm font-bold">{metric}</div>
            </div>
          )}
        </div>
      )}

      <div
        className="relative mb-6 w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(to bottom right, #004c91, #0066cc)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        <div className="z-10 text-2xl text-white">{icon}</div>
      </div>

      <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-400 text-white">
        {title}
      </h3>

      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex-grow">
        {description}
      </p>

      {/* Performance metrics */}
      {improvement && (
        <div className="mt-4 mb-4 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
          <div className="text-green-400 text-sm font-medium">
            Performance Impact
          </div>
          <div className="text-green-300 text-lg font-bold">{improvement}</div>
        </div>
      )}

      {currentUser && currentTime && (
        <div className="mt-4 mb-2 flex items-center text-xs text-gray-500">
          <span className="text-blue-400">{currentUser}</span>
          <span className="mx-2">•</span>
          <span>{currentTime}</span>
        </div>
      )}

      <div className="mt-auto pt-6 flex items-center text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <span>Explore Feature</span>
        <svg
          className="ml-2 w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </motion.div>
  );
}

type ImageCardProps = {
  imageUrl: string;
  title: string;
  description: string;
  delay: number;
  roi?: string;
};

function ImageCard({
  imageUrl,
  title,
  description,
  delay,
  roi,
}: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900/50 backdrop-blur-md border border-blue-800/20 rounded-xl overflow-hidden hover:bg-blue-900/15 transition-all duration-500 group h-full flex flex-col"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-50 z-10"></div>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {roi && (
          <div className="absolute top-4 left-4 z-20 bg-green-600/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-white text-sm font-bold">ROI: {roi}</div>
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-blue-400 text-white">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex-grow">
          {description}
        </p>
        <div className="mt-auto pt-6 flex items-center text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Learn More</span>
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:12:16";

  // Real-time feature metrics
  const [featureMetrics, setFeatureMetrics] = useState({
    totalFeatures: 8,
    activeStores: 0,
    averageAccuracy: 0,
    totalSavings: 0,
  });

  // Fetch performance data
  useEffect(() => {
    const fetchFeatureData = async () => {
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

        setFeatureMetrics({
          totalFeatures: 8,
          activeStores: stores.stores?.length || 500,
          averageAccuracy: predictions.metadata?.model_accuracy || 87.6,
          totalSavings: 450000000, // ₹45 Cr in rupees
        });
      } catch (error) {
        console.error("Error fetching feature data:", error);
        setFeatureMetrics({
          totalFeatures: 8,
          activeStores: 500,
          averageAccuracy: 87.6,
          totalSavings: 450000000,
        });
      }
    };

    fetchFeatureData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });

      // Enhanced data flow animation
      gsap.to(".data-stream", {
        height: "100%",
        duration: 3,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".data-stream-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Brain />,
      title: "AI Demand Prediction",
      description:
        "Advanced machine learning algorithms analyze sales patterns, seasonal trends, customer behavior, and external factors to predict demand with 87.6% accuracy, preventing stockouts before they happen.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      metric: "87.6% Accuracy",
      improvement: "+73% Stockout Prevention",
    },
    {
      icon: <AlertTriangle />,
      title: "Smart Alert System",
      description:
        "Intelligent notification system prioritizes critical inventory issues, generates actionable recommendations, and automates supplier communications for immediate response to potential crises.",
      imageUrl:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop",
      metric: "Real-time",
      improvement: "+60% Response Time",
    },
    {
      icon: <Package />,
      title: "Inventory Intelligence",
      description:
        "Comprehensive dashboard providing real-time visibility into stock levels, turnover rates, and performance metrics across all 500+ Walmart stores in India with automated reorder suggestions.",
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop",
      metric: "500+ Stores",
      improvement: "+40% Efficiency",
    },
    {
      icon: <Shield />,
      title: "Crisis Prevention Engine",
      description:
        "Gemini AI-powered system identifies potential inventory crises 7-14 days ahead, analyzing supplier reliability, demand spikes, and external factors to prevent revenue losses.",
      imageUrl:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop",
      metric: "7-14 Days",
      improvement: "+85% Crisis Prevention",
    },
    {
      icon: <TrendingUp />,
      title: "Revenue Optimization",
      description:
        "Dynamic pricing and inventory optimization algorithms maximize profitability by preventing overstock waste, reducing storage costs, and ensuring optimal product availability.",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      metric: "₹45+ Cr Saved",
      improvement: "+30% Profit Margin",
    },
  ];

  const imageCards = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop",
      title: "Automated Procurement",
      description:
        "Smart procurement system automatically generates purchase orders, negotiates with suppliers, and optimizes delivery schedules to maintain optimal inventory levels across all stores.",
      delay: 0.6,
      roi: "45% Cost Reduction",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop",
      title: "Supply Chain Intelligence",
      description:
        "Advanced analytics platform monitors supplier performance, predicts delivery delays, and identifies alternative suppliers to ensure uninterrupted product availability.",
      delay: 0.7,
      roi: "25% Time Savings",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop",
      title: "Customer Demand Analytics",
      description:
        "Deep learning models analyze customer purchase patterns, seasonal preferences, and demographic data to predict future demand with unprecedented accuracy.",
      delay: 0.8,
      roi: "35% Accuracy Boost",
    },
  ];

  return (
    <section ref={sectionRef} id="features" className="py-24 relative">
      {/* Walmart-themed background gradients */}
      <div
        className="absolute top-0 left-0 w-full h-20 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
        }}
      ></div>

      <div
        className="absolute bottom-0 left-0 w-full h-20 z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0))",
        }}
      ></div>

      {/* Data stream visualization */}
      <div className="absolute left-0 top-0 bottom-0 w-8 overflow-hidden hidden lg:block">
        <div className="data-stream-container h-full relative">
          <div className="absolute bottom-0 left-0 w-full data-stream h-0">
            <svg
              viewBox="0 0 40 1000"
              width="40"
              height="100%"
              preserveAspectRatio="none"
            >
              <path
                d="M20,0 Q40,200 15,300 Q0,400 20,500 Q40,600 10,700 Q0,800 20,900 Q30,950 20,1000"
                stroke="#004c91"
                strokeWidth="2"
                fill="none"
                strokeDasharray="15 5"
              />
              {/* Data nodes */}
              <circle cx="20" cy="300" r="3" fill="#ffc220" opacity="0.8" />
              <circle cx="20" cy="500" r="3" fill="#ffc220" opacity="0.8" />
              <circle cx="20" cy="700" r="3" fill="#ffc220" opacity="0.8" />
              <circle cx="20" cy="900" r="3" fill="#ffc220" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Inventory flow indicators */}
      <div className="absolute right-8 top-20 bottom-0 w-12 overflow-hidden hidden lg:block">
        <div className="h-full relative">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-40"
              style={{
                top: `${i * 12}%`,
                left: `${i % 2 === 0 ? "0" : "50%"}`,
                animation: `inventoryFlow ${1.5 + Math.random()}s ${
                  i * 0.4
                }s infinite linear`,
              }}
            >
              <div className="w-2 h-3 bg-blue-400 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <RiStore3Fill className="text-blue-400" />
            INTELLIGENT INVENTORY SOLUTIONS
          </motion.span>

          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white"
          >
            Transforming Retail with AI Intelligence
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            SmartStock Pro combines advanced AI prediction models, real-time
            inventory analytics, and intelligent automation to prevent
            stockouts, reduce overstock, and maximize profitability across
            Walmart's entire retail network in India.
          </p>

          {/* Real-time system metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-6 bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-blue-500/20"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {featureMetrics.activeStores}
              </div>
              <div className="text-xs text-gray-400">Active Stores</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {featureMetrics.averageAccuracy}%
              </div>
              <div className="text-xs text-gray-400">AI Accuracy</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">₹45+ Cr</div>
              <div className="text-xs text-gray-400">Annual Savings</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              currentUser={index === 0 ? currentUser : undefined}
              currentTime={index === 0 ? currentTime : undefined}
              imageUrl={feature.imageUrl}
              metric={feature.metric}
              improvement={feature.improvement}
            />
          ))}
        </div>

        {/* Updated alert banner for inventory management */}
        <div className="mb-16 relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-amber-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-amber-400/20 p-3 rounded-lg mr-4">
                  <RiAlertFill className="text-amber-400 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-300">
                    Festival Season Inventory Alert
                  </h3>
                  <p className="text-gray-300">
                    AI predicts 40% demand surge for electronics during upcoming
                    Diwali season
                  </p>
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors duration-300">
                View Recommendations
              </button>
            </div>

            {/* Background pattern */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <pattern
                  id="inventory-pattern"
                  patternUnits="userSpaceOnUse"
                  width="10"
                  height="10"
                >
                  <rect
                    x="2"
                    y="2"
                    width="6"
                    height="6"
                    fill="#ffc220"
                    opacity="0.3"
                  />
                </pattern>
                <circle cx="50" cy="50" r="50" fill="url(#inventory-pattern)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imageCards.map((card, index) => (
            <ImageCard
              key={index}
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description}
              delay={card.delay}
              roi={card.roi}
            />
          ))}
        </div>

        {/* System performance summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              label: "Stockout Prevention",
              value: "73%",
              icon: Package,
              color: "text-green-400",
            },
            {
              label: "Cost Reduction",
              value: "45%",
              icon: Target,
              color: "text-blue-400",
            },
            {
              label: "Response Speed",
              value: "60%",
              icon: Zap,
              color: "text-amber-400",
            },
            {
              label: "Revenue Growth",
              value: "30%",
              icon: TrendingUp,
              color: "text-purple-400",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-gray-800/30 backdrop-blur-sm border border-blue-700/30 rounded-xl p-6 text-center hover:bg-blue-900/20 transition-colors duration-300 group"
            >
              <metric.icon
                className={`${metric.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                size={32}
              />
              <div className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background blur effect */}
      <div
        className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: "rgba(0, 76, 145, 0.1)",
        }}
      ></div>

      <style jsx>{`
        @keyframes inventoryFlow {
          from {
            transform: translateY(-20px);
            opacity: 0.7;
          }
          to {
            transform: translateY(200px);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
