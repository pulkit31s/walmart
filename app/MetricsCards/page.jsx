"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  TrendingUp,
  TrendingDown,
  Store,
  AlertTriangle,
  Package,
  DollarSign,
  Target,
  Zap,
  Activity,
  BarChart3,
} from "lucide-react";

export default function MetricsCards() {
  // Initialize data state
  const [stores, setStores] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [timeRange] = useState("30d");
  const cardsRef = useRef(null);
  const [animatedValues, setAnimatedValues] = useState({});

  // Session info
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:40:59";

  // Calculate metrics
  const metrics = {
    totalStores: stores.length,
    totalRevenue: stores.reduce((sum, store) => sum + store.monthly_revenue, 0),
    avgHealthScore:
      stores.length > 0
        ? stores.reduce((sum, store) => sum + store.health_score, 0) /
          stores.length
        : 0,
    criticalAlerts: alerts.filter((alert) => alert.priority === "critical")
      .length,
    totalAlerts: alerts.length,
    revenueAtRisk: predictions.reduce(
      (sum, pred) => sum + (pred.estimated_impact?.revenue_at_risk || 0),
      0
    ),
    aiAccuracy: 87.6, // From model performance
    stockoutPrevention: 73, // Percentage prevented
    costSavings: 450000000, // ₹45 Cr in rupees
    systemUptime: 99.94,
  };

  // Growth calculations (simulated)
  const growthRates = {
    revenue: 12.3,
    healthScore: 2.1,
    alerts: -15.4,
    efficiency: 8.7,
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Animate number counting effect
  useEffect(() => {
    const animateValue = (key, target, duration = 2000) => {
      const startValue = animatedValues[key] || 0;
      const obj = { value: startValue };

      gsap.to(obj, {
        value: target,
        duration: duration / 1000,
        ease: "power2.out",
        onUpdate: () => {
          setAnimatedValues((prev) => ({
            ...prev,
            [key]: obj.value,
          }));
        },
      });
    };

    // Animate all metrics
    animateValue("totalStores", metrics.totalStores);
    animateValue("totalRevenue", metrics.totalRevenue);
    animateValue("avgHealthScore", metrics.avgHealthScore);
    animateValue("criticalAlerts", metrics.criticalAlerts);
    animateValue("aiAccuracy", metrics.aiAccuracy);
    animateValue("stockoutPrevention", metrics.stockoutPrevention);
    animateValue("costSavings", metrics.costSavings);
    animateValue("systemUptime", metrics.systemUptime);
  }, [stores, predictions, alerts]);

  // Cards entrance animation
  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        ".metric-card",
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.98 },
  };

  const metricsData = [
    {
      id: "stores",
      title: "Active Stores",
      value: Math.round(animatedValues.totalStores || 0),
      change: "+2.1%",
      trend: "up",
      icon: Store,
      color: "blue",
      description: "Stores online and operational",
      bgGradient: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/20",
    },
    {
      id: "revenue",
      title: "Monthly Revenue",
      value: formatCurrency(animatedValues.totalRevenue || 0),
      change: `+${growthRates.revenue}%`,
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "Total network revenue",
      bgGradient: "from-green-500/10 to-green-600/5",
      borderColor: "border-green-500/20",
    },
    {
      id: "health",
      title: "Avg Health Score",
      value: `${Math.round(animatedValues.avgHealthScore || 0)}%`,
      change: `+${growthRates.healthScore}%`,
      trend: "up",
      icon: Activity,
      color: "purple",
      description: "Network health average",
      bgGradient: "from-purple-500/10 to-purple-600/5",
      borderColor: "border-purple-500/20",
    },
    {
      id: "alerts",
      title: "Critical Alerts",
      value: Math.round(animatedValues.criticalAlerts || 0),
      change: `${growthRates.alerts}%`,
      trend: "down",
      icon: AlertTriangle,
      color: "red",
      description: "Requiring immediate attention",
      bgGradient: "from-red-500/10 to-red-600/5",
      borderColor: "border-red-500/20",
    },
    {
      id: "accuracy",
      title: "AI Accuracy",
      value: `${Math.round(animatedValues.aiAccuracy || 0)}%`,
      change: "+1.2%",
      trend: "up",
      icon: Target,
      color: "indigo",
      description: "Prediction model accuracy",
      bgGradient: "from-indigo-500/10 to-indigo-600/5",
      borderColor: "border-indigo-500/20",
    },
    {
      id: "prevention",
      title: "Stockout Prevention",
      value: `${Math.round(animatedValues.stockoutPrevention || 0)}%`,
      change: "+5.1%",
      trend: "up",
      icon: Package,
      color: "teal",
      description: "Crisis prevention rate",
      bgGradient: "from-teal-500/10 to-teal-600/5",
      borderColor: "border-teal-500/20",
    },
    {
      id: "savings",
      title: "Cost Savings",
      value: formatCurrency(animatedValues.costSavings || 0),
      change: "+18.7%",
      trend: "up",
      icon: Zap,
      color: "amber",
      description: "Annual savings achieved",
      bgGradient: "from-amber-500/10 to-amber-600/5",
      borderColor: "border-amber-500/20",
    },
    {
      id: "uptime",
      title: "System Uptime",
      value: `${(animatedValues.systemUptime || 0).toFixed(2)}%`,
      change: "+0.01%",
      trend: "up",
      icon: BarChart3,
      color: "emerald",
      description: "System availability",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
    },
  ];

  const getColorClasses = (color, type) => {
    const colorMap = {
      blue: {
        text: "text-blue-400",
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
      },
      green: {
        text: "text-green-400",
        bg: "bg-green-500",
        hover: "hover:bg-green-600",
      },
      purple: {
        text: "text-purple-400",
        bg: "bg-purple-500",
        hover: "hover:bg-purple-600",
      },
      red: {
        text: "text-red-400",
        bg: "bg-red-500",
        hover: "hover:bg-red-600",
      },
      indigo: {
        text: "text-indigo-400",
        bg: "bg-indigo-500",
        hover: "hover:bg-indigo-600",
      },
      teal: {
        text: "text-teal-400",
        bg: "bg-teal-500",
        hover: "hover:bg-teal-600",
      },
      amber: {
        text: "text-amber-400",
        bg: "bg-amber-500",
        hover: "hover:bg-amber-600",
      },
      emerald: {
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        hover: "hover:bg-emerald-600",
      },
    };
    return colorMap[color]?.[type] || "";
  };

  return (
    <div ref={cardsRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">System Metrics</h2>
          <p className="text-sm text-gray-400">
            Real-time performance indicators • Last updated: {currentTime} by{" "}
            {currentUser}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Time Range:</span>
          <span className="text-blue-400 font-medium">{timeRange}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.id}
            className={`metric-card relative bg-gray-800/50 backdrop-blur-sm border ${metric.borderColor} rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group overflow-hidden`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: index * 0.1 }}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`}
            ></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${metric.bgGradient} ${metric.borderColor} border`}
                >
                  <metric.icon
                    className={`w-5 h-5 ${getColorClasses(
                      metric.color,
                      "text"
                    )}`}
                  />
                </div>

                {/* Trend Indicator */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === "up"
                      ? "bg-green-500/20 text-green-400"
                      : metric.trend === "down"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : metric.trend === "down" ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Activity className="w-3 h-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>

              {/* Main Value */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-gray-300">
                  {metric.title}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-400">{metric.description}</div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>

            {/* Pulse Animation for Critical Metrics */}
            {metric.id === "alerts" && metric.value > 5 && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Performance Insights
            </h3>
            <p className="text-sm text-gray-400">
              AI-generated summary for {currentUser}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {((metrics.avgHealthScore / 100) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Overall Network Health</div>
            <div className="text-xs text-green-400 mt-1">
              ↑ Excellent Performance
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ₹{(metrics.revenueAtRisk / 100000).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-400">Revenue Protected Daily</div>
            <div className="text-xs text-blue-400 mt-1">
              ↑ Crisis Prevention Active
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {Math.round(
                100 - (metrics.criticalAlerts / metrics.totalStores) * 100
              )}
              %
            </div>
            <div className="text-sm text-gray-400">Stores Without Issues</div>
            <div className="text-xs text-purple-400 mt-1">
              ↑ Proactive Management
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
