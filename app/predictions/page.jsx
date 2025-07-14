"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  Clock,
  DollarSign,
  Package,
  Zap,
  BarChart3,
  Filter,
  RefreshCw,
  Eye,
  Download,
  Settings,
} from "lucide-react";

import { usePredictions } from "../hooks/usePredictions";
import { geminiService } from "../utils/geminiIntegration";

export default function Predictions({
  compact = false,
  fullView = false,
  onViewAll = () => {},
}) {
  const predictionsRef = useRef(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedConfidence, setSelectedConfidence] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Use the predictions hook to fetch data
  const {
    predictions,
    metadata,
    regionalForecasts,
    marketTrends,
    modelPerformance,
    loading: predictionsLoading,
    error: predictionsError,
    refreshData,
  } = usePredictions();

  // Session info
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:50:18";

  // Filter predictions
  useEffect(() => {
    let filtered = predictions;

    if (selectedConfidence !== "all") {
      const confidenceThreshold = selectedConfidence === "high" ? 0.8 : 0.6;
      filtered = filtered.filter(
        (pred) => pred.confidence >= confidenceThreshold
      );
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (pred) => pred.action_priority === selectedPriority
      );
    }

    setFilteredPredictions(filtered);
  }, [predictions, selectedConfidence, selectedPriority]);

  // Auto refresh predictions every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshData]);

  // Generate AI insights
  const generateInsights = async () => {
    setLoading(true);
    try {
      const insights = await geminiService.generateInventoryPredictions(
        { id: "network", name: "Network Analysis" },
        { predictions: filteredPredictions },
        {
          weather: "Summer conditions",
          festivals: ["Independence Day", "Raksha Bandhan"],
          economic: "Stable growth",
        }
      );
      setAiInsights(insights);
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  // Entrance animations
  useEffect(() => {
    if (predictionsRef.current) {
      gsap.fromTo(
        ".prediction-card",
        { opacity: 0, x: -20, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [filteredPredictions]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "text-green-400";
    if (confidence >= 0.8) return "text-blue-400";
    if (confidence >= 0.7) return "text-yellow-400";
    return "text-red-400";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      immediate: "text-red-400 bg-red-500/20 border-red-500/30",
      high: "text-orange-400 bg-orange-500/20 border-orange-500/30",
      medium: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
      low: "text-green-400 bg-green-500/20 border-green-500/30",
    };
    return colors[priority] || colors.medium;
  };

  const calculateTotalImpact = () => {
    return filteredPredictions.reduce(
      (sum, pred) => sum + (pred.estimated_impact?.revenue_at_risk || 0),
      0
    );
  };

  if (compact) {
    if (predictionsLoading) {
      return (
        <Layout>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    if (predictionsError) {
      return (
        <Layout>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-400">Failed to load predictions</p>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div
          ref={predictionsRef}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Predictions
                  </h3>
                  <p className="text-sm text-gray-400">
                    Next 7-14 days forecast
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onViewAll}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                View All →
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filteredPredictions.slice(0, 3).map((prediction, index) => (
              <motion.div
                key={prediction.id || index}
                className="prediction-card flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      prediction.action_priority === "immediate"
                        ? "bg-red-400"
                        : prediction.action_priority === "high"
                        ? "bg-orange-400"
                        : prediction.action_priority === "medium"
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-white">
                      {prediction.store_name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {prediction.prediction_type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${getConfidenceColor(
                      prediction.confidence
                    )}`}
                  >
                    {Math.round(prediction.confidence * 100)}%
                  </div>
                  <div className="text-xs text-gray-400">confidence</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state for main view
  if (predictionsLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6">
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state for main view
  if (predictionsError) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Failed to Load Predictions
            </h2>
            <p className="text-gray-400 mb-4">
              Unable to fetch prediction data. Please try again.
            </p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div ref={predictionsRef} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              AI Predictions & Forecasts
            </h1>
            <p className="text-gray-400">
              Intelligent inventory predictions across {predictions.length}{" "}
              stores • Updated {currentTime}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Timeframe Selector */}
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Next 7 Days</option>
              <option value="14d">Next 14 Days</option>
              <option value="30d">Next 30 Days</option>
            </select>

            {/* Filters Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>

            {/* Auto Refresh Toggle */}
            <motion.button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              title={
                autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"
              }
            >
              <RefreshCw
                className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
              />
            </motion.button>

            {/* Generate Insights */}
            <motion.button
              onClick={generateInsights}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Brain className="w-4 h-4" />
              )}
              <span>Generate Insights</span>
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

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confidence Level
                  </label>
                  <select
                    value={selectedConfidence}
                    onChange={(e) => setSelectedConfidence(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Confidence Levels</option>
                    <option value="high">High (≥80%)</option>
                    <option value="medium">Medium (≥60%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="immediate">Immediate</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <motion.button
                    onClick={() => {
                      setSelectedConfidence("all");
                      setSelectedPriority("all");
                    }}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Model Accuracy
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {modelPerformance.accuracy || 87.6}%
            </div>
            <div className="text-xs text-gray-400">Last 30 days</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Active Predictions
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {filteredPredictions.length}
            </div>
            <div className="text-xs text-gray-400">Real-time forecasts</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium text-red-400">
                Revenue at Risk
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(calculateTotalImpact())}
            </div>
            <div className="text-xs text-gray-400">Preventable losses</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Prevention Rate
              </span>
            </div>
            <div className="text-2xl font-bold text-white">73%</div>
            <div className="text-xs text-gray-400">Crisis prevented</div>
          </div>
        </div>

        {/* Model Performance Section */}
        {metadata && Object.keys(metadata).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Model Performance
                </h3>
                <p className="text-gray-400">
                  AI model accuracy and statistics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Model Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metadata.model_accuracy}%
                </div>
                <div className="text-xs text-gray-500">
                  Version {metadata.model_version}
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Data Points</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metadata.data_points_used?.toLocaleString() || "N/A"}
                </div>
                <div className="text-xs text-gray-500">Training dataset</div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">
                    Prediction Horizon
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metadata.prediction_horizon?.replace("_", " ") || "N/A"}
                </div>
                <div className="text-xs text-gray-500">Forecast window</div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">
                    Confidence Threshold
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {metadata.confidence_threshold
                    ? Math.round(metadata.confidence_threshold * 100)
                    : "N/A"}
                  %
                </div>
                <div className="text-xs text-gray-500">Minimum confidence</div>
              </div>
            </div>

            {metadata.last_trained && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gray-400">
                  Last trained:{" "}
                  {new Date(metadata.last_trained).toLocaleDateString()} • Last
                  updated:{" "}
                  {new Date(metadata.last_updated).toLocaleDateString()}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* AI Insights Panel */}
        <AnimatePresence>
          {aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI-Generated Insights
                  </h3>
                  <p className="text-sm text-gray-400">
                    Generated at {currentTime} by {currentUser}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-purple-400 mb-3">
                    Immediate Risk Assessment
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.predictions?.immediate_risks?.map(
                      (risk, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">
                              {risk.product}
                            </div>
                            <div className="text-sm text-gray-400">
                              {risk.stockout_probability} probability
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              risk.risk_level === "High"
                                ? "bg-red-500/20 text-red-400"
                                : risk.risk_level === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {risk.risk_level}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-400 mb-3">
                    Demand Surge Predictions
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.predictions?.demand_surge?.map(
                      (surge, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">
                              {surge.category}
                            </div>
                            <div className="text-sm text-gray-400">
                              {surge.driver}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold">
                              +{surge.surge_percentage}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.round(surge.confidence * 100)}% confidence
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Regional Forecasts Section */}
        {regionalForecasts && regionalForecasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Regional Forecasts
                </h3>
                <p className="text-gray-400">Regional market predictions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionalForecasts.slice(0, 6).map((forecast, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">
                      {forecast.region}
                    </h4>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        forecast.growth_outlook === "positive"
                          ? "bg-green-500/20 text-green-400"
                          : forecast.growth_outlook === "negative"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {forecast.growth_outlook}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Growth Rate:</span>
                      <span
                        className={`font-medium ${
                          forecast.expected_growth >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {forecast.expected_growth >= 0 ? "+" : ""}
                        {forecast.expected_growth}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Revenue Impact:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(forecast.estimated_revenue_impact)}
                      </span>
                    </div>
                    {forecast.risk_factors &&
                      forecast.risk_factors.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Risk Factors:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {forecast.risk_factors
                              .slice(0, 2)
                              .map((risk, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded"
                                >
                                  {risk}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Market Trends Section */}
        {marketTrends && marketTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Market Trends</h3>
                <p className="text-gray-400">Industry and market insights</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketTrends.slice(0, 4).map((trend, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-medium">
                      {trend.trend_name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        trend.business_impact === "positive"
                          ? "bg-green-500/20 text-green-400"
                          : trend.business_impact === "negative"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {trend.business_impact}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {trend.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Impact Score:</span>
                      <span className="text-white font-medium">
                        {trend.impact_score}/10
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white font-medium">
                        {Math.round(trend.confidence * 100)}%
                      </span>
                    </div>
                    {trend.recommended_actions &&
                      trend.recommended_actions.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Recommended Actions:
                          </span>
                          <ul className="text-xs text-gray-400 mt-1 space-y-1">
                            {trend.recommended_actions
                              .slice(0, 2)
                              .map((action, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                                  {action}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id || index}
              className="prediction-card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
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
                      }`}
                    ></div>
                    <h4 className="font-bold text-white">
                      {prediction.store_name}
                    </h4>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      prediction.action_priority
                    )}`}
                  >
                    {prediction.action_priority?.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">
                      {prediction.prediction_type}
                    </div>
                    <div className="font-medium text-white">
                      {prediction.predicted_event}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getConfidenceColor(
                        prediction.confidence
                      )}`}
                    >
                      {Math.round(prediction.confidence * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">confidence</div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Expected Date</div>
                    <div className="font-medium text-white">
                      {prediction.predicted_stockout_date
                        ? new Date(
                            prediction.predicted_stockout_date
                          ).toLocaleDateString()
                        : "Within 7-14 days"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Revenue Impact</div>
                    <div className="font-medium text-red-400">
                      {formatCurrency(
                        prediction.estimated_impact?.revenue_at_risk || 0
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Affected Products
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prediction.product_forecasts
                      ?.slice(0, 3)
                      .map((product, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                        >
                          {product.product_name || `Product ${idx + 1}`}
                        </span>
                      ))}
                    {prediction.product_forecasts?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                        +{prediction.product_forecasts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      Updated {Math.floor(Math.random() * 30 + 1)} min ago
                    </span>
                  </div>
                  <motion.button
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </motion.button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </motion.div>
          ))}
        </div>

        {/* Load More / Pagination */}
        {predictions.length > filteredPredictions.length && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Predictions
            </motion.button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
