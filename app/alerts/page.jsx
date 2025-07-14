"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Package,
  DollarSign,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Bell,
  Users,
  Store,
  RefreshCw,
  Settings,
  Download,
  ArrowRight,
  Flame,
  Shield,
} from "lucide-react";

import { useAlerts } from "../hooks/useAlerts";
import { geminiService } from "../utils/geminiIntegration";

export default function Alerts({
  compact = false,
  fullView = false,
  onViewAll = () => {},
}) {
  const alertsRef = useRef(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Use the alerts hook to fetch data
  const {
    alerts,
    summary,
    recommendations,
    performance,
    loading: alertsLoading,
    error: alertsError,
    refreshData,
  } = useAlerts();

  // Session info
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:52:50";

  // Filter alerts
  useEffect(() => {
    let filtered = alerts;

    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (alert) => alert.priority === selectedPriority
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((alert) => alert.type === selectedType);
    }

    // Exclude acknowledged alerts in compact view
    if (compact) {
      filtered = filtered.filter((alert) => !acknowledgedAlerts.has(alert.id));
    }

    setFilteredAlerts(filtered);
  }, [alerts, selectedPriority, selectedType, acknowledgedAlerts, compact]);

  // Auto refresh alerts every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshData]);

  // Generate AI crisis recommendations
  const generateCrisisRecommendations = async (alert) => {
    setLoading(true);
    try {
      const recommendations = await geminiService.generateCrisisRecommendations(
        alert,
        { name: alert.store_name, city: alert.store_location || "Mumbai" },
        {
          similar_incidents: 3,
          avg_resolution: "4-6 hours",
          success_rate: "87%",
        }
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to generate crisis recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Alert entrance animations
  useEffect(() => {
    if (alertsRef.current) {
      gsap.fromTo(
        ".alert-card",
        { opacity: 0, x: -30, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      // Pulse animation for critical alerts
      gsap.to(".critical-pulse", {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [filteredAlerts]);

  // Acknowledge alert
  const acknowledgeAlert = (alertId) => {
    setAcknowledgedAlerts((prev) => new Set([...prev, alertId]));

    // Animation for acknowledgment
    gsap.to(`[data-alert-id="${alertId}"]`, {
      opacity: 0.5,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getAlertIcon = (type) => {
    const icons = {
      stockout_imminent: Package,
      overstock_alert: TrendingUp,
      demand_surge_predicted: Zap,
      competitor_price_alert: DollarSign,
      supplier_delay: Clock,
      quality_issue: Shield,
    };
    return icons[type] || AlertTriangle;
  };

  const getAlertColor = (priority) => {
    const colors = {
      critical: "border-red-500/50 bg-red-500/5",
      high: "border-orange-500/50 bg-orange-500/5",
      medium: "border-yellow-500/50 bg-yellow-500/5",
      low: "border-green-500/50 bg-green-500/5",
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    if (priority === "critical") return Flame;
    if (priority === "high") return AlertTriangle;
    return Bell;
  };

  const calculateTotalImpact = () => {
    return filteredAlerts.reduce(
      (sum, alert) => sum + (alert.estimated_lost_revenue || 0),
      0
    );
  };

  if (compact) {
    return (
      <Layout>
        <div
          ref={alertsRef}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
        >
          {/* Loading State for Compact View */}
          {alertsLoading && (
            <div className="p-6 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-red-400 animate-spin" />
                <span className="text-white">Loading alerts...</span>
              </div>
            </div>
          )}

          {/* Error State for Compact View */}
          {alertsError && (
            <div className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-white font-medium">
                    Error Loading Alerts
                  </h3>
                  <button
                    onClick={refreshData}
                    className="text-red-400 hover:text-red-300 text-sm font-medium mt-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content for Compact View */}
          {!alertsLoading && !alertsError && (
            <>
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Critical Alerts
                      </h3>
                      <p className="text-sm text-gray-400">
                        Requiring immediate attention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-red-400">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-bold">
                        {
                          filteredAlerts.filter(
                            (a) => a.priority === "critical"
                          ).length
                        }
                      </span>
                    </div>
                    <motion.button
                      onClick={onViewAll}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      View All →
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {filteredAlerts.slice(0, 4).map((alert, index) => {
                  const AlertIcon = getAlertIcon(alert.type);
                  const PriorityIcon = getPriorityIcon(alert.priority);

                  return (
                    <motion.div
                      key={alert.id}
                      data-alert-id={alert.id}
                      className={`alert-card p-4 border rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-700/30 ${getAlertColor(
                        alert.priority
                      )} ${
                        alert.priority === "critical" ? "critical-pulse" : ""
                      }`}
                      onClick={() => generateCrisisRecommendations(alert)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <PriorityIcon
                              className={`w-4 h-4 ${
                                alert.priority === "critical"
                                  ? "text-red-400"
                                  : alert.priority === "high"
                                  ? "text-orange-400"
                                  : "text-yellow-400"
                              }`}
                            />
                            <AlertIcon className="w-4 h-4 text-gray-400 ml-1" />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">
                              {alert.store_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {alert.message}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-red-400 font-bold">
                            {formatCurrency(alert.estimated_lost_revenue || 0)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {alert.age_minutes || 0}m ago
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-400">
                      No critical alerts at this time
                    </p>
                    <p className="text-sm text-green-400">
                      All systems operational
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div ref={alertsRef} className="space-y-6">
        {/* Loading State */}
        {alertsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-red-400 animate-spin" />
              <span className="text-white">Loading alerts...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {alertsError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-white font-medium">Error Loading Alerts</h3>
                <p className="text-gray-400 text-sm mt-1">{alertsError}</p>
                <button
                  onClick={refreshData}
                  className="text-red-400 hover:text-red-300 text-sm font-medium mt-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!alertsLoading && !alertsError && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Smart Alert System
                </h1>
                <p className="text-gray-400">
                  {filteredAlerts.length} active alerts • Impact:{" "}
                  {formatCurrency(calculateTotalImpact())} • Updated{" "}
                  {currentTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Auto Refresh Toggle */}
                <motion.button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    autoRefresh
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm">Auto Refresh</span>
                </motion.button>

                {/* Filters Toggle */}
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Filter className="w-4 h-4" />
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

            {/* Alert Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {alerts.filter((a) => a.priority === "critical").length}
                    </div>
                    <div className="text-sm text-gray-400">Critical Alerts</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {alerts.filter((a) => a.priority === "high").length}
                    </div>
                    <div className="text-sm text-gray-400">High Priority</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatCurrency(calculateTotalImpact())}
                    </div>
                    <div className="text-sm text-gray-400">Total Impact</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {acknowledgedAlerts.size}
                    </div>
                    <div className="text-sm text-gray-400">Acknowledged</div>
                  </div>
                </div>
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
                        Priority Level
                      </label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                      >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Alert Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                      >
                        <option value="all">All Types</option>
                        <option value="stockout_imminent">
                          Stockout Imminent
                        </option>
                        <option value="overstock_alert">Overstock Alert</option>
                        <option value="demand_surge_predicted">
                          Demand Surge
                        </option>
                        <option value="competitor_price_alert">
                          Price Alert
                        </option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <motion.button
                        onClick={() => {
                          setSelectedPriority("all");
                          setSelectedType("all");
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

            {/* AI Recommendations Panel */}
            <AnimatePresence>
              {aiRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          AI Crisis Management Plan
                        </h3>
                        <p className="text-sm text-gray-400">
                          Generated at {currentTime} by {currentUser}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setAiRecommendations(null)}
                      className="text-gray-400 hover:text-white"
                      whileHover={{ scale: 1.1 }}
                    >
                      <XCircle className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-red-400 mb-3">
                        Immediate Actions (Next 2 Hours)
                      </h4>
                      <div className="space-y-2">
                        {aiRecommendations.action_plan?.immediate_actions?.map(
                          (action, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-red-400 text-xs font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium">
                                  {action.action}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {action.timeline} • {action.responsibility}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-400 mb-3">
                        Financial Impact & Mitigation
                      </h4>
                      <div className="space-y-2">
                        {aiRecommendations.action_plan?.financial_mitigation?.map(
                          (action, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                            >
                              <div>
                                <div className="text-white font-medium">
                                  {action.action}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {action.impact}
                                </div>
                              </div>
                              <div className="text-orange-400 font-bold">
                                {action.amount}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="text-sm text-gray-400">
                      Estimated Resolution Time:{" "}
                      <span className="text-white font-medium">
                        {aiRecommendations.estimated_resolution_time}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Success Probability:{" "}
                      <span className="text-green-400 font-medium">
                        {aiRecommendations.success_probability}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert, index) => {
                const AlertIcon = getAlertIcon(alert.type);
                const PriorityIcon = getPriorityIcon(alert.priority);
                const isAcknowledged = acknowledgedAlerts.has(alert.id);

                return (
                  <motion.div
                    key={alert.id}
                    data-alert-id={alert.id}
                    className={`alert-card border rounded-xl transition-all duration-300 ${getAlertColor(
                      alert.priority
                    )} ${
                      alert.priority === "critical" && !isAcknowledged
                        ? "critical-pulse"
                        : ""
                    } ${isAcknowledged ? "opacity-50" : ""}`}
                    whileHover={{ scale: 1.01, y: -1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2">
                            <PriorityIcon
                              className={`w-5 h-5 ${
                                alert.priority === "critical"
                                  ? "text-red-400"
                                  : alert.priority === "high"
                                  ? "text-orange-400"
                                  : alert.priority === "medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            />
                            <AlertIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-white">
                                {alert.store_name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  alert.priority === "critical"
                                    ? "bg-red-500/20 text-red-400"
                                    : alert.priority === "high"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : alert.priority === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {alert.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-gray-300 mb-2">
                              {alert.message}
                            </div>
                            <div className="text-sm text-gray-400">
                              {alert.description}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-red-400 font-bold text-lg">
                            {formatCurrency(alert.estimated_lost_revenue || 0)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Potential Loss
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">
                            Alert Type
                          </div>
                          <div className="font-medium text-white">
                            {alert.type.replace(/_/g, " ").toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Time Detected
                          </div>
                          <div className="font-medium text-white">
                            {alert.age_minutes || 0} minutes ago
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Affected Products
                          </div>
                          <div className="font-medium text-white">
                            {alert.affected_products?.length || "Multiple"}{" "}
                            items
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>Updated by {currentUser}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>Store Team Notified</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isAcknowledged && (
                            <motion.button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Acknowledge</span>
                            </motion.button>
                          )}

                          <motion.button
                            onClick={() => generateCrisisRecommendations(alert)}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Zap className="w-4 h-4" />
                            )}
                            <span>Get AI Plan</span>
                          </motion.button>

                          <motion.button
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4" />
                            <span>Details</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredAlerts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  All Clear!
                </h3>
                <p className="text-gray-400 mb-4">
                  No alerts matching your criteria
                </p>
                <motion.button
                  onClick={() => {
                    setSelectedPriority("all");
                    setSelectedType("all");
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  View All Alerts
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
