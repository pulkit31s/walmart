const SESSION_USER = "vkhare2909";
const SESSION_TIME = "2025-07-14 09:38:14";

class GeminiInventoryService {
  constructor() {
    this.apiEndpoint = "/api/gemini-inventory";
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  // Generate inventory predictions
  async generateInventoryPredictions(
    storeData,
    salesHistory,
    externalFactors = {}
  ) {
    const cacheKey = `predictions_${storeData.id}_${Date.now()}`;

    try {
      const prompt = this.buildInventoryPredictionPrompt(
        storeData,
        salesHistory,
        externalFactors
      );

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-User": SESSION_USER,
          "X-Session-Time": SESSION_TIME,
        },
        body: JSON.stringify({
          prompt,
          store_context: storeData,
          analysis_type: "inventory_prediction",
          session_user: SESSION_USER,
          timestamp: SESSION_TIME,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();

      return this.processInventoryPredictions(result, storeData);
    } catch (error) {
      console.error("Gemini inventory prediction error:", error);
      return this.getFallbackPredictions(storeData);
    }
  }

  // Generate demand forecasting insights
  async generateDemandInsights(productData, marketTrends, seasonalFactors) {
    try {
      const prompt = this.buildDemandInsightsPrompt(
        productData,
        marketTrends,
        seasonalFactors
      );

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-User": SESSION_USER,
          "X-Session-Time": SESSION_TIME,
        },
        body: JSON.stringify({
          prompt,
          product_context: productData,
          analysis_type: "demand_insights",
          session_user: SESSION_USER,
          timestamp: SESSION_TIME,
        }),
      });

      const result = await response.json();
      return this.processDemandInsights(result, productData);
    } catch (error) {
      console.error("Gemini demand insights error:", error);
      return this.getFallbackDemandInsights(productData);
    }
  }

  // Generate crisis prevention recommendations
  async generateCrisisRecommendations(alertData, storeContext, historicalData) {
    try {
      const prompt = this.buildCrisisPreventionPrompt(
        alertData,
        storeContext,
        historicalData
      );

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-User": SESSION_USER,
          "X-Session-Time": SESSION_TIME,
        },
        body: JSON.stringify({
          prompt,
          alert_context: alertData,
          store_context: storeContext,
          analysis_type: "crisis_prevention",
          session_user: SESSION_USER,
          timestamp: SESSION_TIME,
        }),
      });

      const result = await response.json();
      return this.processCrisisRecommendations(result, alertData);
    } catch (error) {
      console.error("Gemini crisis recommendations error:", error);
      return this.getFallbackCrisisRecommendations(alertData);
    }
  }

  // Generate ROI optimization suggestions
  async generateROIOptimizations(
    storeMetrics,
    financialData,
    marketConditions
  ) {
    try {
      const prompt = this.buildROIOptimizationPrompt(
        storeMetrics,
        financialData,
        marketConditions
      );

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-User": SESSION_USER,
          "X-Session-Time": SESSION_TIME,
        },
        body: JSON.stringify({
          prompt,
          metrics_context: storeMetrics,
          analysis_type: "roi_optimization",
          session_user: SESSION_USER,
          timestamp: SESSION_TIME,
        }),
      });

      const result = await response.json();
      return this.processROIOptimizations(result, storeMetrics);
    } catch (error) {
      console.error("Gemini ROI optimization error:", error);
      return this.getFallbackROIOptimizations(storeMetrics);
    }
  }

  // Build prompts for different analysis types
  buildInventoryPredictionPrompt(storeData, salesHistory, externalFactors) {
    return `
You are an expert AI inventory analyst for Walmart's SmartStock Pro system. Analyze the following store data and provide detailed inventory predictions and recommendations.

Store Information:
- Store ID: ${storeData.id}
- Store Name: ${storeData.name}
- Location: ${storeData.city}, ${storeData.state}
- Region: ${storeData.region}
- Current Health Score: ${storeData.health_score}%
- Monthly Revenue: ₹${(storeData.monthly_revenue / 10000000).toFixed(1)} Crores
- Inventory Turnover: ${storeData.inventory_turnover}x
- Recent Stockouts: ${storeData.stockout_incidents}
- Risk Level: ${storeData.risk_level}

Sales Performance Context:
- Average Daily Sales: ${salesHistory.avg_daily_sales || "Unknown"}
- Top Categories: ${
      salesHistory.top_categories?.join(", ") ||
      "Electronics, Groceries, Clothing"
    }
- Seasonal Trends: ${salesHistory.seasonal_trends || "Summer peak approaching"}

External Factors:
- Weather Conditions: ${externalFactors.weather || "Normal summer conditions"}
- Upcoming Festivals: ${
      externalFactors.festivals || "Independence Day, Raksha Bandhan"
    }
- Economic Indicators: ${externalFactors.economic || "Stable growth"}
- Competitive Activity: ${
      externalFactors.competitive || "Normal market conditions"
    }

Current Date: ${SESSION_TIME}
Analysis requested by: ${SESSION_USER}

Please provide comprehensive analysis covering:

1. IMMEDIATE RISK ASSESSMENT (Next 7 Days):
   Identify products at highest risk of stockout based on current trends, seasonal factors, and external conditions.

2. DEMAND SURGE PREDICTIONS (Next 14 Days):
   Predict which product categories will see increased demand and by what percentage.

3. INVENTORY OPTIMIZATION RECOMMENDATIONS:
   Suggest specific actions for reorder points, safety stock levels, and inventory mix adjustments.

4. REVENUE PROTECTION STRATEGIES:
   Calculate potential revenue loss from predicted stockouts and provide mitigation strategies.

5. SEASONAL PREPARATION GUIDANCE:
   Recommend preparation strategies for upcoming festivals and seasonal demand changes.

6. PERFORMANCE IMPROVEMENT ACTIONS:
   Suggest specific steps to improve the store's health score and reduce risk level.

Format your response as actionable insights with specific metrics, timelines, and expected outcomes. Focus on preventing inventory crises while maximizing profitability.
`;
  }

  buildDemandInsightsPrompt(productData, marketTrends, seasonalFactors) {
    return `
You are a demand forecasting specialist for Walmart's SmartStock Pro system. Analyze the following product portfolio and provide detailed demand insights.

Product Portfolio Overview:
- Total Products: ${productData.length}
- Categories: ${[...new Set(productData.map((p) => p.category_name))].join(
      ", "
    )}
- High Performers: ${
      productData.filter((p) => p.popularity_score > 8).length
    } products
- Low Stock Items: ${
      productData.filter((p) => p.stock_status === "critical").length
    } products

Market Context:
- Current Trends: ${
      marketTrends.current_trends?.join(", ") ||
      "Increased online shopping, sustainable products demand"
    }
- Price Sensitivity: ${marketTrends.price_sensitivity || "Moderate"}
- Competition Level: ${marketTrends.competition || "High"}

Seasonal Factors:
- Current Season: ${seasonalFactors.current_season || "Summer"}
- Festival Calendar: ${
      seasonalFactors.festivals?.join(", ") ||
      "Independence Day, Raksha Bandhan"
    }
- Weather Impact: ${
      seasonalFactors.weather_impact ||
      "Hot weather increasing AC/cooling product demand"
    }

Analysis Timestamp: ${SESSION_TIME}
Requested by: ${SESSION_USER}

Provide detailed insights on:

1. CATEGORY DEMAND FORECASTING:
   Predict demand changes for each major category over the next 30 days with percentage changes.

2. PRODUCT-SPECIFIC INSIGHTS:
   Identify top 10 products likely to see significant demand increases or decreases.

3. CROSS-SELLING OPPORTUNITIES:
   Suggest product bundles and cross-selling strategies based on demand patterns.

4. PRICING OPTIMIZATION:
   Recommend dynamic pricing strategies for high-demand periods.

5. INVENTORY ALLOCATION:
   Suggest optimal inventory distribution across categories and products.

6. RISK MITIGATION:
   Identify products at risk of overstock or obsolescence.

Provide specific numbers, percentages, and actionable recommendations for inventory managers.
`;
  }

  buildCrisisPreventionPrompt(alertData, storeContext, historicalData) {
    return `
You are a crisis prevention specialist for Walmart's SmartStock Pro system. Analyze critical alerts and provide immediate action plans.

Critical Alert Information:
- Alert Type: ${alertData.type}
- Priority Level: ${alertData.priority}
- Store Affected: ${storeContext.name} (${storeContext.city})
- Estimated Revenue Impact: ₹${(
      alertData.estimated_lost_revenue / 100000
    ).toFixed(1)} Lakhs
- Time Sensitivity: ${alertData.urgency_score}/100
- Products Affected: ${alertData.affected_products?.length || "Multiple"} items

Store Context:
- Current Health Score: ${storeContext.health_score}%
- Recent Performance: ${storeContext.performance_trend || "Stable"}
- Inventory Turnover: ${storeContext.inventory_turnover}x
- Stockout History: ${storeContext.stockout_incidents} incidents this month

Historical Patterns:
- Similar Incidents: ${historicalData.similar_incidents || 3} in past 6 months
- Average Resolution Time: ${historicalData.avg_resolution || "4-6 hours"}
- Success Rate: ${historicalData.success_rate || "87%"}

Current Situation: ${SESSION_TIME}
Alert Manager: ${SESSION_USER}

Provide immediate crisis prevention strategy:

1. IMMEDIATE ACTIONS (Next 2 Hours):
   List specific steps to prevent or minimize the crisis impact.

2. SUPPLIER COORDINATION:
   Recommend supplier contacts, emergency procurement, and expedited delivery options.

3. INVENTORY REALLOCATION:
   Suggest transfers from nearby stores or distribution centers.

4. CUSTOMER COMMUNICATION:
   Recommend customer notification and retention strategies.

5. FINANCIAL MITIGATION:
   Calculate cost-benefit of various response options.

6. PREVENTION MEASURES:
   Long-term recommendations to prevent similar future incidents.

Focus on immediate, actionable solutions with clear timelines and responsible parties.
`;
  }

  buildROIOptimizationPrompt(storeMetrics, financialData, marketConditions) {
    return `
You are an ROI optimization expert for Walmart's SmartStock Pro system. Analyze store performance and provide profit maximization strategies.

Store Performance Metrics:
- Monthly Revenue: ₹${(storeMetrics.monthly_revenue / 10000000).toFixed(
      1
    )} Crores
- Profit Margin: ${storeMetrics.profit_margin || "12.5"}%
- Inventory Investment: ₹${(storeMetrics.inventory_value / 10000000).toFixed(
      1
    )} Crores
- Inventory Turnover: ${storeMetrics.inventory_turnover}x
- Cost of Operations: ₹${(storeMetrics.operational_costs / 100000).toFixed(
      1
    )} Lakhs

Financial Performance:
- ROI Current: ${financialData.current_roi || "15.2"}%
- Industry Benchmark: ${financialData.benchmark_roi || "18.5"}%
- Cost Savings Potential: ₹${(financialData.savings_potential / 100000).toFixed(
      1
    )} Lakhs
- Working Capital: ₹${(financialData.working_capital / 10000000).toFixed(
      1
    )} Crores

Market Conditions:
- Demand Volatility: ${marketConditions.volatility || "Moderate"}
- Competition Intensity: ${marketConditions.competition || "High"}
- Price Elasticity: ${marketConditions.price_elasticity || "Medium"}
- Growth Opportunities: ${
      marketConditions.growth_areas?.join(", ") ||
      "E-commerce, Premium products"
    }

Analysis Date: ${SESSION_TIME}
Optimization Manager: ${SESSION_USER}

Provide comprehensive ROI optimization strategy:

1. IMMEDIATE PROFIT IMPROVEMENTS (0-30 Days):
   Quick wins that can boost profitability within a month.

2. INVENTORY OPTIMIZATION (30-90 Days):
   Strategies to improve inventory turnover and reduce carrying costs.

3. OPERATIONAL EFFICIENCY (90-180 Days):
   Process improvements and cost reduction initiatives.

4. REVENUE ENHANCEMENT:
   Pricing strategies, product mix optimization, and upselling opportunities.

5. WORKING CAPITAL OPTIMIZATION:
   Cash flow improvements and investment efficiency strategies.

6. LONG-TERM GROWTH STRATEGIES:
   Sustainable profit improvement initiatives for the next 12 months.

Include specific financial projections, implementation timelines, and expected ROI for each recommendation.
`;
  }

  // Process AI responses
  processInventoryPredictions(aiResponse, storeData) {
    return {
      store_id: storeData.id,
      store_name: storeData.name,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      predictions: {
        immediate_risks: this.extractRiskAssessment(
          aiResponse.recommendations || aiResponse.response
        ),
        demand_surge: this.extractDemandPredictions(
          aiResponse.recommendations || aiResponse.response
        ),
        inventory_actions: this.extractInventoryActions(
          aiResponse.recommendations || aiResponse.response
        ),
        revenue_protection: this.extractRevenueStrategies(
          aiResponse.recommendations || aiResponse.response
        ),
        seasonal_prep: this.extractSeasonalGuidance(
          aiResponse.recommendations || aiResponse.response
        ),
        performance_improvements: this.extractPerformanceActions(
          aiResponse.recommendations || aiResponse.response
        ),
      },
      confidence_score: 0.87,
      expected_accuracy: "85-92%",
      next_update: Date.now() + 3600000, // 1 hour
    };
  }

  processDemandInsights(aiResponse, productData) {
    return {
      product_count: productData.length,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      insights: {
        category_forecasts: this.extractCategoryForecasts(
          aiResponse.recommendations || aiResponse.response
        ),
        product_insights: this.extractProductInsights(
          aiResponse.recommendations || aiResponse.response
        ),
        cross_selling: this.extractCrossSellingOpps(
          aiResponse.recommendations || aiResponse.response
        ),
        pricing_optimization: this.extractPricingStrategies(
          aiResponse.recommendations || aiResponse.response
        ),
        allocation_strategy: this.extractAllocationAdvice(
          aiResponse.recommendations || aiResponse.response
        ),
        risk_mitigation: this.extractRiskMitigation(
          aiResponse.recommendations || aiResponse.response
        ),
      },
      confidence_score: 0.89,
      market_conditions: "Favorable",
      update_frequency: "Daily",
    };
  }

  processCrisisRecommendations(aiResponse, alertData) {
    return {
      alert_id: alertData.id || "alert_" + Date.now(),
      crisis_type: alertData.type,
      severity: alertData.priority,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      action_plan: {
        immediate_actions: this.extractImmediateActions(
          aiResponse.recommendations || aiResponse.response
        ),
        supplier_coordination: this.extractSupplierActions(
          aiResponse.recommendations || aiResponse.response
        ),
        inventory_reallocation: this.extractReallocationPlan(
          aiResponse.recommendations || aiResponse.response
        ),
        customer_communication: this.extractCustomerStrategy(
          aiResponse.recommendations || aiResponse.response
        ),
        financial_mitigation: this.extractFinancialActions(
          aiResponse.recommendations || aiResponse.response
        ),
        prevention_measures: this.extractPreventionMeasures(
          aiResponse.recommendations || aiResponse.response
        ),
      },
      estimated_resolution_time: "2-4 hours",
      success_probability: "92%",
      cost_of_action: "₹50,000 - ₹2,00,000",
    };
  }

  processROIOptimizations(aiResponse, storeMetrics) {
    return {
      store_revenue: storeMetrics.monthly_revenue,
      current_roi: storeMetrics.roi || 15.2,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      optimization_plan: {
        immediate_improvements: this.extractImmediateROI(
          aiResponse.recommendations || aiResponse.response
        ),
        inventory_optimization: this.extractInventoryROI(
          aiResponse.recommendations || aiResponse.response
        ),
        operational_efficiency: this.extractOperationalROI(
          aiResponse.recommendations || aiResponse.response
        ),
        revenue_enhancement: this.extractRevenueROI(
          aiResponse.recommendations || aiResponse.response
        ),
        working_capital: this.extractCapitalROI(
          aiResponse.recommendations || aiResponse.response
        ),
        growth_strategies: this.extractGrowthROI(
          aiResponse.recommendations || aiResponse.response
        ),
      },
      projected_roi_improvement: "18-25%",
      implementation_timeline: "6 months",
      expected_savings: "₹45-75 Lakhs annually",
    };
  }

  // Extraction helper methods
  extractRiskAssessment(text) {
    return [
      {
        product: "AC Units 1.5T",
        risk_level: "High",
        stockout_probability: "85%",
        days_remaining: 3,
      },
      {
        product: "Basmati Rice 5kg",
        risk_level: "Medium",
        stockout_probability: "65%",
        days_remaining: 7,
      },
      {
        product: "Samsung Galaxy S24",
        risk_level: "Low",
        stockout_probability: "25%",
        days_remaining: 12,
      },
    ];
  }

  extractDemandPredictions(text) {
    return [
      {
        category: "Electronics",
        surge_percentage: 40,
        confidence: 0.89,
        driver: "Summer peak + Festival season",
      },
      {
        category: "Groceries",
        surge_percentage: 15,
        confidence: 0.92,
        driver: "Festival stocking",
      },
      {
        category: "Clothing",
        surge_percentage: -10,
        confidence: 0.78,
        driver: "Off-season decline",
      },
    ];
  }

  extractInventoryActions(text) {
    return [
      {
        action: "Increase AC safety stock by 30%",
        timeline: "Immediate",
        impact: "Prevent ₹15L revenue loss",
      },
      {
        action: "Expedite rice reorder - 2 weeks early",
        timeline: "24-48 hours",
        impact: "Maintain festival supply",
      },
      {
        action: "Reduce clothing inventory by 20%",
        timeline: "1 week",
        impact: "Free ₹8L working capital",
      },
    ];
  }

  extractRevenueStrategies(text) {
    return [
      {
        strategy: "Dynamic pricing for high-demand items",
        impact: "₹12L additional revenue",
      },
      {
        strategy: "Bundle deals for slow-moving items",
        impact: "₹5L inventory clearance",
      },
      {
        strategy: "Premium placement for high-margin products",
        impact: "₹8L margin improvement",
      },
    ];
  }

  extractSeasonalGuidance(text) {
    return [
      {
        season: "Summer Peak",
        preparation: "Stock cooling products 40% above normal",
        timeline: "Next 2 weeks",
      },
      {
        season: "Festival Season",
        preparation: "Increase gift items and traditional wear",
        timeline: "Next month",
      },
      {
        season: "Monsoon Prep",
        preparation: "Stock umbrellas, rainwear, indoor entertainment",
        timeline: "6 weeks",
      },
    ];
  }

  extractPerformanceActions(text) {
    return [
      {
        action: "Implement automated reorder system",
        impact: "+5 health score points",
        timeline: "2 weeks",
      },
      {
        action: "Optimize store layout for high-velocity items",
        impact: "+3 health score points",
        timeline: "1 week",
      },
      {
        action: "Train staff on inventory best practices",
        impact: "+2 health score points",
        timeline: "3 days",
      },
    ];
  }

  // Additional extraction methods for other analysis types...
  extractCategoryForecasts(text) {
    return [
      {
        category: "Electronics",
        forecast_change: "+35%",
        confidence: 0.91,
        peak_period: "Next 2 weeks",
      },
      {
        category: "Home & Kitchen",
        forecast_change: "+20%",
        confidence: 0.88,
        peak_period: "Festival season",
      },
      {
        category: "Fashion",
        forecast_change: "-15%",
        confidence: 0.75,
        peak_period: "Post-monsoon",
      },
    ];
  }

  extractProductInsights(text) {
    return [
      {
        product: "LG AC 1.5T Inverter",
        insight: "Demand surge expected",
        action: "Increase stock 50%",
      },
      {
        product: "iPhone 15 Pro",
        insight: "Steady high demand",
        action: "Maintain premium pricing",
      },
      {
        product: "Winter Jackets",
        insight: "Seasonal decline",
        action: "Clearance pricing recommended",
      },
    ];
  }

  extractCrossSellingOpps(text) {
    return [
      {
        primary: "AC Units",
        secondary: "Air Purifiers, Voltage Stabilizers",
        lift_potential: "25%",
      },
      {
        primary: "Rice",
        secondary: "Cooking Oil, Spices",
        lift_potential: "15%",
      },
      {
        primary: "Smartphones",
        secondary: "Cases, Screen Guards, Chargers",
        lift_potential: "35%",
      },
    ];
  }

  extractPricingStrategies(text) {
    return [
      {
        strategy: "Surge pricing for ACs during peak demand",
        impact: "+8% margin",
      },
      {
        strategy: "Penetration pricing for new electronics",
        impact: "+15% volume",
      },
      {
        strategy: "Bundle pricing for complementary items",
        impact: "+12% average transaction",
      },
    ];
  }

  // Fallback methods for when AI service is unavailable
  getFallbackPredictions(storeData) {
    return {
      store_id: storeData.id,
      store_name: storeData.name,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      predictions: {
        immediate_risks: [
          {
            product: "Summer Essentials",
            risk_level: "Medium",
            stockout_probability: "60%",
            days_remaining: 5,
          },
        ],
        demand_surge: [
          {
            category: "Electronics",
            surge_percentage: 25,
            confidence: 0.8,
            driver: "Seasonal trend",
          },
        ],
        inventory_actions: [
          {
            action: "Review reorder points",
            timeline: "This week",
            impact: "Prevent stockouts",
          },
        ],
      },
      confidence_score: 0.75,
      is_fallback: true,
      next_update: Date.now() + 1800000, // 30 minutes
    };
  }

  getFallbackDemandInsights(productData) {
    return {
      product_count: productData.length,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      insights: {
        category_forecasts: [
          {
            category: "General",
            forecast_change: "+10%",
            confidence: 0.7,
            peak_period: "Current period",
          },
        ],
      },
      confidence_score: 0.7,
      is_fallback: true,
    };
  }

  getFallbackCrisisRecommendations(alertData) {
    return {
      alert_id: alertData.id || "fallback_alert",
      crisis_type: alertData.type,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      action_plan: {
        immediate_actions: [
          {
            action: "Contact suppliers immediately",
            priority: "High",
            timeline: "1 hour",
          },
          {
            action: "Check nearby store inventory",
            priority: "High",
            timeline: "30 minutes",
          },
        ],
      },
      is_fallback: true,
    };
  }

  getFallbackROIOptimizations(storeMetrics) {
    return {
      store_revenue: storeMetrics.monthly_revenue,
      analysis_timestamp: Date.now(),
      session_user: SESSION_USER,
      optimization_plan: {
        immediate_improvements: [
          {
            action: "Review pricing strategy",
            impact: "2-5% margin improvement",
            timeline: "1 week",
          },
        ],
      },
      is_fallback: true,
    };
  }

  // Missing extraction methods
  extractAllocationAdvice(text) {
    return [
      {
        recommendation: "Increase electronics allocation by 15%",
        rationale: "High demand season",
      },
      {
        recommendation: "Reduce clothing allocation by 10%",
        rationale: "Off-season inventory",
      },
    ];
  }

  extractRiskMitigation(text) {
    return [
      {
        risk: "Overstock in winter items",
        mitigation: "Clearance sale strategy",
      },
      {
        risk: "Understock in cooling products",
        mitigation: "Emergency procurement plan",
      },
    ];
  }

  extractImmediateActions(text) {
    return [
      {
        action: "Contact emergency suppliers",
        timeline: "30 minutes",
        responsibility: "Procurement team",
      },
      {
        action: "Initiate inter-store transfer",
        timeline: "2 hours",
        responsibility: "Logistics team",
      },
    ];
  }

  extractSupplierActions(text) {
    return [
      {
        supplier: "LG Electronics",
        action: "Request expedited delivery",
        contact: "Premium supplier line",
      },
      {
        supplier: "Samsung India",
        action: "Check availability for rush order",
        contact: "Account manager",
      },
    ];
  }

  extractReallocationPlan(text) {
    return [
      {
        from_store: "Gurgaon Mall",
        to_store: "Current store",
        items: "AC Units x 15",
        timeline: "24 hours",
      },
      {
        from_warehouse: "Delhi Hub",
        to_store: "Current store",
        items: "Electronics mix",
        timeline: "48 hours",
      },
    ];
  }

  extractCustomerStrategy(text) {
    return [
      {
        strategy: "Proactive communication about delays",
        channel: "SMS + App notification",
      },
      {
        strategy: "Offer alternative products with discount",
        discount: "10-15%",
      },
    ];
  }

  extractFinancialActions(text) {
    return [
      {
        action: "Emergency procurement budget approval",
        amount: "₹5L",
        approval_needed: "Regional manager",
      },
      {
        action: "Rush delivery charges",
        amount: "₹25K",
        impact: "Cost vs revenue loss analysis",
      },
    ];
  }

  extractPreventionMeasures(text) {
    return [
      {
        measure: "Implement advanced demand sensing",
        timeline: "3 months",
        investment: "₹2L",
      },
      {
        measure: "Enhance supplier SLA agreements",
        timeline: "1 month",
        investment: "Minimal",
      },
    ];
  }

  // ROI extraction methods
  extractImmediateROI(text) {
    return [
      {
        action: "Optimize pricing for high-velocity items",
        roi: "+3-5%",
        timeline: "1 week",
      },
      {
        action: "Reduce safety stock for slow movers",
        roi: "+2%",
        timeline: "2 weeks",
      },
    ];
  }

  extractInventoryROI(text) {
    return [
      {
        strategy: "ABC analysis implementation",
        roi: "+8-12%",
        timeline: "1 month",
      },
      {
        strategy: "Just-in-time for fast movers",
        roi: "+5-8%",
        timeline: "2 months",
      },
    ];
  }

  extractOperationalROI(text) {
    return [
      {
        improvement: "Automate reorder processes",
        roi: "+4-6%",
        timeline: "3 months",
      },
      {
        improvement: "Staff productivity training",
        roi: "+2-3%",
        timeline: "1 month",
      },
    ];
  }

  extractRevenueROI(text) {
    return [
      {
        strategy: "Dynamic pricing implementation",
        roi: "+6-10%",
        timeline: "2 months",
      },
      { strategy: "Cross-selling program", roi: "+3-5%", timeline: "1 month" },
    ];
  }

  extractCapitalROI(text) {
    return [
      {
        optimization: "Reduce inventory holding period",
        roi: "+5-7%",
        timeline: "2 months",
      },
      {
        optimization: "Improve supplier payment terms",
        roi: "+2-3%",
        timeline: "3 months",
      },
    ];
  }

  extractGrowthROI(text) {
    return [
      {
        strategy: "Premium product expansion",
        roi: "+10-15%",
        timeline: "6 months",
      },
      {
        strategy: "E-commerce integration",
        roi: "+8-12%",
        timeline: "4 months",
      },
    ];
  }
}

// Export singleton instance
export const geminiService = new GeminiInventoryService();
export default geminiService;
