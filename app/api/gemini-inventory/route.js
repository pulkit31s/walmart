import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Gemini API Key is not configured in environment variables.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const cleanFormatting = (text) => {
  return text
    .replace(/^\s*[\*\-•]\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export async function POST(request) {
  if (!genAI) {
    return NextResponse.json(
      {
        error:
          "Gemini API client not initialized. Check API key configuration.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      prompt,
      analysis_type,
      store_context,
      product_context,
      alert_context,
      metrics_context,
      session_user,
      timestamp,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt in request body" },
        { status: 400 }
      );
    }

    // Enhanced prompt with SmartStock Pro context
    const enhancedPrompt = `
SMARTSTOCK PRO - WALMART INVENTORY INTELLIGENCE SYSTEM
Analysis Type: ${analysis_type}
Session User: ${session_user}
Timestamp: ${timestamp}

${prompt}

CRITICAL INSTRUCTIONS:
- Provide specific, actionable recommendations with quantified metrics
- Include timeline estimates for implementation
- Calculate potential ROI and business impact in ₹ (Indian Rupees)
- Consider Walmart's scale and operational constraints in India
- Focus on preventing inventory crises and maximizing profitability
- Use data-driven insights and avoid generic advice
- Structure response with clear sections and bullet points for easy parsing
- Include confidence levels for predictions and recommendations

RESPONSE FORMAT:
Present your analysis in clear, structured sections that can be easily processed by our system for dashboard display and actionable insights.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings,
    });

    const generationConfig = {
      temperature: 0.3, // Lower temperature for more consistent business advice
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 3072, // Increased for detailed business analysis
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
      generationConfig,
    });

    const response = result.response;
    let recommendationsText = response.text();

    recommendationsText = cleanFormatting(recommendationsText);

    // Structure the response based on analysis type
    const structuredResponse = {
      analysis_type,
      session_user,
      timestamp,
      recommendations: recommendationsText,
      generated_at: new Date().toISOString(),
      confidence_score: 0.87, // Could be dynamically calculated
      status: "success",
    };

    // Add specific metadata based on analysis type
    switch (analysis_type) {
      case "inventory_prediction":
        structuredResponse.store_context = store_context;
        structuredResponse.prediction_horizon = "14 days";
        break;
      case "demand_insights":
        structuredResponse.product_context = product_context;
        structuredResponse.market_analysis = true;
        break;
      case "crisis_prevention":
        structuredResponse.alert_context = alert_context;
        structuredResponse.urgency_level = "high";
        break;
      case "roi_optimization":
        structuredResponse.metrics_context = metrics_context;
        structuredResponse.optimization_focus = "profitability";
        break;
    }

    return NextResponse.json(structuredResponse);
  } catch (error) {
    console.error("Error calling Gemini API for inventory analysis:", error);

    if (error.message && error.message.includes("API key not valid")) {
      return NextResponse.json(
        { error: "Invalid Gemini API Key." },
        { status: 401 }
      );
    }

    if (error.message && error.message.includes("quota")) {
      return NextResponse.json(
        {
          error: "API quota exceeded. Using fallback analysis.",
          fallback: true,
          recommendations: generateFallbackRecommendations(body.analysis_type),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate inventory analysis.",
        details: error.message || "Unknown error",
        fallback: true,
        recommendations: generateFallbackRecommendations(
          body.analysis_type || "general"
        ),
      },
      { status: 200 } // Return 200 with fallback instead of 500
    );
  }
}

// Fallback recommendations when API is unavailable
function generateFallbackRecommendations(analysisType) {
  const fallbacks = {
    inventory_prediction: `
IMMEDIATE RISK ASSESSMENT (Next 7 Days):
High-demand electronics may face stockouts due to seasonal surge.
Recommend 25% increase in AC and cooling product inventory.

DEMAND SURGE PREDICTIONS (Next 14 Days):
Electronics: +30% demand increase expected
Groceries: +15% demand for festival items
Clothing: -10% seasonal decline anticipated

INVENTORY OPTIMIZATION RECOMMENDATIONS:
Implement automated reorder points for high-velocity items.
Increase safety stock for summer essentials by 20%.
Reduce slow-moving winter inventory by 15%.

REVENUE PROTECTION STRATEGIES:
Potential revenue protection: ₹15-20 Lakhs through proactive stocking.
Dynamic pricing for high-demand items during peak periods.
    `,

    demand_insights: `
CATEGORY DEMAND FORECASTING:
Electronics: +35% increase expected in next 30 days
Home Appliances: +25% surge during summer peak
Fashion: -15% decline during off-season

PRODUCT-SPECIFIC INSIGHTS:
Air Conditioners showing 40% demand increase
Smartphones maintaining steady high demand
Winter clothing requires clearance strategy

CROSS-SELLING OPPORTUNITIES:
AC + Air Purifier bundles: 25% lift potential
Smartphone + Accessories: 35% upsell opportunity
    `,

    crisis_prevention: `
IMMEDIATE ACTIONS (Next 2 Hours):
Contact emergency suppliers for expedited delivery
Check inter-store transfer availability from nearby locations
Implement customer communication strategy for potential delays

SUPPLIER COORDINATION:
Engage premium supplier channels for rush orders
Negotiate expedited delivery terms
Secure backup supplier arrangements

FINANCIAL MITIGATION:
Emergency procurement budget: ₹5-10 Lakhs
Rush delivery investment vs revenue loss analysis
Customer retention offers: 10-15% discount on alternatives
    `,

    roi_optimization: `
IMMEDIATE PROFIT IMPROVEMENTS (0-30 Days):
Dynamic pricing implementation: +5-8% margin improvement
Inventory mix optimization: +3-5% efficiency gain
Staff productivity enhancement: +2-3% operational improvement

INVENTORY OPTIMIZATION (30-90 Days):
ABC analysis implementation for better categorization
Just-in-time approach for fast-moving items
Safety stock optimization based on demand patterns

REVENUE ENHANCEMENT:
Cross-selling program implementation
Premium product placement strategy
Bundle pricing for complementary items
    `,
  };

  return fallbacks[analysisType] || fallbacks.inventory_prediction;
}
