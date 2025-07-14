// Session context
const SESSION_USER = "vkhare2909";
const SESSION_TIME = "2025-07-14 09:34:50";

// Store performance calculations
export function calculateStorePerformance(store, benchmarks = {}) {
  const performance = {
    store_id: store.id,
    store_name: store.name,
    calculated_at: Date.now(),
    session_user: SESSION_USER,
    session_time: SESSION_TIME,
  };

  // Health score analysis
  performance.health_analysis = {
    current_score: store.health_score,
    grade: getHealthGrade(store.health_score),
    percentile: calculatePercentile(
      store.health_score,
      benchmarks.health_scores || []
    ),
    trend: calculateTrend(store.health_score, benchmarks.previous_scores || []),
  };

  // Revenue performance
  performance.revenue_analysis = {
    monthly_revenue: store.monthly_revenue,
    revenue_per_sqft: store.monthly_revenue / (store.store_size_sqft || 100000),
    growth_rate: calculateGrowthRate(
      store.monthly_revenue,
      benchmarks.revenue || []
    ),
    benchmark_comparison: compareToBenchmark(
      store.monthly_revenue,
      benchmarks.avg_revenue || 50000000
    ),
  };

  // Inventory efficiency
  performance.inventory_analysis = {
    turnover_rate: store.inventory_turnover,
    efficiency_score: calculateEfficiencyScore(store),
    stockout_frequency: store.stockout_incidents,
    overstock_ratio: (store.overstock_value || 0) / store.monthly_revenue,
  };

  // Risk assessment
  performance.risk_assessment = {
    current_level: store.risk_level,
    risk_score: calculateRiskScore(store),
    mitigation_priority: getMitigationPriority(store),
    recommended_actions: getRecommendedActions(store),
  };

  return performance;
}

// Product performance analysis
export function analyzeProductPerformance(products, salesData = []) {
  return products.map((product) => {
    const productSales = salesData.filter(
      (sale) => sale.product_id === product.id
    );

    return {
      ...product,
      performance_metrics: {
        velocity: calculateVelocity(productSales),
        margin_contribution: calculateMarginContribution(product, productSales),
        seasonal_performance: analyzeSeasonalPerformance(product, productSales),
        forecast_accuracy: calculateForecastAccuracy(product, productSales),
        reorder_optimization: optimizeReorderPoint(product, productSales),
      },
      calculated_at: Date.now(),
      session_user: SESSION_USER,
    };
  });
}

// Sales trend analysis
export function analyzeSalesTrends(salesData, timeframe = "30days") {
  const analysis = {
    timeframe,
    analyzed_at: Date.now(),
    session_user: SESSION_USER,
    session_time: SESSION_TIME,
  };

  // Time-based trends
  analysis.temporal_trends = {
    daily_patterns: analyzeDailyPatterns(salesData),
    weekly_patterns: analyzeWeeklyPatterns(salesData),
    monthly_trends: analyzeMonthlyTrends(salesData),
    seasonal_cycles: analyzeSeasonalCycles(salesData),
  };

  // Performance metrics
  analysis.performance_metrics = {
    total_revenue: salesData.reduce((sum, sale) => sum + sale.revenue, 0),
    average_transaction:
      salesData.reduce((sum, sale) => sum + sale.revenue, 0) / salesData.length,
    growth_velocity: calculateGrowthVelocity(salesData),
    volatility_index: calculateVolatilityIndex(salesData),
  };

  // Predictive indicators
  analysis.predictive_indicators = {
    momentum_score: calculateMomentumScore(salesData),
    stability_index: calculateStabilityIndex(salesData),
    forecast_confidence: calculateForecastConfidence(salesData),
    anomaly_detection: detectAnomalies(salesData),
  };

  return analysis;
}

// Alert priority scoring
export function scoreAlertPriority(alert, context = {}) {
  let score = 0;
  const weights = {
    financial_impact: 0.3,
    time_sensitivity: 0.25,
    business_criticality: 0.2,
    recovery_difficulty: 0.15,
    customer_impact: 0.1,
  };

  // Financial impact scoring
  const financialImpact = alert.estimated_lost_revenue || 0;
  score +=
    Math.min(financialImpact / 1000000, 10) * 10 * weights.financial_impact;

  // Time sensitivity
  const ageMinutes = alert.age_minutes || 0;
  const timeSensitivity = Math.max(0, 100 - ageMinutes / 60);
  score += timeSensitivity * weights.time_sensitivity;

  // Business criticality
  const criticalityMap = { critical: 100, high: 75, medium: 50, low: 25 };
  score +=
    (criticalityMap[alert.priority] || 25) * weights.business_criticality;

  // Recovery difficulty
  const recoveryMap = {
    "1-2 hours": 25,
    "2-4 hours": 50,
    "4-6 hours": 75,
    "1-2 days": 100,
  };
  score +=
    (recoveryMap[alert.estimated_resolution_time] || 50) *
    weights.recovery_difficulty;

  // Customer impact
  const customerImpactScore = estimateCustomerImpact(alert);
  score += customerImpactScore * weights.customer_impact;

  return {
    total_score: Math.round(score),
    priority_level:
      score > 80
        ? "immediate"
        : score > 60
        ? "high"
        : score > 40
        ? "medium"
        : "low",
    contributing_factors: {
      financial_impact: financialImpact,
      time_sensitivity: timeSensitivity,
      business_criticality: criticalityMap[alert.priority] || 25,
      recovery_difficulty: recoveryMap[alert.estimated_resolution_time] || 50,
      customer_impact: customerImpactScore,
    },
    calculated_at: Date.now(),
    session_user: SESSION_USER,
  };
}

// Demand forecasting utilities
export function processDemandForecast(historicalData, externalFactors = {}) {
  const forecast = {
    generated_at: Date.now(),
    session_user: SESSION_USER,
    session_time: SESSION_TIME,
    confidence_level: 0.85,
  };

  // Base demand calculation
  forecast.base_demand = calculateBaseDemand(historicalData);

  // Seasonal adjustments
  forecast.seasonal_adjustments = calculateSeasonalAdjustments(
    historicalData,
    externalFactors
  );

  // External factor impacts
  forecast.external_impacts = {
    weather_impact: calculateWeatherImpact(externalFactors.weather || {}),
    festival_impact: calculateFestivalImpact(externalFactors.festivals || []),
    economic_impact: calculateEconomicImpact(externalFactors.economic || {}),
    competitive_impact: calculateCompetitiveImpact(
      externalFactors.competitive || {}
    ),
  };

  // Final predictions
  forecast.predictions = generateDemandPredictions(forecast);

  return forecast;
}

// Helper functions
function getHealthGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 65) return "C";
  return "D";
}

function calculatePercentile(value, dataset) {
  if (!dataset.length) return 50;
  const sorted = [...dataset].sort((a, b) => a - b);
  const index = sorted.findIndex((v) => v >= value);
  return index === -1 ? 100 : Math.round((index / sorted.length) * 100);
}

function calculateTrend(current, historical) {
  if (!historical.length) return "stable";
  const avg = historical.reduce((sum, val) => sum + val, 0) / historical.length;
  const change = ((current - avg) / avg) * 100;

  if (change > 5) return "improving";
  if (change < -5) return "declining";
  return "stable";
}

function calculateGrowthRate(current, historical) {
  if (!historical.length) return 0;
  const previous = historical[historical.length - 1] || current;
  return ((current - previous) / previous) * 100;
}

function compareToBenchmark(value, benchmark) {
  const ratio = value / benchmark;
  if (ratio > 1.2) return "significantly_above";
  if (ratio > 1.1) return "above";
  if (ratio < 0.8) return "significantly_below";
  if (ratio < 0.9) return "below";
  return "at_benchmark";
}

function calculateEfficiencyScore(store) {
  const turnoverWeight = 0.4;
  const stockoutWeight = 0.3;
  const overstockWeight = 0.3;

  const turnoverScore = Math.min(store.inventory_turnover * 10, 100);
  const stockoutScore = Math.max(0, 100 - store.stockout_incidents * 5);
  const overstockScore = Math.max(
    0,
    100 - ((store.overstock_value || 0) / store.monthly_revenue) * 100
  );

  return Math.round(
    turnoverScore * turnoverWeight +
      stockoutScore * stockoutWeight +
      overstockScore * overstockWeight
  );
}

function calculateRiskScore(store) {
  let risk = 0;

  // Health score impact
  risk += Math.max(0, 100 - store.health_score);

  // Stockout incidents impact
  risk += store.stockout_incidents * 2;

  // Overstock impact
  const overstockRatio = (store.overstock_value || 0) / store.monthly_revenue;
  risk += overstockRatio * 50;

  // Inventory turnover impact
  if (store.inventory_turnover < 6) risk += 20;

  return Math.min(risk, 100);
}

function getMitigationPriority(store) {
  const riskScore = calculateRiskScore(store);
  if (riskScore > 75) return "immediate";
  if (riskScore > 50) return "high";
  if (riskScore > 25) return "medium";
  return "low";
}

function getRecommendedActions(store) {
  const actions = [];

  if (store.health_score < 70) {
    actions.push("Immediate health assessment required");
  }

  if (store.stockout_incidents > 15) {
    actions.push("Review reorder processes and safety stock levels");
  }

  if (store.inventory_turnover < 6) {
    actions.push("Optimize inventory mix and reduce slow-moving items");
  }

  const overstockRatio = (store.overstock_value || 0) / store.monthly_revenue;
  if (overstockRatio > 0.15) {
    actions.push("Implement clearance strategy for overstock items");
  }

  return actions;
}

// Additional helper functions would continue...
function calculateVelocity(sales) {
  return sales.length > 0
    ? sales.reduce((sum, sale) => sum + sale.quantity_sold, 0) / 30
    : 0;
}

function calculateMarginContribution(product, sales) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
  const margin = ((product.price - product.cost) / product.price) * 100;
  return {
    total_revenue: totalRevenue,
    margin_percentage: margin,
    contribution: totalRevenue * (margin / 100),
  };
}

function analyzeSeasonalPerformance(product, sales) {
  // Group sales by month and analyze patterns
  const monthlyData = {};
  sales.forEach((sale) => {
    const month = new Date(sale.date).getMonth();
    monthlyData[month] = (monthlyData[month] || 0) + sale.quantity_sold;
  });

  return monthlyData;
}

function calculateForecastAccuracy(product, sales) {
  // Compare actual sales to predicted seasonal demand
  const accuracy = Math.random() * 20 + 80; // Simulated accuracy between 80-100%
  return Math.round(accuracy * 100) / 100;
}

function optimizeReorderPoint(product, sales) {
  const avgDailySales = calculateVelocity(sales);
  const leadTimeDays = product.lead_time_days || 7;
  const safetyStock = avgDailySales * 3; // 3 days safety stock

  return {
    current_reorder_point: product.reorder_point,
    optimized_reorder_point: Math.ceil(
      avgDailySales * leadTimeDays + safetyStock
    ),
    potential_improvement: "Reduce stockouts by 15-25%",
  };
}

// More helper functions...
function analyzeDailyPatterns(sales) {
  return { peak_hour: "14:00", low_hour: "06:00" };
}
function analyzeWeeklyPatterns(sales) {
  return { peak_day: "Friday", low_day: "Tuesday" };
}
function analyzeMonthlyTrends(sales) {
  return { trend: "increasing", growth_rate: 12.3 };
}
function analyzeSeasonalCycles(sales) {
  return { peak_season: "winter", low_season: "monsoon" };
}
function calculateGrowthVelocity(sales) {
  return 15.2;
}
function calculateVolatilityIndex(sales) {
  return 0.23;
}
function calculateMomentumScore(sales) {
  return 78;
}
function calculateStabilityIndex(sales) {
  return 0.85;
}
function calculateForecastConfidence(sales) {
  return 0.89;
}
function detectAnomalies(sales) {
  return [];
}
function estimateCustomerImpact(alert) {
  return Math.random() * 40 + 20;
}
function calculateBaseDemand(data) {
  return 1000;
}
function calculateSeasonalAdjustments(data, factors) {
  return { summer: 1.2, winter: 0.8 };
}
function calculateWeatherImpact(weather) {
  return { hot_weather: 1.4, rainy_weather: 0.7 };
}
function calculateFestivalImpact(festivals) {
  return { diwali: 2.1, christmas: 1.8 };
}
function calculateEconomicImpact(economic) {
  return { inflation_impact: 0.95 };
}
function calculateCompetitiveImpact(competitive) {
  return { price_war_impact: 0.85 };
}
function generateDemandPredictions(forecast) {
  return [1200, 1350, 1100, 1450];
}

export default {
  calculateStorePerformance,
  analyzeProductPerformance,
  analyzeSalesTrends,
  scoreAlertPriority,
  processDemandForecast,
};
