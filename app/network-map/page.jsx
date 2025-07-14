"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Layout from "../components/layout/Layout";
import { useStoreData } from "../hooks/useStoreData";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Store,
  Activity,
  Filter,
  Search,
  Maximize2,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";

export default function NetworkMap({
  stores: propStores = [],
  selectedStore = null,
  onStoreSelect = () => {},
  timeRange = "30d",
  fullView = false,
}) {
  const mapRef = useRef(null);

  // Use hooks to fetch real data
  const { stores: hookStores, loading: storesLoading } = useStoreData();

  // Use hook data if no props provided, otherwise use props
  const stores = propStores.length > 0 ? propStores : hookStores || [];

  const [filteredStores, setFilteredStores] = useState(stores);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mapMode, setMapMode] = useState("health"); // health, revenue, risk, alerts
  const [showFilters, setShowFilters] = useState(false);

  // Session info
  const currentUser = "vkhare2909";
  const currentTime = "2025-07-14 09:40:59";

  // India regions and their approximate centers
  const regions = {
    all: { name: "All Regions", center: [78.9629, 20.5937], zoom: 4.5 },
    north: { name: "North India", center: [77.209, 28.6139], zoom: 6 },
    south: { name: "South India", center: [77.5946, 12.9716], zoom: 6 },
    east: { name: "East India", center: [88.3639, 22.5726], zoom: 6 },
    west: { name: "West India", center: [72.8777, 19.076], zoom: 6 },
  };

  // Filter stores based on selected criteria
  useEffect(() => {
    let filtered = stores;

    if (selectedRegion !== "all") {
      filtered = filtered.filter(
        (store) => store.region && store.region.toLowerCase() === selectedRegion
      );
    }

    if (selectedRiskLevel !== "all") {
      filtered = filtered.filter(
        (store) => store.risk_level === selectedRiskLevel
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (store) =>
          (store.name &&
            store.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (store.city &&
            store.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (store.state &&
            store.state.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStores(filtered);
  }, [stores, selectedRegion, selectedRiskLevel, searchTerm]);

  // Map entrance animation
  useEffect(() => {
    if (mapRef.current) {
      gsap.fromTo(
        ".heat-map-container",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      // Animate store markers with stagger
      gsap.fromTo(
        ".store-marker",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.02,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    }
  }, [filteredStores]);

  // Calculate region statistics
  const regionStats = Object.keys(regions)
    .filter((r) => r !== "all")
    .map((region) => {
      const regionStores = stores.filter(
        (store) => store.region && store.region.toLowerCase() === region
      );
      const totalRevenue = regionStores.reduce(
        (sum, store) => sum + (store.monthly_revenue || 0),
        0
      );
      const avgHealth =
        regionStores.length > 0
          ? regionStores.reduce(
              (sum, store) => sum + (store.health_score || 0),
              0
            ) / regionStores.length
          : 0;
      const criticalStores = regionStores.filter(
        (store) => store.risk_level === "high"
      ).length;

      return {
        region,
        name: regions[region].name,
        storeCount: regionStores.length,
        totalRevenue,
        avgHealth: Math.round(avgHealth),
        criticalStores,
        performance:
          avgHealth >= 80
            ? "excellent"
            : avgHealth >= 70
            ? "good"
            : avgHealth >= 60
            ? "fair"
            : "poor",
      };
    });

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  // Utility functions for markers
  const getMarkerColor = (store) => {
    switch (mapMode) {
      case "health":
        return (store.health_score || 0) >= 80
          ? "#10b981"
          : (store.health_score || 0) >= 60
          ? "#f59e0b"
          : "#ef4444";
      case "revenue":
        return (store.monthly_revenue || 0) >= 70000000
          ? "#3b82f6"
          : (store.monthly_revenue || 0) >= 50000000
          ? "#06b6d4"
          : (store.monthly_revenue || 0) >= 30000000
          ? "#8b5cf6"
          : "#6b7280";
      case "risk":
        return store.risk_level === "low"
          ? "#10b981"
          : store.risk_level === "medium"
          ? "#f59e0b"
          : "#ef4444";
      case "alerts":
        return (store.stockout_incidents || 0) <= 3
          ? "#10b981"
          : (store.stockout_incidents || 0) <= 8
          ? "#f59e0b"
          : (store.stockout_incidents || 0) <= 15
          ? "#f97316"
          : "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const getMarkerSize = (store) => {
    switch (mapMode) {
      case "revenue":
        return (store.monthly_revenue || 0) >= 80000000
          ? 16
          : (store.monthly_revenue || 0) >= 50000000
          ? 14
          : 12;
      case "health":
        return (store.health_score || 0) >= 80
          ? 16
          : (store.health_score || 0) >= 60
          ? 14
          : 12;
      default:
        return 12;
    }
  };

  // Show loading state
  if (storesLoading && stores.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a101e] to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Network Map...</p>
            <p className="text-slate-400 text-sm mt-2">
              Analyzing store network for {currentUser}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        ref={mapRef}
        className={`space-y-6 ${fullView ? "" : "max-h-[600px]"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Store Network Heat Map
            </h2>
            <p className="text-sm text-gray-400">
              {filteredStores.length} of {stores.length} stores • Updated{" "}
              {currentTime}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Selector */}
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
              {[
                { id: "health", label: "Health", icon: Activity },
                { id: "revenue", label: "Revenue", icon: BarChart3 },
                { id: "risk", label: "Risk", icon: AlertTriangle },
                { id: "alerts", label: "Alerts", icon: Target },
              ].map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => setMapMode(mode.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mapMode === mode.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>

            {fullView && (
              <motion.button
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            )}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Region Filter */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Regions</option>
                  <option value="north">North India</option>
                  <option value="south">South India</option>
                  <option value="east">East India</option>
                  <option value="west">West India</option>
                </select>

                {/* Risk Level Filter */}
                <select
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>

                {/* Clear Filters */}
                <motion.button
                  onClick={() => {
                    setSelectedRegion("all");
                    setSelectedRiskLevel("all");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Map Container */}
          <div className={`${fullView ? "xl:col-span-3" : "xl:col-span-4"}`}>
            <div className="heat-map-container bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
              {/* Map Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">
                      India Store Network
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">
                        Healthy (
                        {
                          filteredStores.filter((s) => s.health_score >= 80)
                            .length
                        }
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-400">
                        Warning (
                        {
                          filteredStores.filter(
                            (s) => s.health_score >= 60 && s.health_score < 80
                          ).length
                        }
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-400">
                        Critical (
                        {
                          filteredStores.filter((s) => s.health_score < 60)
                            .length
                        }
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simplified Map Visualization */}
              <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-gray-900/20 overflow-hidden">
                {/* India Outline SVG */}
                <svg
                  viewBox="0 0 800 600"
                  className="absolute inset-0 w-full h-full opacity-20"
                >
                  <path
                    d="M200,100 Q300,80 400,100 Q500,120 600,150 Q650,200 620,300 Q600,400 550,450 Q500,500 400,480 Q300,460 200,440 Q150,400 140,350 Q130,300 150,250 Q170,200 200,100 Z"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>

                {/* Store Markers */}
                <div className="absolute inset-0 p-8">
                  {filteredStores.map((store, index) => {
                    // Simulated positions within India map bounds
                    const regionPositions = {
                      north: { minX: 0.3, maxX: 0.7, minY: 0.1, maxY: 0.4 },
                      south: { minX: 0.3, maxX: 0.7, minY: 0.6, maxY: 0.9 },
                      east: { minX: 0.6, maxX: 0.9, minY: 0.3, maxY: 0.7 },
                      west: { minX: 0.1, maxX: 0.4, minY: 0.2, maxY: 0.8 },
                    };

                    const regionPos =
                      regionPositions[
                        (store.region || "north").toLowerCase()
                      ] || regionPositions.north;
                    const x =
                      (regionPos.minX +
                        Math.random() * (regionPos.maxX - regionPos.minX)) *
                      100;
                    const y =
                      (regionPos.minY +
                        Math.random() * (regionPos.maxY - regionPos.minY)) *
                      100;

                    return (
                      <motion.div
                        key={store.id}
                        className="store-marker absolute cursor-pointer group"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => onStoreSelect(store)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Marker */}
                        <div
                          className="w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-200"
                          style={{
                            backgroundColor: getMarkerColor(store),
                            width: `${getMarkerSize(store)}px`,
                            height: `${getMarkerSize(store)}px`,
                          }}
                        ></div>

                        {/* Pulse effect for selected store */}
                        {selectedStore?.id === store.id && (
                          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                        )}

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="text-white font-medium mb-1">
                            {store.name}
                          </div>
                          <div className="text-gray-400 text-xs mb-2">
                            {store.city}, {store.state}
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Health:</span>
                              <span className="text-green-400">
                                {store.health_score || 0}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Revenue:</span>
                              <span className="text-blue-400">
                                {formatCurrency(store.monthly_revenue || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Risk:</span>
                              <span
                                className={`${
                                  (store.risk_level || "medium") === "low"
                                    ? "text-green-400"
                                    : (store.risk_level || "medium") ===
                                      "medium"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {(store.risk_level || "medium").toUpperCase()}
                              </span>
                            </div>
                          </div>
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Store Details Overlay */}
                <AnimatePresence>
                  {selectedStore && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-w-64"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-bold">
                          {selectedStore.name}
                        </h4>
                        <motion.button
                          onClick={() => onStoreSelect(null)}
                          className="text-gray-400 hover:text-white"
                          whileHover={{ scale: 1.1 }}
                        >
                          ×
                        </motion.button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">
                            {selectedStore.city}, {selectedStore.state}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Manager:</span>
                          <span className="text-white">
                            {selectedStore.manager || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Health Score:</span>
                          <span
                            className={`font-bold ${
                              (selectedStore.health_score || 0) >= 80
                                ? "text-green-400"
                                : (selectedStore.health_score || 0) >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedStore.health_score || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Monthly Revenue:
                          </span>
                          <span className="text-blue-400 font-bold">
                            {formatCurrency(selectedStore.monthly_revenue || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Inventory Turnover:
                          </span>
                          <span className="text-purple-400">
                            {selectedStore.inventory_turnover || 0}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Stockout Incidents:
                          </span>
                          <span
                            className={`${
                              (selectedStore.stockout_incidents || 0) <= 5
                                ? "text-green-400"
                                : (selectedStore.stockout_incidents || 0) <= 10
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedStore.stockout_incidents || 0}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Detailed Analytics
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Regional Statistics Sidebar */}
          {fullView && (
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Regional Performance
                </h3>

                <div className="space-y-4">
                  {regionStats.map((region) => (
                    <motion.div
                      key={region.region}
                      className="bg-gray-700/30 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => setSelectedRegion(region.region)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">
                          {region.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            region.performance === "excellent"
                              ? "bg-green-500/20 text-green-400"
                              : region.performance === "good"
                              ? "bg-blue-500/20 text-blue-400"
                              : region.performance === "fair"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {region.performance}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stores:</span>
                          <span className="text-white">
                            {region.storeCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Health:</span>
                          <span className="text-green-400">
                            {region.avgHealth}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-blue-400">
                            {formatCurrency(region.totalRevenue)}
                          </span>
                        </div>
                        {region.criticalStores > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Critical:</span>
                            <span className="text-red-400">
                              {region.criticalStores} stores
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Map Legend */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Map Legend
                </h3>

                {mapMode === "health" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        Excellent (85-100%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        Good (70-84%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        Fair (50-69%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        Poor (&lt;50%)
                      </span>
                    </div>
                  </div>
                )}

                {mapMode === "revenue" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        &gt;₹7 Cr/month
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        ₹5-7 Cr/month
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        ₹3-5 Cr/month
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        &lt;₹3 Cr/month
                      </span>
                    </div>
                  </div>
                )}

                {mapMode === "risk" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Low Risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">High Risk</span>
                    </div>
                  </div>
                )}

                {mapMode === "alerts" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        0-3 incidents
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        4-8 incidents
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        9-15 incidents
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">
                        &gt;15 incidents
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Target className="w-5 h-5" />
                    <span>Generate Regional Report</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Optimize All Stores</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>Address Critical Issues</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {!fullView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {filteredStores.filter((s) => s.health_score >= 80).length}
              </div>
              <div className="text-sm text-gray-400">Healthy Stores</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatCurrency(
                  filteredStores.reduce(
                    (sum, s) => sum + (s.monthly_revenue || 0),
                    0
                  )
                )}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {filteredStores.filter((s) => s.risk_level === "high").length}
              </div>
              <div className="text-sm text-gray-400">High Risk</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {Math.round(
                  (filteredStores.length > 0
                    ? filteredStores.reduce(
                        (sum, s) => sum + (s.inventory_turnover || 0),
                        0
                      ) / filteredStores.length
                    : 0) * 10
                ) / 10 || 0}
                x
              </div>
              <div className="text-sm text-gray-400">Avg Turnover</div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
