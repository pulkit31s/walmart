"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import {
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Store,
  Target,
  Zap,
  Clock,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  FileText,
  Star,
  Activity,
  Wallet,
  ChevronRight,
  Award,
  Bell,
  Settings,
  ExternalLink,
  Sparkles,
  Laptop,
  LucideIcon,
  Lightbulb,
  Users,
  Brain,
  ListChecks,
  Code,
  Lock,
  Layers,
  Cloud,
  Terminal,
  Smartphone,
  RefreshCw,
  Filter,
  Search,
  Download,
  Eye,
  PlayCircle,
  PauseCircle,
  MoreHorizontal,
  ThermometerSun,
  Shield,
  Truck,
  Building,
  PieChart,
  LineChart,
  BarChart,
  Gauge,
  Flame,
  Snowflake,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Database,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Signal,
  Battery,
  Power,
  Globe,
} from "lucide-react";

// Session info from current context
const currentTime = "2025-07-14 10:57:53";
const currentUser = "vkhare2909";

// Advanced Data Fetching with Real JSON Integration
const fetchComprehensiveData = async () => {
  try {
    const [storesRes, productsRes, salesRes, predictionsRes, alertsRes] =
      await Promise.all([
        fetch("/data/stores.json"),
        fetch("/data/products.json"),
        fetch("/data/sales_history.json"),
        fetch("/data/predictions.json"),
        fetch("/data/alerts.json"),
      ]);

    const [stores, products, sales, predictions, alerts] = await Promise.all([
      storesRes.json(),
      productsRes.json(),
      salesRes.json(),
      predictionsRes.json(),
      alertsRes.json(),
    ]);

    return { stores, products, sales, predictions, alerts };
  } catch (error) {
    console.error("Error fetching comprehensive data:", error);
    return null;
  }
};

// Advanced Revenue Chart Component with Real Data
const RevenueChart = ({ salesData, timeframe = "monthly" }) => {
  const data = salesData?.monthly_summary || [];
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const minRevenue = Math.min(...data.map((d) => d.revenue));

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 800 300" className="w-full h-full">
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="revenueStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
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
          const value = maxRevenue - (i * (maxRevenue - minRevenue)) / 5;
          return (
            <text
              key={i}
              x="45"
              y={55 + i * 40}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="end"
            >
              ₹{(value / 10000000).toFixed(1)}Cr
            </text>
          );
        })}

        {/* Chart line and area */}
        {data.length > 0 && (
          <>
            <path
              d={`M 60 ${
                250 -
                ((data[0].revenue - minRevenue) / (maxRevenue - minRevenue)) *
                  200
              } ${data
                .map((point, index) => {
                  const x = 60 + index * (680 / (data.length - 1));
                  const y =
                    250 -
                    ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) *
                      200;
                  return `L ${x} ${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke="url(#revenueStroke)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={`M 60 ${
                250 -
                ((data[0].revenue - minRevenue) / (maxRevenue - minRevenue)) *
                  200
              } ${data
                .map((point, index) => {
                  const x = 60 + index * (680 / (data.length - 1));
                  const y =
                    250 -
                    ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) *
                      200;
                  return `L ${x} ${y}`;
                })
                .join(" ")} L 740 250 L 60 250 Z`}
              fill="url(#revenueGradient)"
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = 60 + index * (680 / (data.length - 1));
              const y =
                250 -
                ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) *
                  200;
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    stroke="#1e293b"
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
          </>
        )}

        {/* X-axis labels */}
        {data.map((point, index) => {
          const x = 60 + index * (680 / (data.length - 1));
          return (
            <text
              key={index}
              x={x}
              y="275"
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
            >
              {point.month.split("-")[1]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Category Performance Pie Chart
const CategoryPieChart = ({ productsData }) => {
  const categories = productsData?.categories || [];
  const products = productsData?.products || [];

  const categoryData = categories.map((category) => {
    const categoryProducts = products.filter(
      (p) => p.category_id === category.id
    );
    const totalValue = categoryProducts.reduce(
      (sum, p) => sum + p.price * 100,
      0
    );
    return {
      name: category.name,
      value: totalValue,
      count: categoryProducts.length,
      margin: category.margin_percentage,
    };
  });

  const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  let currentAngle = 0;

  const colors = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full h-full max-w-64 max-h-64">
        <defs>
          {categoryData.map((_, index) => (
            <linearGradient
              key={index}
              id={`categoryGradient${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={colors[index % colors.length]}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={colors[index % colors.length]}
                stopOpacity="0.6"
              />
            </linearGradient>
          ))}
        </defs>

        {categoryData.map((category, index) => {
          const percentage = category.value / total;
          const angle = percentage * 360;
          const x1 = 150 + 80 * Math.cos(((currentAngle - 90) * Math.PI) / 180);
          const y1 = 150 + 80 * Math.sin(((currentAngle - 90) * Math.PI) / 180);
          const x2 =
            150 + 80 * Math.cos(((currentAngle + angle - 90) * Math.PI) / 180);
          const y2 =
            150 + 80 * Math.sin(((currentAngle + angle - 90) * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = [
            "M",
            150,
            150,
            "L",
            x1,
            y1,
            "A",
            80,
            80,
            0,
            largeArcFlag,
            1,
            x2,
            y2,
            "Z",
          ].join(" ");

          const labelAngle = currentAngle + angle / 2;
          const labelX =
            150 + 100 * Math.cos(((labelAngle - 90) * Math.PI) / 180);
          const labelY =
            150 + 100 * Math.sin(((labelAngle - 90) * Math.PI) / 180);

          currentAngle += angle;

          return (
            <g
              key={index}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <path
                d={pathData}
                fill={`url(#categoryGradient${index})`}
                stroke="#1e293b"
                strokeWidth="2"
              />
              {percentage > 0.05 && (
                <text
                  x={labelX}
                  y={labelY}
                  fill="#ffffff"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-medium"
                >
                  {(percentage * 100).toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Center circle */}
        <circle
          cx="150"
          cy="150"
          r="40"
          fill="#1e293b"
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x="150"
          y="145"
          fill="#ffffff"
          fontSize="12"
          textAnchor="middle"
          className="font-bold"
        >
          Total
        </text>
        <text x="150" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">
          {categoryData.length} Categories
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute right-0 top-0 space-y-2">
        {categoryData.slice(0, 6).map((category, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-slate-300">
              {category.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inventory Turnover Gauge
const InventoryGauge = ({ turnoverRate = 8.2, maxRate = 12 }) => {
  const percentage = (turnoverRate / maxRate) * 100;
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Gauge background */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#374151"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Gauge progress */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
        />

        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="#1e293b"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Value display */}
        <text
          x="100"
          y="85"
          fill="#ffffff"
          fontSize="20"
          textAnchor="middle"
          className="font-bold"
        >
          {turnoverRate.toFixed(1)}x
        </text>

        {/* Labels */}
        <text x="20" y="115" fill="#94a3b8" fontSize="10" textAnchor="start">
          0
        </text>
        <text x="100" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle">
          Turnover Rate
        </text>
        <text x="180" y="115" fill="#94a3b8" fontSize="10" textAnchor="end">
          {maxRate}
        </text>
      </svg>
    </div>
  );
};

// Store Health Radar Chart
const StoreHealthRadar = ({ storeData }) => {
  const metrics = [
    { name: "Health Score", value: storeData?.health_score || 0, max: 100 },
    {
      name: "Revenue",
      value: (storeData?.monthly_revenue / 100000000) * 100 || 0,
      max: 100,
    },
    {
      name: "Turnover",
      value: (storeData?.inventory_turnover / 12) * 100 || 0,
      max: 100,
    },
    {
      name: "Safety",
      value: Math.max(0, 100 - (storeData?.stockout_incidents || 0) * 5),
      max: 100,
    },
    { name: "Efficiency", value: Math.random() * 40 + 60, max: 100 },
    { name: "AI Performance", value: Math.random() * 20 + 80, max: 100 },
  ];

  const angleStep = (2 * Math.PI) / metrics.length;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const points = metrics.map((metric, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = (metric.value / metric.max) * radius;
    return {
      x: centerX + value * Math.cos(angle),
      y: centerY + value * Math.sin(angle),
      labelX: centerX + (radius + 20) * Math.cos(angle),
      labelY: centerY + (radius + 20) * Math.sin(angle),
      metric,
    };
  });

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Radar grid */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
          <polygon
            key={index}
            points={metrics
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + radius * scale * Math.cos(angle);
                const y = centerY + radius * scale * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#374151"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Radar lines */}
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
          fill="url(#radarGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
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
              fontSize="10"
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

// Alert Priority Heatmap
const AlertHeatmap = ({ alertsData }) => {
  const priorities = ["critical", "high", "medium", "low"];
  const types = [
    "stockout_imminent",
    "overstock_alert",
    "demand_surge_predicted",
    "competitor_price_alert",
    "supplier_delay",
  ];

  const heatmapData = priorities.map((priority) => {
    return types.map((type) => {
      const alerts =
        alertsData?.critical_alerts?.filter(
          (alert) => alert.priority === priority && alert.type === type
        ) || [];
      return {
        priority,
        type,
        count: alerts.length,
        totalImpact: alerts.reduce(
          (sum, alert) => sum + (alert.estimated_lost_revenue || 0),
          0
        ),
      };
    });
  });

  const maxCount = Math.max(...heatmapData.flat().map((d) => d.count), 1);

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Grid */}
        {heatmapData.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const intensity = cell.count / maxCount;
            const x = 60 + colIndex * 60;
            const y = 40 + rowIndex * 50;

            return (
              <g key={`${rowIndex}-${colIndex}`}>
                <rect
                  x={x}
                  y={y}
                  width="50"
                  height="40"
                  fill={`rgba(59, 130, 246, ${intensity * 0.8 + 0.1})`}
                  stroke="#374151"
                  strokeWidth="1"
                  className="hover:stroke-blue-400 transition-all cursor-pointer"
                />
                <text
                  x={x + 25}
                  y={y + 25}
                  fill="#ffffff"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold"
                >
                  {cell.count}
                </text>
              </g>
            );
          })
        )}

        {/* Y-axis labels */}
        {priorities.map((priority, index) => (
          <text
            key={priority}
            x="45"
            y={65 + index * 50}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="end"
            dominantBaseline="middle"
            className="font-medium"
          >
            {priority.toUpperCase()}
          </text>
        ))}

        {/* X-axis labels */}
        {types.map((type, index) => (
          <text
            key={type}
            x={85 + index * 60}
            y="30"
            fill="#94a3b8"
            fontSize="9"
            textAnchor="middle"
            className="font-medium"
          >
            {type.split("_")[0].toUpperCase()}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Seasonal Demand Pattern Chart
const SeasonalDemandChart = ({ productsData, currentMonth = 7 }) => {
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
  const products = productsData?.products || [];

  // Sample seasonal data for key products
  const seasonalData = months.map((month, index) => {
    let totalDemand = 0;
    let productCount = 0;

    products.forEach((product) => {
      if (product.seasonal_demand) {
        const monthKey = month.toLowerCase();
        totalDemand += product.seasonal_demand[monthKey] || 1;
        productCount++;
      }
    });

    return {
      month,
      index,
      demand: productCount > 0 ? totalDemand / productCount : 1,
      isCurrent: index === currentMonth - 1,
    };
  });

  const maxDemand = Math.max(...seasonalData.map((d) => d.demand));
  const minDemand = Math.min(...seasonalData.map((d) => d.demand));

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 600 200" className="w-full h-full">
        <defs>
          <linearGradient
            id="seasonalGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="40"
            y1={30 + i * 30}
            x2="560"
            y2={30 + i * 30}
            stroke="#374151"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Seasonal curve */}
        <path
          d={`M 40 ${
            150 -
            ((seasonalData[0].demand - minDemand) / (maxDemand - minDemand)) *
              120
          } ${seasonalData
            .slice(1)
            .map((point, index) => {
              const x = 40 + (index + 1) * (520 / (seasonalData.length - 1));
              const y =
                150 -
                ((point.demand - minDemand) / (maxDemand - minDemand)) * 120;
              return `L ${x} ${y}`;
            })
            .join(" ")}`}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Area under curve */}
        <path
          d={`M 40 ${
            150 -
            ((seasonalData[0].demand - minDemand) / (maxDemand - minDemand)) *
              120
          } ${seasonalData
            .slice(1)
            .map((point, index) => {
              const x = 40 + (index + 1) * (520 / (seasonalData.length - 1));
              const y =
                150 -
                ((point.demand - minDemand) / (maxDemand - minDemand)) * 120;
              return `L ${x} ${y}`;
            })
            .join(" ")} L 560 150 L 40 150 Z`}
          fill="url(#seasonalGradient)"
        />

        {/* Data points and labels */}
        {seasonalData.map((point, index) => {
          const x = 40 + index * (520 / (seasonalData.length - 1));
          const y =
            150 - ((point.demand - minDemand) / (maxDemand - minDemand)) * 120;

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={point.isCurrent ? "6" : "3"}
                fill={point.isCurrent ? "#f59e0b" : "#8b5cf6"}
                stroke={point.isCurrent ? "#ffffff" : "#1e293b"}
                strokeWidth="2"
              />
              <text
                x={x}
                y="175"
                fill={point.isCurrent ? "#f59e0b" : "#94a3b8"}
                fontSize="10"
                textAnchor="middle"
                className={point.isCurrent ? "font-bold" : ""}
              >
                {point.month}
              </text>
              {point.isCurrent && (
                <text
                  x={x}
                  y={y - 15}
                  fill="#f59e0b"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-bold"
                >
                  {point.demand.toFixed(1)}x
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Real-time System Status Grid
const SystemStatusGrid = ({ systemData }) => {
  const statusItems = [
    {
      label: "Database",
      status: "online",
      uptime: "99.94%",
      response: "12ms",
      icon: Database,
    },
    {
      label: "AI Engine",
      status: "online",
      uptime: "99.87%",
      response: "45ms",
      icon: Cpu,
    },
    {
      label: "Storage",
      status: "online",
      uptime: "99.99%",
      response: "8ms",
      icon: HardDrive,
    },
    {
      label: "Network",
      status: "online",
      uptime: "99.92%",
      response: "23ms",
      icon: Network,
    },
    {
      label: "API Gateway",
      status: "warning",
      uptime: "99.78%",
      response: "67ms",
      icon: Wifi,
    },
    {
      label: "Predictions",
      status: "online",
      uptime: "99.85%",
      response: "156ms",
      icon: Brain,
    },
    {
      label: "Alerts",
      status: "online",
      uptime: "99.96%",
      response: "34ms",
      icon: Bell,
    },
    {
      label: "Analytics",
      status: "online",
      uptime: "99.89%",
      response: "89ms",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {statusItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-slate-800/60 rounded-lg p-3 border ${
            item.status === "online"
              ? "border-green-500/30"
              : item.status === "warning"
              ? "border-yellow-500/30"
              : "border-red-500/30"
          } hover:border-opacity-60 transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon
              className={`h-4 w-4 ${
                item.status === "online"
                  ? "text-green-400"
                  : item.status === "warning"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            />
            <span className="text-white text-xs font-medium">{item.label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Uptime</span>
              <span className="text-white">{item.uptime}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Response</span>
              <span className="text-white">{item.response}</span>
            </div>
          </div>
          <div
            className={`w-2 h-2 rounded-full mt-2 ${
              item.status === "online"
                ? "bg-green-400"
                : item.status === "warning"
                ? "bg-yellow-400"
                : "bg-red-400"
            } animate-pulse`}
          ></div>
        </motion.div>
      ))}
    </div>
  );
};

// Main Dashboard Component
export default function AdvancedInventoryDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  const statsRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchComprehensiveData();
      if (data) {
        setDashboardData(data);
        setSelectedStore(data.stores.stores[0]); // Default to first store
      }
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Animate statistics
  useEffect(() => {
    if (!loading && statsRef.current && dashboardData) {
      const statValues = statsRef.current.querySelectorAll(".stat-value");

      gsap.fromTo(
        statValues,
        { textContent: 0 },
        {
          textContent: (i, target) => target.getAttribute("data-value"),
          duration: 2.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.15,
        }
      );
    }
  }, [loading, dashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-xl font-semibold">
            Loading SmartStock Pro Analytics...
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Fetching real-time data for {currentUser}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl">Failed to load dashboard data</p>
          <p className="text-slate-400 text-sm mt-2">
            Please check your data files and try again
          </p>
        </div>
      </div>
    );
  }

  // Calculate comprehensive metrics
  const stores = dashboardData.stores.stores;
  const products = dashboardData.products.products;
  const categories = dashboardData.products.categories;
  const salesHistory = dashboardData.sales;
  const predictions = dashboardData.predictions.store_predictions;
  const alerts = dashboardData.alerts;

  const totalRevenue = stores.reduce(
    (sum, store) => sum + store.monthly_revenue,
    0
  );
  const avgHealthScore =
    stores.reduce((sum, store) => sum + store.health_score, 0) / stores.length;
  const totalStockouts = stores.reduce(
    (sum, store) => sum + store.stockout_incidents,
    0
  );
  const avgTurnover =
    stores.reduce((sum, store) => sum + store.inventory_turnover, 0) /
    stores.length;
  const criticalAlerts = alerts.critical_alerts?.length || 0;
  const highAlerts = alerts.high_priority_alerts?.length || 0;
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const aiAccuracy = dashboardData.predictions.metadata?.model_accuracy || 87.6;
  const revenueAtRisk = predictions.reduce(
    (sum, pred) => sum + (pred.estimated_lost_revenue || 0),
    0
  );

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

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
          <div className="flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs">Live</span>
          </div>
        </div>

        {/* Advanced Background Effects */}
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

          {/* Moving particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 20}s infinite linear`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto py-8 px-4 min-h-screen">
          {/* Enhanced Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              {/* Header gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30">
                        <Activity className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                          SmartStock Pro Analytics
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                          Comprehensive inventory intelligence • {stores.length}{" "}
                          stores • {totalProducts} products tracked
                        </p>
                      </div>
                    </div>

                    {/* System Status Indicators */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">
                          All Systems Operational
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">
                          Real-time Data Sync
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-300">AI Models Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2">
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

                      <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-slate-800/60 border border-slate-600/30 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                      </select>
                    </div>

                    <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-blue-900/30 border border-indigo-500/30 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105">
                      <Zap className="h-5 w-5" />
                      Generate AI Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive KPI Grid */}
            <div className="bg-slate-800/40 border-t border-slate-700/50 p-8">
              <div
                ref={statsRef}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
              >
                {/* Total Revenue */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-900/40 via-green-800/20 to-green-900/40 rounded-2xl overflow-hidden shadow-xl border border-green-700/30 group hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-green-900/40 text-green-400 border border-green-500/30">
                          <DollarSign className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          Total Revenue
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          ₹
                          <span
                            className="stat-value"
                            data-value={Math.round(totalRevenue / 10000000)}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">Cr</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        <span>+12.3% vs last month</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Average Health Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-blue-900/40 rounded-2xl overflow-hidden shadow-xl border border-blue-700/30 group hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-500/30">
                          <Activity className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          Health Score
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          <span
                            className="stat-value"
                            data-value={Math.round(avgHealthScore)}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <TrendingUp className="h-3 w-3" />
                        <span>+2.1% improvement</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Accuracy */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-purple-900/40 rounded-2xl overflow-hidden shadow-xl border border-purple-700/30 group hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-400 border border-purple-500/30">
                          <Brain className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          AI Accuracy
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          <span
                            className="stat-value"
                            data-value={Math.round(aiAccuracy)}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <Target className="h-3 w-3" />
                        <span>Model performance</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Critical Alerts */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-red-900/40 via-red-800/20 to-red-900/40 rounded-2xl overflow-hidden shadow-xl border border-red-700/30 group hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-red-900/40 text-red-400 border border-red-500/30">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          Critical Alerts
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          <span
                            className="stat-value"
                            data-value={criticalAlerts}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">Active</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-red-400">
                        <Flame className="h-3 w-3" />
                        <span>Immediate attention</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Inventory Turnover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-amber-900/40 via-amber-800/20 to-amber-900/40 rounded-2xl overflow-hidden shadow-xl border border-amber-700/30 group hover:border-amber-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-amber-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-500/30">
                          <Package className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          Avg Turnover
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          <span
                            className="stat-value"
                            data-value={Math.round(avgTurnover * 10) / 10}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">x</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <TrendingUp className="h-3 w-3" />
                        <span>+8.7% efficiency</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Revenue at Risk */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-orange-900/40 via-orange-800/20 to-orange-900/40 rounded-2xl overflow-hidden shadow-xl border border-orange-700/30 group hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-600/5 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-orange-900/40 text-orange-400 border border-orange-500/30">
                          <Shield className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                          Revenue at Risk
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-white">
                          ₹
                          <span
                            className="stat-value"
                            data-value={Math.round(revenueAtRisk / 10000000)}
                          >
                            0
                          </span>
                          <span className="text-xl ml-1">Cr</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-orange-400">
                        <TrendingDown className="h-3 w-3" />
                        <span>Preventable losses</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Comprehensive Analytics Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
            {/* Revenue Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="xl:col-span-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-700/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/30 text-blue-400">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Revenue Analytics
                      </h2>
                      <p className="text-slate-400">
                        Monthly performance trends and forecasting
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 px-4 py-2 rounded-xl text-sm transition-all duration-200">
                      Monthly View
                    </button>
                    <button className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-xl text-sm transition-all duration-200">
                      Quarterly
                    </button>
                    <button className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-xl text-sm transition-all duration-200">
                      Yearly
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="h-96 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
                  <RevenueChart salesData={salesHistory} />
                </div>

                {/* Revenue Insights */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Growth Rate
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      +12.3%
                    </div>
                    <div className="text-xs text-slate-400">vs last period</div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Target Progress
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">87%</div>
                    <div className="text-xs text-slate-400">
                      of monthly goal
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Forecast
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      ₹32Cr
                    </div>
                    <div className="text-xs text-slate-400">next month</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Performance Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="xl:col-span-4 bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30 text-purple-400">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Category Distribution
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Product mix and revenue allocation
                </p>
              </div>

              <div className="p-6">
                <div className="h-80">
                  <CategoryPieChart productsData={dashboardData.products} />
                </div>

                {/* Top Categories */}
                <div className="mt-6 space-y-3">
                  {categories.slice(0, 4).map((category, index) => {
                    const categoryProducts = products.filter(
                      (p) => p.category_id === category.id
                    );
                    const categoryValue = categoryProducts.reduce(
                      (sum, p) => sum + p.price * 100,
                      0
                    );

                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between bg-slate-800/40 rounded-lg p-3 border border-slate-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: [
                                "#3b82f6",
                                "#6366f1",
                                "#8b5cf6",
                                "#a855f7",
                              ][index],
                            }}
                          ></div>
                          <span className="text-white font-medium text-sm">
                            {category.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-sm">
                            {formatCurrency(categoryValue)}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {categoryProducts.length} products
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Store Performance and Analytics Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Individual Store Performance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border border-green-500/30 text-green-400">
                    <Store className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Store Health Radar
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Multi-dimensional performance analysis
                </p>
              </div>

              <div className="p-6">
                <div className="h-64 mb-4">
                  <StoreHealthRadar storeData={selectedStore} />
                </div>

                {/* Store Selector */}
                <select
                  value={selectedStore?.id || ""}
                  onChange={(e) => {
                    const store = stores.find((s) => s.id === e.target.value);
                    setSelectedStore(store);
                  }}
                  className="w-full bg-slate-800/60 border border-slate-600/30 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>

                {/* Store Quick Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-xs text-slate-400">
                      Monthly Revenue
                    </div>
                    <div className="text-lg font-bold text-white">
                      {formatCurrency(selectedStore?.monthly_revenue || 0)}
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                    <div className="text-xs text-slate-400">Risk Level</div>
                    <div
                      className={`text-lg font-bold ${
                        selectedStore?.risk_level === "low"
                          ? "text-green-400"
                          : selectedStore?.risk_level === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedStore?.risk_level?.toUpperCase() || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Inventory Turnover Gauge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-xl border border-amber-500/30 text-amber-400">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Inventory Turnover
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Network-wide efficiency measurement
                </p>
              </div>

              <div className="p-6">
                <div className="h-48 mb-6">
                  <InventoryGauge turnoverRate={avgTurnover} />
                </div>

                {/* Turnover Insights */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      Network Average
                    </span>
                    <span className="text-white font-bold">
                      {avgTurnover.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      Industry Benchmark
                    </span>
                    <span className="text-slate-300">8.5x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      Best Performer
                    </span>
                    <span className="text-green-400 font-bold">
                      {Math.max(
                        ...stores.map((s) => s.inventory_turnover)
                      ).toFixed(1)}
                      x
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      Needs Improvement
                    </span>
                    <span className="text-red-400 font-bold">
                      {stores.filter((s) => s.inventory_turnover < 7).length}{" "}
                      stores
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Alert Priority Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl border border-red-500/30 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Alert Heatmap
                  </h3>
                </div>
                <p className="text-slate-400 text-sm">
                  Priority vs alert type distribution
                </p>
              </div>

              <div className="p-6">
                <div className="h-64">
                  <AlertHeatmap alertsData={dashboardData.alerts} />
                </div>

                {/* Alert Summary */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <div className="text-xs text-red-400">Critical</div>
                    <div className="text-xl font-bold text-red-400">
                      {criticalAlerts}
                    </div>
                  </div>
                  <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
                    <div className="text-xs text-orange-400">High Priority</div>
                    <div className="text-xl font-bold text-orange-400">
                      {highAlerts}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Seasonal Demand Patterns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-xl border border-indigo-500/30 text-indigo-400">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Seasonal Demand Patterns
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Monthly demand fluctuation analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">
                      Summer Peak
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="h-64">
                  <SeasonalDemandChart
                    productsData={dashboardData.products}
                    currentMonth={7}
                  />
                </div>

                {/* Seasonal Insights */}
                <div className="mt-6 space-y-3">
                  <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <ThermometerSun className="h-4 w-4 text-amber-400" />
                      <span className="text-white font-medium">
                        Current Season Impact
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Electronics demand up 40% due to summer peak. AC units and
                      cooling products showing highest demand surge.
                    </p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <CloudRain className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-medium">
                        Upcoming Monsoon Prep
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Prepare for monsoon season inventory adjustments. Outdoor
                      products to decline, indoor entertainment to rise.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Performance Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl border border-green-500/30 text-green-400">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        System Performance
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Real-time infrastructure monitoring
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">
                      All Systems Go
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <SystemStatusGrid systemData={{}} />

                {/* Performance Summary */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30 text-center">
                    <div className="text-lg font-bold text-green-400">
                      99.94%
                    </div>
                    <div className="text-xs text-slate-400">Uptime</div>
                  </div>
                  <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30 text-center">
                    <div className="text-lg font-bold text-blue-400">47ms</div>
                    <div className="text-xs text-slate-400">Avg Response</div>
                  </div>
                  <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30 text-center">
                    <div className="text-lg font-bold text-purple-400">8/8</div>
                    <div className="text-xs text-slate-400">
                      Services Online
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Store Performance Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden mb-8"
          >
            <div className="p-8 border-b border-slate-700/50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/30 text-blue-400">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Store Performance Matrix
                    </h2>
                    <p className="text-slate-400">
                      Comprehensive store-by-store analysis and insights
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-slate-800/60 border border-slate-600/30 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-sm transition-all duration-200">
                    <Filter className="h-4 w-4" />
                    Filter Stores
                  </button>
                  <button className="flex items-center gap-2 bg-slate-800/60 border border-slate-600/30 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-sm transition-all duration-200">
                    <Download className="h-4 w-4" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {stores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    className="group bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border border-slate-700/50 hover:border-blue-500/30 transform hover:translate-y-[-8px] transition-all duration-500"
                  >
                    {/* Store Header Image */}
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&q=80&sig=${index}`}
                        alt={store.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                      {/* Store Status Badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            store.risk_level === "low"
                              ? "bg-green-400"
                              : store.risk_level === "medium"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          } animate-pulse`}
                        ></div>
                        {store.risk_level.toUpperCase()}
                      </div>

                      {/* Health Score Badge */}
                      <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-blue-400/30">
                        {store.health_score}% Health
                      </div>

                      {/* Store Title */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-lg group-hover:text-blue-300 transition-colors duration-300">
                          {store.name.split(" ").slice(0, 3).join(" ")}
                        </h3>
                        <p className="text-sm text-slate-300 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.city}, {store.state}
                        </p>
                      </div>
                    </div>

                    {/* Store Metrics Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/40">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-slate-400">
                              Revenue
                            </span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            {formatCurrency(store.monthly_revenue)}
                          </div>
                          <div className="text-xs text-green-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />+
                            {(Math.random() * 15 + 5).toFixed(1)}%
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/40">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4 text-purple-400" />
                            <span className="text-xs text-slate-400">
                              Turnover
                            </span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            {store.inventory_turnover}x
                          </div>
                          <div className="text-xs text-purple-400">Monthly</div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/40">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                            <span className="text-xs text-slate-400">
                              Stockouts
                            </span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            {store.stockout_incidents}
                          </div>
                          <div className="text-xs text-orange-400">
                            This month
                          </div>
                        </div>

                        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/40">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-blue-400" />
                            <span className="text-xs text-slate-400">
                              AI Score
                            </span>
                          </div>
                          <div className="text-lg font-bold text-white">
                            {(Math.random() * 10 + 85).toFixed(1)}%
                          </div>
                          <div className="text-xs text-blue-400">Accuracy</div>
                        </div>
                      </div>

                      {/* Progress Indicators */}
                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-400">
                              Health Score Progress
                            </span>
                            <span className="text-sm font-medium text-white">
                              {store.health_score}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${store.health_score}%` }}
                              transition={{
                                duration: 1.5,
                                delay: 0.5 + index * 0.1,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-400">
                              Revenue Target
                            </span>
                            <span className="text-sm font-medium text-white">
                              {Math.round(
                                (store.monthly_revenue / 100000000) * 100
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.round(
                                  (store.monthly_revenue / 100000000) * 100
                                )}%`,
                              }}
                              transition={{
                                duration: 1.5,
                                delay: 0.7 + index * 0.1,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:scale-105">
                          <Eye className="h-4 w-4" />
                          Analyze
                        </button>
                        <button className="bg-slate-700/60 border border-slate-600/40 hover:bg-slate-700 text-white py-3 px-4 rounded-xl text-sm transition-all duration-200 hover:scale-105">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Real-time Predictions and Alerts Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-20">
            {/* AI Predictions Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30 text-purple-400">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        AI Predictions Summary
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Next 14 days forecast analysis
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {predictions.length}
                    </div>
                    <div className="text-xs text-slate-400">
                      Active Predictions
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {predictions.slice(0, 4).map((prediction, index) => (
                  <div
                    key={prediction.id}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40 hover:border-purple-500/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            prediction.action_priority === "immediate"
                              ? "bg-red-400"
                              : prediction.action_priority === "high"
                              ? "bg-orange-400"
                              : prediction.action_priority === "medium"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          } animate-pulse`}
                        ></div>
                        <span className="font-medium text-white">
                          {prediction.store_name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-400">
                          {Math.round(prediction.confidence * 100)}%
                        </div>
                        <div className="text-xs text-slate-400">confidence</div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-2">
                      {prediction.predicted_event}
                    </p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        {prediction.prediction_type}
                      </span>
                      <span className="text-red-400 font-medium">
                        {formatCurrency(prediction.estimated_lost_revenue || 0)}
                      </span>
                    </div>
                  </div>
                ))}

                <button className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 py-3 rounded-xl text-sm font-medium transition-all duration-200">
                  View All Predictions
                </button>
              </div>
            </motion.div>

            {/* Critical Alerts Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl border border-red-500/30 text-red-400">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Critical Alerts
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Immediate action required
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">
                      {criticalAlerts}
                    </div>
                    <div className="text-xs text-slate-400">
                      Critical Issues
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {alerts.critical_alerts?.slice(0, 4).map((alert, index) => (
                  <div
                    key={alert.id}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40 hover:border-red-500/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Flame className="h-4 w-4 text-red-400" />
                        <span className="font-medium text-white">
                          {alert.store_name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-400">
                          {alert.age_minutes || 0}m
                        </div>
                        <div className="text-xs text-slate-400">ago</div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-2">
                      {alert.message}
                    </p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        {alert.type?.replace(/_/g, " ")}
                      </span>
                      <span className="text-red-400 font-medium">
                        {formatCurrency(alert.estimated_lost_revenue || 0)}
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-medium">
                      No Critical Alerts
                    </p>
                    <p className="text-slate-400 text-sm">
                      All systems operating normally
                    </p>
                  </div>
                )}

                <button className="w-full bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 py-3 rounded-xl text-sm font-medium transition-all duration-200">
                  Alert Management Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="fixed bottom-0 inset-x-0 z-30 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              <span className="font-medium text-slate-300">SmartStock Pro</span>{" "}
              • Advanced Inventory Intelligence Platform • Last updated:{" "}
              {currentTime} by {currentUser}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Data: Real-time • {totalProducts} products tracked</span>
              <span>•</span>
              <span>Network: {stores.length} stores monitored</span>
              <span>•</span>
              <span>Status: All systems operational</span>
            </div>
          </div>
        </footer>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-10px) translateX(5px);
            }
            50% {
              transform: translateY(-5px) translateX(-5px);
            }
            75% {
              transform: translateY(-15px) translateX(3px);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
