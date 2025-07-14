"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import {
  Store,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  DollarSign,
  AlertTriangle,
  Target,
  Zap,
  Clock,
  Users,
  ShoppingCart,
  BarChart3,
  LineChart,
  PieChart,
  Gauge,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle,
  XCircle,
  AlertCircle,
  ThermometerSun,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Moon,
  Star,
  Award,
  Shield,
  Truck,
  Building,
  Settings,
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Bell,
  Database,
  Cpu,
  Network,
  HardDrive,
  Brain,
  Layers,
  Grid,
  Maximize2,
  Minimize2,
} from "lucide-react";

// Session and Time Constants
const currentTime = "2025-07-14 11:25:01";
const currentUser = "vkhare2909";

// Data Fetching Functions
const fetchStoreAnalyticsData = async (storeId) => {
  try {
    const [storesRes, salesRes, predictionsRes, alertsRes, productsRes] =
      await Promise.all([
        fetch("/data/stores.json"),
        fetch("/data/sales_history.json"),
        fetch("/data/predictions.json"),
        fetch("/data/alerts.json"),
        fetch("/data/products.json"),
      ]);

    const [stores, sales, predictions, alerts, products] = await Promise.all([
      storesRes.json(),
      salesRes.json(),
      predictionsRes.json(),
      alertsRes.json(),
      productsRes.json(),
    ]);

    // Find specific store data
    const storeData =
      stores.stores.find((store) => store.id === storeId) || stores.stores[0];

    // Filter predictions and alerts for this store
    const storePredictions = predictions.store_predictions.filter(
      (pred) => pred.store_id === storeId
    );
    const storeAlerts = [
      ...(alerts.critical_alerts || []),
      ...(alerts.high_priority_alerts || []),
    ].filter((alert) => alert.store_id === storeId);

    // Generate advanced analytics
    const analytics = generateStoreAnalytics(
      storeData,
      sales,
      storePredictions,
      storeAlerts,
      products
    );

    return {
      store: storeData,
      analytics,
      predictions: storePredictions,
      alerts: storeAlerts,
      products: products.products,
      categories: products.categories,
      historicalData: generateHistoricalData(storeData),
      performanceMetrics: calculatePerformanceMetrics(storeData, sales),
      competitorAnalysis: generateCompetitorAnalysis(storeData),
      customerInsights: generateCustomerInsights(storeData),
      operationalMetrics: generateOperationalMetrics(storeData),
      weatherImpact: generateWeatherImpact(),
      seasonalTrends: generateSeasonalTrends(),
      aiInsights: generateAIInsights(storeData, storePredictions),
    };
  } catch (error) {
    console.error("Error fetching store analytics:", error);
    return null;
  }
};

// Advanced Analytics Generation Functions
const generateStoreAnalytics = (
  store,
  sales,
  predictions,
  alerts,
  products
) => {
  const baseRevenue = store.monthly_revenue;
  const healthScore = store.health_score;
  const turnover = store.inventory_turnover;

  return {
    revenueAnalysis: {
      current: baseRevenue,
      projected: baseRevenue * 1.123,
      growth: 12.3,
      variance: 2.1,
      target: baseRevenue * 1.15,
      benchmark: 75000000,
      trends: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          revenue:
            baseRevenue / 30 + ((Math.random() - 0.5) * baseRevenue * 0.1) / 30,
          transactions: 450 + Math.floor(Math.random() * 200),
          avgBasketValue: 9850 + Math.floor(Math.random() * 1000),
        })),
        hourly: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          revenue:
            (baseRevenue / 30 / 24) *
            (1 + Math.sin(((i - 6) * Math.PI) / 12) * 0.5),
          footfall:
            50 +
            Math.floor(
              Math.sin(((i - 8) * Math.PI) / 10) * 40 + Math.random() * 20
            ),
        })),
      },
    },
    inventoryAnalysis: {
      turnoverRate: turnover,
      fastMovers: Math.floor(Math.random() * 150 + 200),
      slowMovers: Math.floor(Math.random() * 80 + 50),
      deadStock: Math.floor(Math.random() * 25 + 15),
      stockAccuracy: 94.7 + Math.random() * 4,
      shrinkage: 0.8 + Math.random() * 0.4,
      carryingCost: baseRevenue * 0.15,
      categoryPerformance:
        products.categories?.map((cat) => ({
          category: cat.name,
          turnover: turnover + (Math.random() - 0.5) * 2,
          margin: cat.margin_percentage + (Math.random() - 0.5) * 5,
          growth: (Math.random() - 0.3) * 30,
        })) || [],
    },
    customerAnalysis: {
      totalCustomers: 8500 + Math.floor(Math.random() * 2000),
      returningCustomers: 65.3 + Math.random() * 10,
      newCustomers: 34.7 + Math.random() * 10,
      avgVisitFrequency: 2.3 + Math.random() * 0.5,
      customerSatisfaction: 8.4 + Math.random() * 1.2,
      nps: 47 + Math.floor(Math.random() * 25),
      demographics: {
        age: { "18-25": 23, "26-35": 31, "36-45": 28, "46-55": 12, "55+": 6 },
        gender: { male: 52, female: 48 },
        income: { low: 25, medium: 45, high: 30 },
      },
    },
    operationalEfficiency: {
      staffProductivity: 78.5 + Math.random() * 15,
      energyEfficiency: 82.1 + Math.random() * 12,
      wastageReduction: 15.3 + Math.random() * 8,
      supplierPerformance: 89.2 + Math.random() * 8,
      deliveryAccuracy: 96.8 + Math.random() * 2,
      processOptimization: 76.4 + Math.random() * 18,
    },
    riskAssessment: {
      overallRisk: store.risk_level,
      financialRisk:
        Math.random() < 0.3 ? "high" : Math.random() < 0.6 ? "medium" : "low",
      operationalRisk:
        Math.random() < 0.2 ? "high" : Math.random() < 0.5 ? "medium" : "low",
      marketRisk:
        Math.random() < 0.25 ? "high" : Math.random() < 0.55 ? "medium" : "low",
      riskFactors: [
        {
          factor: "Stock Availability",
          score: Math.random() * 40 + 60,
          trend: "stable",
        },
        {
          factor: "Market Competition",
          score: Math.random() * 30 + 70,
          trend: "increasing",
        },
        {
          factor: "Supply Chain",
          score: Math.random() * 20 + 75,
          trend: "improving",
        },
        {
          factor: "Economic Conditions",
          score: Math.random() * 25 + 65,
          trend: "stable",
        },
      ],
    },
  };
};

const generateHistoricalData = (store) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month, index) => ({
    month,
    revenue: store.monthly_revenue * (0.8 + Math.random() * 0.4),
    healthScore: store.health_score + (Math.random() - 0.5) * 10,
    incidents: store.stockout_incidents + Math.floor((Math.random() - 0.5) * 6),
    turnover: store.inventory_turnover + (Math.random() - 0.5) * 2,
    customerSatisfaction: 8.2 + Math.random() * 1.5,
  }));
};

const calculatePerformanceMetrics = (store, sales) => {
  return {
    efficiency: {
      overall: 78.5 + Math.random() * 15,
      inventory: (store.inventory_turnover / 12) * 100,
      revenue: (store.monthly_revenue / 100000000) * 100,
      customer: 82.3 + Math.random() * 12,
    },
    benchmarks: {
      industryAverage: 75.2,
      topPerformer: 92.8,
      networkAverage: 81.6,
      regionalAverage: 79.4,
    },
  };
};

const generateCompetitorAnalysis = (store) => {
  return {
    marketShare: 23.5 + Math.random() * 15,
    competitorCount: 8 + Math.floor(Math.random() * 5),
    pricePosition:
      Math.random() < 0.4
        ? "premium"
        : Math.random() < 0.7
        ? "competitive"
        : "value",
    strengthsWeaknesses: {
      strengths: [
        "Location advantage",
        "Product variety",
        "AI-powered inventory",
      ],
      weaknesses: ["Pricing pressure", "Seasonal fluctuations"],
      opportunities: ["E-commerce integration", "Sustainable products"],
      threats: ["New market entrants", "Economic uncertainty"],
    },
  };
};

const generateCustomerInsights = (store) => {
  return {
    peakHours: [
      { hour: "10:00", intensity: 65 },
      { hour: "14:00", intensity: 78 },
      { hour: "18:00", intensity: 92 },
      { hour: "20:00", intensity: 85 },
    ],
    popularCategories: [
      { category: "Electronics", share: 28, trend: "up" },
      { category: "Groceries", share: 35, trend: "stable" },
      { category: "Clothing", share: 18, trend: "up" },
      { category: "Home & Kitchen", share: 19, trend: "down" },
    ],
    loyaltyMetrics: {
      enrolled: 78.5,
      active: 65.2,
      retention: 82.7,
    },
  };
};

const generateOperationalMetrics = (store) => {
  return {
    staffing: {
      totalStaff: 45 + Math.floor(Math.random() * 20),
      productivity: 78.5 + Math.random() * 15,
      satisfaction: 7.8 + Math.random() * 1.5,
      turnover: 12.3 + Math.random() * 8,
    },
    infrastructure: {
      systemUptime: 99.2 + Math.random() * 0.7,
      energyEfficiency: 82.1 + Math.random() * 12,
      maintenanceScore: 88.9 + Math.random() * 8,
      securityScore: 94.5 + Math.random() * 4,
    },
  };
};

const generateWeatherImpact = () => {
  return {
    current: {
      temperature: 32 + Math.random() * 8,
      humidity: 65 + Math.random() * 20,
      condition: "Partly Cloudy",
      impact: "moderate",
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      temp: 30 + Math.random() * 10,
      condition: ["Sunny", "Cloudy", "Rainy", "Stormy"][
        Math.floor(Math.random() * 4)
      ],
      salesImpact: (Math.random() - 0.5) * 20,
    })),
  };
};

const generateSeasonalTrends = () => {
  return {
    currentSeason: "Summer",
    trends: {
      electronics: {
        impact: 40,
        products: ["AC Units", "Refrigerators", "Coolers"],
      },
      clothing: { impact: -15, products: ["Winter Wear", "Jackets"] },
      groceries: { impact: 10, products: ["Cold Drinks", "Ice Cream"] },
    },
    upcomingEvents: [
      { event: "Independence Day", date: "2025-08-15", impact: 25 },
      { event: "Raksha Bandhan", date: "2025-08-30", impact: 18 },
      { event: "Monsoon Season", date: "2025-08-01", impact: -12 },
    ],
  };
};

const generateAIInsights = (store, predictions) => {
  return {
    modelAccuracy: 87.6 + Math.random() * 8,
    predictionConfidence: 89.2 + Math.random() * 6,
    recommendations: [
      {
        type: "inventory",
        priority: "high",
        action: "Increase AC inventory by 30%",
        impact: "₹15L revenue protection",
        confidence: 92,
      },
      {
        type: "pricing",
        priority: "medium",
        action: "Implement dynamic pricing for electronics",
        impact: "8% margin improvement",
        confidence: 78,
      },
      {
        type: "staffing",
        priority: "medium",
        action: "Add 2 staff members for weekend rush",
        impact: "Better customer experience",
        confidence: 85,
      },
    ],
    alertsPrevented: 15,
    revenueSaved: 8500000,
  };
};

// Advanced Chart Components
const RevenueTimeSeriesChart = ({ data, timeframe = "daily" }) => {
  const chartData = data.revenueAnalysis.trends.daily.slice(-14);
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const minRevenue = Math.min(...chartData.map((d) => d.revenue));
  const range = maxRevenue - minRevenue;

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 800 300" className="w-full h-full">
        <defs>
          <linearGradient
            id="revenueAreaGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient
            id="revenueLineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1="60"
            y1={50 + i * 40}
            x2="740"
            y2={50 + i * 40}
            stroke="#374151"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const value = maxRevenue - (i * range) / 5;
          return (
            <text
              key={i}
              x="45"
              y={55 + i * 40}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="end"
            >
              ₹{(value / 1000000).toFixed(1)}M
            </text>
          );
        })}

        {/* Revenue area */}
        <path
          d={`M 60 ${
            250 - ((chartData[0].revenue - minRevenue) / range) * 200
          } ${chartData
            .map((point, index) => {
              const x = 60 + index * (680 / (chartData.length - 1));
              const y = 250 - ((point.revenue - minRevenue) / range) * 200;
              return `L ${x} ${y}`;
            })
            .join(" ")} L 740 250 L 60 250 Z`}
          fill="url(#revenueAreaGradient)"
        />

        {/* Revenue line */}
        <path
          d={`M 60 ${
            250 - ((chartData[0].revenue - minRevenue) / range) * 200
          } ${chartData
            .map((point, index) => {
              const x = 60 + index * (680 / (chartData.length - 1));
              const y = 250 - ((point.revenue - minRevenue) / range) * 200;
              return `L ${x} ${y}`;
            })
            .join(" ")}`}
          fill="none"
          stroke="url(#revenueLineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points */}
        {chartData.map((point, index) => {
          const x = 60 + index * (680 / (chartData.length - 1));
          const y = 250 - ((point.revenue - minRevenue) / range) * 200;
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="transparent"
                className="hover:fill-blue-400/20 cursor-pointer transition-all duration-200"
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {chartData.map((point, index) => {
          const x = 60 + index * (680 / (chartData.length - 1));
          const date = new Date(point.date);
          return (
            <text
              key={index}
              x={x}
              y="275"
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
            >
              {date.getDate()}/{date.getMonth() + 1}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const CategoryPerformanceChart = ({ data }) => {
  const categoryData = data.inventoryAnalysis.categoryPerformance.slice(0, 6);
  const maxTurnover = Math.max(...categoryData.map((c) => c.turnover));

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 600 300" className="w-full h-full">
        {/* Bars */}
        {categoryData.map((category, index) => {
          const barHeight = (category.turnover / maxTurnover) * 200;
          const x = 80 + index * 80;
          const y = 220 - barHeight;

          return (
            <g key={index}>
              {/* Bar background */}
              <rect
                x={x}
                y="20"
                width="60"
                height="200"
                fill="#374151"
                opacity="0.2"
                rx="4"
              />

              {/* Bar fill */}
              <rect
                x={x}
                y={y}
                width="60"
                height={barHeight}
                fill={`url(#barGradient${index})`}
                rx="4"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              />

              {/* Value label */}
              <text
                x={x + 30}
                y={y - 8}
                fill="#ffffff"
                fontSize="12"
                textAnchor="middle"
                className="font-bold"
              >
                {category.turnover.toFixed(1)}x
              </text>

              {/* Category label */}
              <text
                x={x + 30}
                y="250"
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                className="font-medium"
              >
                {category.category.split(" ")[0]}
              </text>

              {/* Growth indicator */}
              <text
                x={x + 30}
                y="270"
                fill={category.growth > 0 ? "#10b981" : "#ef4444"}
                fontSize="9"
                textAnchor="middle"
              >
                {category.growth > 0 ? "↗" : "↘"}{" "}
                {Math.abs(category.growth).toFixed(1)}%
              </text>
            </g>
          );
        })}

        {/* Gradients */}
        <defs>
          {categoryData.map((_, index) => {
            const colors = [
              "#3b82f6",
              "#6366f1",
              "#8b5cf6",
              "#a855f7",
              "#d946ef",
              "#ec4899",
            ];
            return (
              <linearGradient
                key={index}
                id={`barGradient${index}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={colors[index]} stopOpacity="0.9" />
                <stop
                  offset="100%"
                  stopColor={colors[index]}
                  stopOpacity="0.6"
                />
              </linearGradient>
            );
          })}
        </defs>
      </svg>
    </div>
  );
};

const CustomerFlowHeatmap = ({ data }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Generate heatmap data
  const heatmapData = days.map((day) =>
    hours.map((hour) => ({
      day,
      hour,
      intensity:
        Math.random() * 0.8 +
        0.2 +
        (hour >= 10 && hour <= 20 ? 0.3 : 0) +
        (day === "Sat" || day === "Sun" ? 0.2 : 0),
    }))
  );

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 800 250" className="w-full h-full">
        {/* Heatmap cells */}
        {heatmapData.map((dayData, dayIndex) =>
          dayData.map((cell, hourIndex) => {
            const x = 50 + hourIndex * 30;
            const y = 30 + dayIndex * 28;
            const opacity = cell.intensity;

            return (
              <rect
                key={`${dayIndex}-${hourIndex}`}
                x={x}
                y={y}
                width="28"
                height="26"
                fill="#3b82f6"
                opacity={opacity}
                stroke="#1e293b"
                strokeWidth="0.5"
                className="hover:stroke-blue-400 cursor-pointer transition-all"
              />
            );
          })
        )}

        {/* Y-axis labels (days) */}
        {days.map((day, index) => (
          <text
            key={day}
            x="35"
            y={45 + index * 28}
            fill="#94a3b8"
            fontSize="11"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {day}
          </text>
        ))}

        {/* X-axis labels (hours) */}
        {[0, 6, 12, 18].map((hour) => (
          <text
            key={hour}
            x={65 + hour * 30}
            y="20"
            fill="#94a3b8"
            fontSize="11"
            textAnchor="middle"
          >
            {hour}:00
          </text>
        ))}
      </svg>
    </div>
  );
};

const PerformanceRadarChart = ({ data }) => {
  const metrics = [
    {
      name: "Revenue",
      value: data.performanceMetrics.efficiency.revenue,
      max: 100,
    },
    {
      name: "Inventory",
      value: data.performanceMetrics.efficiency.inventory,
      max: 100,
    },
    {
      name: "Customer",
      value: data.performanceMetrics.efficiency.customer,
      max: 100,
    },
    {
      name: "Operations",
      value: data.analytics.operationalEfficiency.staffProductivity,
      max: 100,
    },
    {
      name: "Quality",
      value: data.analytics.inventoryAnalysis.stockAccuracy,
      max: 100,
    },
    {
      name: "Growth",
      value: data.analytics.revenueAnalysis.growth * 5,
      max: 100,
    },
  ];

  const angleStep = (2 * Math.PI) / metrics.length;
  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  const points = metrics.map((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = (metric.value / metric.max) * radius;
    return {
      x: centerX + value * Math.cos(angle),
      y: centerY + value * Math.sin(angle),
      labelX: centerX + (radius + 25) * Math.cos(angle),
      labelY: centerY + (radius + 25) * Math.sin(angle),
      metric,
    };
  });

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <defs>
          <radialGradient id="radarFillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Radar grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
          <circle
            key={index}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="#374151"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Radar grid lines */}
        {metrics.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={centerX + radius * Math.cos(angle)}
              y2={centerY + radius * Math.sin(angle)}
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.5"
            />
          );
        })}

        {/* Data area */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="url(#radarFillGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={point.labelX}
              y={point.labelY}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-medium"
            >
              {point.metric.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Main Store Analytics Component
export default function StoreAnalytics({ storeId = "WM001" }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedSections, setExpandedSections] = useState(
    new Set(["revenue", "inventory"])
  );
  const statsRef = useRef(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const data = await fetchStoreAnalyticsData(storeId);
      setAnalyticsData(data);
      setLoading(false);
    };

    loadAnalytics();

    if (autoRefresh) {
      const interval = setInterval(loadAnalytics, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [storeId, autoRefresh]);

  // Animate statistics
  useEffect(() => {
    if (!loading && statsRef.current && analyticsData) {
      const statValues = statsRef.current.querySelectorAll(".stat-value");

      gsap.fromTo(
        statValues,
        { textContent: 0 },
        {
          textContent: (i, target) => target.getAttribute("data-value"),
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.1,
        }
      );
    }
  }, [loading, analyticsData]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Store Analytics...</p>
            <p className="text-slate-400 text-sm mt-2">
              Analyzing {storeId} for {currentUser}
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!analyticsData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-white text-xl">Failed to load analytics</p>
            <p className="text-slate-400 text-sm mt-2">
              Please try again later
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const { store, analytics, predictions, alerts } = analyticsData;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 text-white">
        {/* Session info display */}
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-lg px-4 py-3 rounded-xl border border-slate-700/50 flex items-center gap-3 shadow-2xl">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300 text-sm font-medium">
            {currentTime}
          </span>
          <div className="h-4 w-px bg-slate-700/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs text-white font-bold">
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-300 text-sm font-medium">
              {currentUser}
            </span>
          </div>
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[5%] w-[90%] h-[20%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse"></div>
          <div
            className="absolute bottom-0 right-[10%] w-[80%] h-[15%] rounded-full bg-indigo-900/20 blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[20%] right-[30%] w-[40%] h-[30%] rounded-full bg-purple-900/10 blur-[120px] opacity-70 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto py-8 px-4">
          {/* Store Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30">
                      <Store className="h-10 w-10 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {store.name}
                      </h1>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {store.city}, {store.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Store ID: {store.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Manager: {store.manager}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="bg-slate-800/60 border border-slate-600/30 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                    </select>

                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                        autoRefresh
                          ? "bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30"
                          : "bg-slate-700/50 border border-slate-600/30 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          autoRefresh ? "animate-spin" : ""
                        }`}
                      />
                      Auto Refresh
                    </button>

                    <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105">
                      <Download className="h-4 w-4" />
                      Export Report
                    </button>
                  </div>
                </div>

                {/* Store Status Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          store.risk_level === "low"
                            ? "bg-green-400"
                            : store.risk_level === "medium"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        } animate-pulse`}
                      ></div>
                      <span className="text-slate-400 text-sm">Status</span>
                    </div>
                    <div
                      className={`font-bold ${
                        store.risk_level === "low"
                          ? "text-green-400"
                          : store.risk_level === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {store.risk_level.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-400 text-sm">
                        Health Score
                      </span>
                    </div>
                    <div className="text-xl font-bold text-blue-400">
                      {store.health_score}%
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-slate-400 text-sm">Revenue</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      {formatCurrency(store.monthly_revenue)}
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-purple-400" />
                      <span className="text-slate-400 text-sm">Turnover</span>
                    </div>
                    <div className="text-xl font-bold text-purple-400">
                      {store.inventory_turnover}x
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                      <span className="text-slate-400 text-sm">Alerts</span>
                    </div>
                    <div className="text-xl font-bold text-orange-400">
                      {alerts.length}
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-indigo-400" />
                      <span className="text-slate-400 text-sm">AI Score</span>
                    </div>
                    <div className="text-xl font-bold text-indigo-400">
                      {analyticsData.aiInsights.modelAccuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  {
                    id: "revenue",
                    label: "Revenue Analytics",
                    icon: DollarSign,
                  },
                  { id: "inventory", label: "Inventory", icon: Package },
                  { id: "customers", label: "Customer Insights", icon: Users },
                  { id: "operations", label: "Operations", icon: Settings },
                  { id: "predictions", label: "AI Predictions", icon: Brain },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Key Metrics Grid */}
                <div
                  ref={statsRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-2xl p-6 border border-green-700/30 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-400" />
                      </div>
                      <span className="text-slate-300 font-medium">
                        Revenue Growth
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      +
                      <span
                        className="stat-value"
                        data-value={analytics.revenueAnalysis.growth.toFixed(1)}
                      >
                        0
                      </span>
                      %
                    </div>
                    <div className="text-slate-400 text-sm">vs last month</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-2xl p-6 border border-blue-700/30 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Users className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-slate-300 font-medium">
                        Customer Satisfaction
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      <span
                        className="stat-value"
                        data-value={analytics.customerAnalysis.customerSatisfaction.toFixed(
                          1
                        )}
                      >
                        0
                      </span>
                      /10
                    </div>
                    <div className="text-slate-400 text-sm">
                      NPS: +{analytics.customerAnalysis.nps}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 border border-purple-700/30 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Package className="h-6 w-6 text-purple-400" />
                      </div>
                      <span className="text-slate-300 font-medium">
                        Stock Accuracy
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      <span
                        className="stat-value"
                        data-value={analytics.inventoryAnalysis.stockAccuracy.toFixed(
                          1
                        )}
                      >
                        0
                      </span>
                      %
                    </div>
                    <div className="text-slate-400 text-sm">
                      Inventory precision
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Zap className="h-6 w-6 text-amber-400" />
                      </div>
                      <span className="text-slate-300 font-medium">
                        Efficiency Score
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      <span
                        className="stat-value"
                        data-value={analytics.operationalEfficiency.staffProductivity.toFixed(
                          0
                        )}
                      >
                        0
                      </span>
                      %
                    </div>
                    <div className="text-slate-400 text-sm">
                      Overall performance
                    </div>
                  </motion.div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Performance Radar */}
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Performance Overview
                      </h3>
                    </div>
                    <div className="h-64">
                      <PerformanceRadarChart data={analyticsData} />
                    </div>
                  </div>

                  {/* Revenue Trend */}
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <LineChart className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Revenue Trend (14 Days)
                      </h3>
                    </div>
                    <div className="h-64">
                      <RevenueTimeSeriesChart data={analytics} />
                    </div>
                  </div>
                </div>

                {/* Quick Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-5 w-5 text-blue-400" />
                      <h4 className="font-bold text-white">Risk Assessment</h4>
                    </div>
                    <div className="space-y-3">
                      {analytics.riskAssessment.riskFactors.map(
                        (factor, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-slate-400 text-sm">
                              {factor.factor}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-700 rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    factor.score >= 80
                                      ? "bg-green-500"
                                      : factor.score >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${factor.score}%` }}
                                ></div>
                              </div>
                              <span className="text-white text-sm font-medium">
                                {factor.score.toFixed(0)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ThermometerSun className="h-5 w-5 text-orange-400" />
                      <h4 className="font-bold text-white">Weather Impact</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Current Temp
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.weatherImpact.current.temperature.toFixed(
                            0
                          )}
                          °C
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Condition
                        </span>
                        <span className="text-white font-medium">
                          {analyticsData.weatherImpact.current.condition}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Sales Impact
                        </span>
                        <span
                          className={`font-medium ${
                            analyticsData.weatherImpact.current.impact ===
                            "positive"
                              ? "text-green-400"
                              : analyticsData.weatherImpact.current.impact ===
                                "negative"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {analyticsData.weatherImpact.current.impact}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="h-5 w-5 text-purple-400" />
                      <h4 className="font-bold text-white">AI Insights</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Alerts Prevented
                        </span>
                        <span className="text-green-400 font-medium">
                          {analyticsData.aiInsights.alertsPrevented}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Revenue Saved
                        </span>
                        <span className="text-green-400 font-medium">
                          {formatCurrency(
                            analyticsData.aiInsights.revenueSaved
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Confidence
                        </span>
                        <span className="text-purple-400 font-medium">
                          {analyticsData.aiInsights.predictionConfidence.toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "revenue" && (
              <motion.div
                key="revenue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Revenue Analytics Content */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Revenue Analytics Deep Dive
                  </h2>
                  <div className="h-96">
                    <RevenueTimeSeriesChart
                      data={analytics}
                      timeframe="daily"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Category Performance */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Category Performance
                  </h2>
                  <div className="h-80">
                    <CategoryPerformanceChart data={analytics} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "customers" && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Customer Flow Heatmap */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Customer Flow Heatmap
                  </h2>
                  <div className="h-64">
                    <CustomerFlowHeatmap data={analytics} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
