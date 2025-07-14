"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Zap,
  Package,
  Store,
  Clock,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Download,
  RefreshCw,
  Settings,
  Play,
  Pause,
} from "lucide-react";

import { geminiService } from "../utils/geminiIntegration";
import { useStoreData } from "../hooks/useStoreData";
import { usePredictions } from "../hooks/usePredictions";
import { useAlerts } from "../hooks/useAlerts";

// ROI improvement scenarios
const scenarios = {
  conservative: {
    stockoutReduction: 45, // %
    inventoryOptimization: 15, // %
    costSavings: 25, // %
    revenueIncrease: 8, // %
    multiplier: 0.7,
  },
  realistic: {
    stockoutReduction: 65, // %
    inventoryOptimization: 25, // %
    costSavings: 35, // %
    revenueIncrease: 12, // %
    multiplier: 1.0,
  },
  optimistic: {
    stockoutReduction: 85, // %
    inventoryOptimization: 40, // %
    costSavings: 50, // %
    revenueIncrease: 20, // %
    multiplier: 1.3,
  },
};

export default function ROICalculator({
  stores = [],
  predictions = [],
  alerts = [],
  compact = false,
  fullView = false,
  onExpand = () => {},
}) {
  const calculatorRef = useRef(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months");
  const [calculationMode, setCalculationMode] = useState("conservative"); // conservative, optimistic, realistic
  const [roiData, setRoiData] = useState(null);
  const [aiOptimizations, setAiOptimizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});
  const [showProjections, setShowProjections] = useState(false);
  const [forceShowContent, setForceShowContent] = useState(false);

  // Session info
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:52:50";

  // Use hooks to fetch real data
  const { stores: hookStores, loading: storesLoading } = useStoreData();
  const { predictions: hookPredictions, loading: predictionsLoading } =
    usePredictions();
  const { alerts: hookAlerts, loading: alertsLoading } = useAlerts();

  // Use hook data if no props provided, otherwise use props
  const actualStores = stores.length > 0 ? stores : hookStores || [];
  const actualPredictions =
    predictions.length > 0 ? predictions : hookPredictions || [];
  const actualAlerts = alerts.length > 0 ? alerts : hookAlerts || [];
  // More forgiving loading check - only require stores data
  const isDataLoading = storesLoading && actualStores.length === 0;

  // Debug logging - only on initial load
  useEffect(() => {
    console.log("ROI Calculator Debug:", {
      storesLoading,
      predictionsLoading,
      alertsLoading,
      isDataLoading,
      actualStoresLength: actualStores.length,
      hookStoresLength: hookStores?.length || 0,
      propsStoresLength: stores.length,
    });
  }, [storesLoading]); // Only log when loading state changes

  // Base calculations - memoized to prevent unnecessary recalculations
  const baseMetrics = useMemo(
    () => ({
      totalStores: actualStores.length,
      totalMonthlyRevenue: actualStores.reduce(
        (sum, store) => sum + (store.monthly_revenue || 0),
        0
      ),
      totalInventoryValue: actualStores.reduce(
        (sum, store) => sum + (store.monthly_revenue || 0) * 2.5,
        0
      ), // Estimated
      avgInventoryTurnover:
        actualStores.length > 0
          ? actualStores.reduce(
              (sum, store) => sum + (store.inventory_turnover || 0),
              0
            ) / actualStores.length
          : 0,
      totalStockoutIncidents: actualStores.reduce(
        (sum, store) => sum + (store.stockout_incidents || 0),
        0
      ),
      totalCriticalAlerts: actualAlerts.filter(
        (alert) => alert.priority === "critical"
      ).length,
    }),
    [actualStores, actualAlerts]
  );

  // Calculate ROI projections - memoized to prevent unnecessary recalculations
  const calculateROI = useCallback(() => {
    const scenario = scenarios[calculationMode];
    const timeframeFactor =
      selectedTimeframe === "12months"
        ? 12
        : selectedTimeframe === "6months"
        ? 6
        : 3;

    // Current costs (estimated)
    const currentCosts = {
      stockoutLosses: baseMetrics.totalStockoutIncidents * 500000, // ₹5L per incident
      overstockCosts: baseMetrics.totalInventoryValue * 0.1, // 10% carrying cost
      operationalCosts: baseMetrics.totalMonthlyRevenue * 0.15, // 15% operational
      opportunityCosts: baseMetrics.totalMonthlyRevenue * 0.05, // 5% opportunity cost
    };

    const totalCurrentCosts = Object.values(currentCosts).reduce(
      (sum, cost) => sum + cost,
      0
    );

    // Projected savings
    const projectedSavings = {
      stockoutPrevention:
        currentCosts.stockoutLosses * (scenario.stockoutReduction / 100),
      inventoryOptimization:
        currentCosts.overstockCosts * (scenario.inventoryOptimization / 100),
      operationalEfficiency:
        currentCosts.operationalCosts * (scenario.costSavings / 100),
      revenueIncrease:
        baseMetrics.totalMonthlyRevenue * (scenario.revenueIncrease / 100),
    };

    const totalSavings = Object.values(projectedSavings).reduce(
      (sum, saving) => sum + saving,
      0
    );

    // SmartStock Pro investment (estimated)
    const investmentCost = baseMetrics.totalStores * 50000; // ₹50K per store setup
    const monthlyCost = baseMetrics.totalStores * 5000; // ₹5K per store monthly
    const totalInvestment = investmentCost + monthlyCost * timeframeFactor;

    // ROI calculations
    const netBenefit = totalSavings * timeframeFactor - totalInvestment;
    const roiPercentage = (netBenefit / totalInvestment) * 100;
    const paybackPeriod = totalInvestment / (totalSavings / 12); // months

    return {
      currentCosts,
      projectedSavings,
      totalCurrentCosts,
      totalSavings,
      investmentCost,
      monthlyCost,
      totalInvestment,
      netBenefit,
      roiPercentage,
      paybackPeriod,
      scenario,
      timeframeFactor,
    };
  }, [baseMetrics, calculationMode, selectedTimeframe]);

  // Generate AI optimization recommendations
  const generateOptimizations = async () => {
    setLoading(true);
    try {
      const storeMetrics = {
        monthly_revenue: baseMetrics.totalMonthlyRevenue,
        inventory_turnover: baseMetrics.avgInventoryTurnover,
        inventory_value: baseMetrics.totalInventoryValue,
      };

      const optimizations = await geminiService.generateROIOptimizations(
        storeMetrics,
        { current_roi: roiData?.roiPercentage || 15.2 },
        { volatility: "moderate", competition: "high" }
      );

      setAiOptimizations(optimizations);
    } catch (error) {
      console.error("Failed to generate optimizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize and update ROI data - consolidated effect
  useEffect(() => {
    // Always calculate ROI when dependencies change
    const roi = calculateROI();

    // Only update if there's a meaningful change or if roiData is null
    if (
      !roiData ||
      calculationMode !== roiData.scenario?.name ||
      selectedTimeframe !==
        (roiData.timeframeFactor === 12
          ? "12months"
          : roiData.timeframeFactor === 6
          ? "6months"
          : "3months")
    ) {
      setRoiData(roi);

      // Animate numbers only on significant changes
      Object.keys(roi).forEach((key) => {
        if (
          typeof roi[key] === "number" &&
          !isNaN(roi[key]) &&
          isFinite(roi[key])
        ) {
          const startValue = animatedValues[key] || 0;
          const obj = { value: startValue };

          gsap.to(obj, {
            value: roi[key],
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              const newValue = obj.value;
              if (!isNaN(newValue) && isFinite(newValue)) {
                setAnimatedValues((prev) => ({
                  ...prev,
                  [key]: newValue,
                }));
              }
            },
          });
        }
      });
    }
  }, [
    calculationMode,
    selectedTimeframe,
    actualStores.length,
    actualAlerts.length,
  ]);

  // Entrance animations - only run when roiData is first set
  useEffect(() => {
    if (
      calculatorRef.current &&
      roiData &&
      Object.keys(animatedValues).length > 0
    ) {
      gsap.fromTo(
        ".roi-card",
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
  }, [roiData !== null]); // Only run when roiData changes from null to something

  // Auto refresh ROI calculations every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDataLoading && roiData) {
        const roi = calculateROI();
        setRoiData(roi);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [isDataLoading, roiData]); // Removed calculateROI from dependencies

  // Timeout to force show content after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceShowContent(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // Initial ROI calculation - only run once
  useEffect(() => {
    if (!roiData) {
      const roi = calculateROI();
      setRoiData(roi);
    }
  }, []); // Empty dependency array - only run once

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount) || amount === null || amount === undefined)
      return "₹0";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "₹0";
    if (numAmount >= 10000000) return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
    if (numAmount >= 100000) return `₹${(numAmount / 100000).toFixed(1)}L`;
    return `₹${Math.round(numAmount).toLocaleString()}`;
  };

  const formatROI = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0%";
    const numValue = Number(value);
    if (isNaN(numValue)) return "0%";
    return `${numValue >= 0 ? "+" : ""}${numValue.toFixed(1)}%`;
  };

  // Helper function to safely get animated values with fallback
  const getAnimatedValue = (key, fallback = 0) => {
    const animatedVal = animatedValues[key];
    if (
      animatedVal === null ||
      animatedVal === undefined ||
      isNaN(animatedVal)
    ) {
      return fallback;
    }
    return animatedVal;
  };

  if (compact) {
    if (isDataLoading && !forceShowContent) {
      return (
        <Layout>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-white">Loading ROI data...</span>
            </div>
          </div>
        </Layout>
      );
    }

    const roi = calculateROI();

    return (
      <Layout>
        <div
          ref={calculatorRef}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Calculator className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    ROI Calculator
                  </h3>
                  <p className="text-sm text-gray-400">
                    Investment return analysis
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onExpand}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Expand →
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {formatROI(
                    getAnimatedValue("roiPercentage", roi.roiPercentage)
                  )}
                </div>
                <div className="text-xs text-gray-400">ROI (12 months)</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(
                    getAnimatedValue("netBenefit", roi.netBenefit)
                  )}
                </div>
                <div className="text-xs text-gray-400">Net Benefit</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Investment:</span>
                <span className="text-white font-medium">
                  {formatCurrency(roi.totalInvestment)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Projected Savings:</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(roi.totalSavings * 12)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payback Period:</span>
                <span className="text-blue-400 font-medium">
                  {Math.round(roi.paybackPeriod)} months
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isDataLoading && !forceShowContent) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading ROI Calculator...</p>
            <p className="text-slate-400 text-sm mt-2">
              Analyzing financial data for {currentUser}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Ensure we have stable ROI data
  const currentRoiData = roiData || {
    roiPercentage: 0,
    netBenefit: 0,
    paybackPeriod: 0,
    totalSavings: 0,
    timeframeFactor: 12,
    currentCosts: {},
    projectedSavings: {},
    totalCurrentCosts: 0,
    investmentCost: 0,
    monthlyCost: 0,
  };

  // Show loading only initially or when forced
  if (
    (isDataLoading && !roiData && !forceShowContent) ||
    (!roiData && !forceShowContent)
  ) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <Calculator className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-white text-xl">Calculating ROI...</p>
            <p className="text-slate-400 text-sm mt-2">
              Stores: {actualStores.length} | Loading:{" "}
              {isDataLoading ? "Yes" : "No"}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              Please wait while we process your data
            </p>
            <button
              onClick={() => {
                const roi = calculateROI();
                setRoiData(roi);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Calculate ROI
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div ref={calculatorRef} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              ROI Calculator & Business Impact
            </h1>
            <p className="text-gray-400">
              Investment analysis for {baseMetrics.totalStores} stores •
              Calculated by {currentUser} at {currentTime}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Calculation Mode */}
            <select
              value={calculationMode}
              onChange={(e) => setCalculationMode(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="conservative">Conservative</option>
              <option value="realistic">Realistic</option>
              <option value="optimistic">Optimistic</option>
            </select>

            {/* Timeframe */}
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="12months">12 Months</option>
            </select>

            {/* Generate Optimizations */}
            <motion.button
              onClick={generateOptimizations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>AI Optimize</span>
            </motion.button>

            {/* Export */}
            <motion.button
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="roi-card bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                ROI Projection
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatROI(
                getAnimatedValue("roiPercentage", currentRoiData.roiPercentage)
              )}
            </div>
            <div className="text-sm text-gray-400">
              {selectedTimeframe} timeframe
            </div>
          </div>

          <div className="roi-card bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Net Benefit
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(
                getAnimatedValue("netBenefit", currentRoiData.netBenefit)
              )}
            </div>
            <div className="text-sm text-gray-400">After investment costs</div>
          </div>

          <div className="roi-card bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Payback Period
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(
                getAnimatedValue("paybackPeriod", currentRoiData.paybackPeriod)
              ) || 0}
            </div>
            <div className="text-sm text-gray-400">months to break even</div>
          </div>

          <div className="roi-card bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Total Savings
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(
                getAnimatedValue("totalSavings", currentRoiData.totalSavings) *
                  currentRoiData.timeframeFactor
              )}
            </div>
            <div className="text-sm text-gray-400">Annual projection</div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Analysis */}
          <div className="roi-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-400" />
              Current Costs Analysis
            </h3>

            <div className="space-y-4">
              {Object.entries(currentRoiData.currentCosts).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <span className="text-red-400 font-bold">
                      {formatCurrency(value)}
                    </span>
                  </div>
                )
              )}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">
                    Total Current Costs
                  </span>
                  <span className="text-red-400 font-bold text-lg">
                    {formatCurrency(currentRoiData.totalCurrentCosts)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Projection */}
          <div className="roi-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Projected Savings
            </h3>

            <div className="space-y-4">
              {Object.entries(currentRoiData.projectedSavings).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(value)}
                    </span>
                  </div>
                )
              )}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">
                    Total Monthly Savings
                  </span>
                  <span className="text-green-400 font-bold text-lg">
                    {formatCurrency(currentRoiData.totalSavings)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Optimization Recommendations */}
        <AnimatePresence>
          {aiOptimizations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    AI-Powered ROI Optimization Plan
                  </h3>
                  <p className="text-sm text-gray-400">
                    Generated at {currentTime} by {currentUser}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-400 mb-4">
                    Immediate Improvements (0-30 Days)
                  </h4>
                  <div className="space-y-3">
                    {aiOptimizations.optimization_plan?.immediate_improvements?.map(
                      (improvement, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800/30 rounded-lg"
                        >
                          <div className="font-medium text-white mb-2">
                            {improvement.action}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-400 text-sm">
                              {improvement.impact}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {improvement.timeline}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-400 mb-4">
                    Long-term Strategies (90-180 Days)
                  </h4>
                  <div className="space-y-3">
                    {aiOptimizations.optimization_plan?.growth_strategies?.map(
                      (strategy, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800/30 rounded-lg"
                        >
                          <div className="font-medium text-white mb-2">
                            {strategy.strategy}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-400 text-sm">
                              {strategy.roi}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {strategy.timeline}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">
                      Projected ROI Improvement
                    </div>
                    <div className="text-sm text-gray-400">
                      With AI optimization plan
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {aiOptimizations.projected_roi_improvement}
                    </div>
                    <div className="text-sm text-gray-400">
                      {aiOptimizations.implementation_timeline}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Investment Timeline */}
        <div className="roi-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Investment Timeline & Milestones
          </h3>

          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      Initial Investment & Setup
                    </div>
                    <div className="text-gray-400 text-sm">
                      Month 0-1 •{" "}
                      {formatCurrency(currentRoiData.investmentCost)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      Operational Phase
                    </div>
                    <div className="text-gray-400 text-sm">
                      Month 1-{currentRoiData.timeframeFactor} •{" "}
                      {formatCurrency(currentRoiData.monthlyCost)}/month
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      Break-even Point
                    </div>
                    <div className="text-gray-400 text-sm">
                      Month {Math.round(currentRoiData.paybackPeriod)} •
                      Positive ROI begins
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      Full ROI Realization
                    </div>
                    <div className="text-gray-400 text-sm">
                      Month {currentRoiData.timeframeFactor} •{" "}
                      {formatCurrency(currentRoiData.netBenefit)} net benefit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="roi-card bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            SmartStock Pro Investment Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatROI(currentRoiData.roiPercentage)}
              </div>
              <div className="text-gray-400">Return on Investment</div>
              <div className="text-sm text-green-400 mt-1">
                {calculationMode.charAt(0).toUpperCase() +
                  calculationMode.slice(1)}{" "}
                scenario
              </div>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {Math.round(currentRoiData.paybackPeriod)}
              </div>
              <div className="text-gray-400">Months to Payback</div>
              <div className="text-sm text-blue-400 mt-1">
                Break-even timeline
              </div>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {formatCurrency(currentRoiData.totalSavings * 12)}
              </div>
              <div className="text-gray-400">Annual Savings</div>
              <div className="text-sm text-purple-400 mt-1">
                Projected year 1
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Analysis completed by {currentUser} • {currentTime} • Based on{" "}
              {baseMetrics.totalStores} stores
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
