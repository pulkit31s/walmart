import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

const SESSION_USER = "vkhare2909";
const SESSION_TIME = "2025-07-14 09:34:50";

// Generate time series data for charts
export function generateTimeSeriesData(
  data,
  timeframe = "30days",
  valueKey = "revenue"
) {
  const now = new Date();
  let interval = [];
  let formatString = "MMM dd";

  switch (timeframe) {
    case "7days":
      interval = eachDayOfInterval({ start: subDays(now, 7), end: now });
      formatString = "EEE";
      break;
    case "30days":
      interval = eachDayOfInterval({ start: subDays(now, 30), end: now });
      formatString = "MMM dd";
      break;
    case "12months":
      interval = eachMonthOfInterval({ start: subMonths(now, 12), end: now });
      formatString = "MMM yyyy";
      break;
    default:
      interval = eachDayOfInterval({ start: subDays(now, 30), end: now });
  }

  return interval.map((date) => {
    const matchingData = data.find((item) => {
      const itemDate = new Date(item.date || item.timestamp);
      return format(itemDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });

    return {
      date: format(date, formatString),
      fullDate: format(date, "yyyy-MM-dd"),
      value: matchingData ? matchingData[valueKey] : 0,
      formatted: formatChartValue(
        matchingData ? matchingData[valueKey] : 0,
        valueKey
      ),
      trend: calculateTrendDirection(data, date, valueKey),
    };
  });
}

// Store performance heatmap data
export function generateStoreHeatmapData(stores) {
  return stores.map((store) => ({
    id: store.id,
    name: store.name,
    region: store.region,
    coordinates: [store.lng, store.lat],
    health_score: store.health_score,
    risk_level: store.risk_level,
    color: getHealthScoreColor(store.health_score),
    size: getMarkerSize(store.monthly_revenue),
    tooltip: {
      title: store.name,
      subtitle: `${store.city}, ${store.state}`,
      metrics: [
        {
          label: "Health Score",
          value: `${store.health_score}%`,
          color: getHealthScoreColor(store.health_score),
        },
        {
          label: "Monthly Revenue",
          value: formatCurrency(store.monthly_revenue),
          color: "#10b981",
        },
        {
          label: "Risk Level",
          value: store.risk_level.toUpperCase(),
          color: getRiskLevelColor(store.risk_level),
        },
      ],
    },
    session_user: SESSION_USER,
    session_time: SESSION_TIME,
  }));
}

// Product category distribution data
export function generateCategoryDistributionData(products, categories) {
  const distribution = categories.map((category) => {
    const categoryProducts = products.filter(
      (p) => p.category_id === category.id
    );
    const totalValue = categoryProducts.reduce(
      (sum, p) => sum + p.price * 100,
      0
    ); // Assuming 100 avg stock

    return {
      id: category.id,
      name: category.name,
      count: categoryProducts.length,
      value: totalValue,
      percentage: 0, // Will be calculated below
      color: getCategoryColor(category.id),
      margin: category.margin_percentage,
      seasonal_factor: category.seasonal_factor,
      top_products: categoryProducts
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, 3)
        .map((p) => ({ name: p.name, score: p.popularity_score })),
    };
  });

  // Calculate percentages
  const totalValue = distribution.reduce((sum, cat) => sum + cat.value, 0);
  distribution.forEach((cat) => {
    cat.percentage =
      totalValue > 0 ? Math.round((cat.value / totalValue) * 100) : 0;
  });

  return distribution;
}

// Sales funnel data
export function generateSalesFunnelData(salesData) {
  const stages = [
    { stage: "Total Views", value: salesData.length * 15, color: "#3b82f6" },
    {
      stage: "Product Interest",
      value: salesData.length * 8,
      color: "#06b6d4",
    },
    { stage: "Add to Cart", value: salesData.length * 3, color: "#10b981" },
    {
      stage: "Checkout Started",
      value: salesData.length * 1.5,
      color: "#f59e0b",
    },
    { stage: "Purchase Complete", value: salesData.length, color: "#ef4444" },
  ];

  return stages.map((stage, index) => ({
    ...stage,
    percentage:
      index === 0 ? 100 : Math.round((stage.value / stages[0].value) * 100),
    conversion_rate:
      index > 0
        ? Math.round((stage.value / stages[index - 1].value) * 100)
        : 100,
    drop_off: index > 0 ? stages[index - 1].value - stage.value : 0,
  }));
}

// Regional performance comparison
export function generateRegionalComparisonData(stores) {
  const regions = ["North", "South", "East", "West"];

  return regions.map((region) => {
    const regionStores = stores.filter((store) => store.region === region);
    const totalRevenue = regionStores.reduce(
      (sum, store) => sum + store.monthly_revenue,
      0
    );
    const avgHealthScore =
      regionStores.length > 0
        ? regionStores.reduce((sum, store) => sum + store.health_score, 0) /
          regionStores.length
        : 0;
    const totalStockouts = regionStores.reduce(
      (sum, store) => sum + store.stockout_incidents,
      0
    );

    return {
      region,
      store_count: regionStores.length,
      total_revenue: totalRevenue,
      avg_health_score: Math.round(avgHealthScore),
      total_stockouts: totalStockouts,
      revenue_per_store:
        regionStores.length > 0 ? totalRevenue / regionStores.length : 0,
      performance_grade: getPerformanceGrade(avgHealthScore),
      color: getRegionColor(region),
      trend: calculateRegionalTrend(regionStores),
    };
  });
}

// Inventory turnover analysis
export function generateInventoryTurnoverData(products, salesData) {
  return products.map((product) => {
    const productSales = salesData.filter(
      (sale) => sale.product_id === product.id
    );
    const totalSold = productSales.reduce(
      (sum, sale) => sum + sale.quantity_sold,
      0
    );
    const avgInventory = (product.max_stock + product.reorder_point) / 2;
    const turnoverRate = avgInventory > 0 ? totalSold / avgInventory : 0;

    return {
      id: product.id,
      name: product.name,
      category: product.category_name || "Unknown",
      current_turnover: product.inventory_turnover || 0,
      calculated_turnover: Math.round(turnoverRate * 100) / 100,
      variance: Math.round(
        ((turnoverRate - (product.inventory_turnover || 0)) /
          (product.inventory_turnover || 1)) *
          100
      ),
      status: getTurnoverStatus(turnoverRate),
      recommendation: getTurnoverRecommendation(turnoverRate),
      value_at_risk: avgInventory * product.cost,
      opportunity_score: calculateOpportunityScore(
        turnoverRate,
        product.popularity_score
      ),
    };
  });
}

// Prediction accuracy tracking
export function generatePredictionAccuracyData(predictions, actualSales) {
  return predictions.map((prediction) => {
    const actual = actualSales.find(
      (sale) =>
        sale.store_id === prediction.store_id &&
        sale.product_id === prediction.product_forecasts?.[0]?.product_id
    );

    const predicted = prediction.predicted_revenue_14d || 0;
    const actualValue = actual?.revenue || 0;
    const accuracy =
      actualValue > 0
        ? Math.min(
            100,
            (1 - Math.abs(predicted - actualValue) / actualValue) * 100
          )
        : 0;

    return {
      store_id: prediction.store_id,
      store_name: prediction.store_name,
      predicted_value: predicted,
      actual_value: actualValue,
      accuracy_percentage: Math.round(accuracy),
      variance: predicted - actualValue,
      variance_percentage:
        actualValue > 0
          ? Math.round(((predicted - actualValue) / actualValue) * 100)
          : 0,
      confidence: prediction.confidence || 0,
      status: getAccuracyStatus(accuracy),
      improvement_needed: accuracy < 80,
    };
  });
}

// Alert priority matrix data
export function generateAlertPriorityMatrix(alerts) {
  const matrix = {
    critical_urgent: [],
    critical_normal: [],
    high_urgent: [],
    high_normal: [],
    medium_urgent: [],
    medium_normal: [],
    low_urgent: [],
    low_normal: [],
  };

  alerts.forEach((alert) => {
    const priority = alert.priority || "medium";
    const urgency = alert.urgency_score > 70 ? "urgent" : "normal";
    const key = `${priority}_${urgency}`;

    if (matrix[key]) {
      matrix[key].push({
        ...alert,
        impact_score: calculateImpactScore(alert),
        time_to_resolve: alert.estimated_resolution_time,
        business_criticality: getBusinessCriticality(alert),
      });
    }
  });

  // Sort each category by impact score
  Object.keys(matrix).forEach((key) => {
    matrix[key].sort((a, b) => b.impact_score - a.impact_score);
  });

  return matrix;
}

// Seasonal demand patterns
export function generateSeasonalDemandData(products) {
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

  return months.map((month, index) => {
    const monthData = { month, date: new Date(2025, index, 1) };

    products.forEach((product) => {
      if (product.seasonal_demand) {
        const monthKey = month.toLowerCase();
        const demandFactor = product.seasonal_demand[monthKey] || 1;
        monthData[product.category_name || "Unknown"] =
          (monthData[product.category_name || "Unknown"] || 0) + demandFactor;
      }
    });

    return monthData;
  });
}

// Helper functions
function formatChartValue(value, type) {
  if (!value && value !== 0) return "N/A";

  switch (type) {
    case "revenue":
    case "cost":
      return formatCurrency(value);
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "quantity":
      return isNaN(value) ? "0" : value.toLocaleString();
    default:
      return value.toString();
  }
}

function calculateTrendDirection(data, currentDate, valueKey) {
  const current = data.find((item) => {
    const itemDate = new Date(item.date || item.timestamp);
    return format(itemDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
  });

  const previous = data.find((item) => {
    const itemDate = new Date(item.date || item.timestamp);
    const prevDate = subDays(currentDate, 1);
    return format(itemDate, "yyyy-MM-dd") === format(prevDate, "yyyy-MM-dd");
  });

  if (!current || !previous) return "stable";

  const currentValue = current[valueKey] || 0;
  const previousValue = previous[valueKey] || 0;

  if (currentValue > previousValue * 1.05) return "up";
  if (currentValue < previousValue * 0.95) return "down";
  return "stable";
}

function getHealthScoreColor(score) {
  if (score >= 85) return "#10b981"; // Green
  if (score >= 70) return "#f59e0b"; // Yellow
  if (score >= 50) return "#f97316"; // Orange
  return "#ef4444"; // Red
}

function getRiskLevelColor(level) {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };
  return colors[level] || "#6b7280";
}

function getMarkerSize(revenue) {
  if (revenue > 70000000) return "large";
  if (revenue > 40000000) return "medium";
  return "small";
}

function getCategoryColor(categoryId) {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
  ];
  return colors[parseInt(categoryId.slice(-1)) % colors.length];
}

function getRegionColor(region) {
  const colors = {
    North: "#3b82f6",
    South: "#10b981",
    East: "#f59e0b",
    West: "#ef4444",
  };
  return colors[region] || "#6b7280";
}

function getPerformanceGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  return "C";
}

function calculateRegionalTrend(stores) {
  const avgRevenue =
    stores.reduce((sum, store) => sum + store.monthly_revenue, 0) /
    stores.length;
  if (avgRevenue > 55000000) return "growing";
  if (avgRevenue < 35000000) return "declining";
  return "stable";
}

function getTurnoverStatus(rate) {
  if (rate > 10) return "excellent";
  if (rate > 8) return "good";
  if (rate > 6) return "average";
  if (rate > 4) return "poor";
  return "critical";
}

function getTurnoverRecommendation(rate) {
  if (rate > 10) return "Maintain current strategy";
  if (rate > 8) return "Minor optimization needed";
  if (rate > 6) return "Review slow-moving items";
  if (rate > 4) return "Significant inventory reduction required";
  return "Immediate action required - major overstock";
}

function calculateOpportunityScore(turnoverRate, popularityScore) {
  return Math.round((turnoverRate * 0.6 + popularityScore * 0.4) * 10);
}

function getAccuracyStatus(accuracy) {
  if (accuracy >= 90) return "excellent";
  if (accuracy >= 80) return "good";
  if (accuracy >= 70) return "acceptable";
  return "needs_improvement";
}

function calculateImpactScore(alert) {
  const revenueWeight = (alert.estimated_lost_revenue || 0) / 1000000;
  const urgencyWeight = alert.urgency_score || 0;
  return Math.round(revenueWeight * 0.7 + urgencyWeight * 0.3);
}

function getBusinessCriticality(alert) {
  if (alert.estimated_lost_revenue > 5000000) return "critical";
  if (alert.estimated_lost_revenue > 1000000) return "high";
  if (alert.estimated_lost_revenue > 100000) return "medium";
  return "low";
}

function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return "₹0";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString()}`;
}

export default {
  generateTimeSeriesData,
  generateStoreHeatmapData,
  generateCategoryDistributionData,
  generateSalesFunnelData,
  generateRegionalComparisonData,
  generateInventoryTurnoverData,
  generatePredictionAccuracyData,
  generateAlertPriorityMatrix,
  generateSeasonalDemandData,
  formatCurrency,
};
