import { useState, useEffect, useCallback } from "react";
import { dataService } from "../services/dataService";

export function usePredictions(storeId = null) {
  const [predictions, setPredictions] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [regionalForecasts, setRegionalForecasts] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [modelPerformance, setModelPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dataService.getPredictions(storeId);

      setPredictions(data.predictions);
      setMetadata(data.metadata);
      setRegionalForecasts(data.regional_forecasts);
      setMarketTrends(data.market_trends);
      setModelPerformance(data.model_performance);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err.message);
      console.error("Predictions fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  // Get high confidence predictions
  const getHighConfidencePredictions = useCallback(() => {
    return predictions.filter((pred) => pred.confidence >= 0.8);
  }, [predictions]);

  // Get critical predictions
  const getCriticalPredictions = useCallback(() => {
    return predictions.filter(
      (pred) =>
        pred.action_priority === "immediate" ||
        pred.risk_assessment.financial_risk > 1000000
    );
  }, [predictions]);

  // Get predictions by store
  const getPredictionsByStore = useCallback(
    (targetStoreId) => {
      return predictions.filter((pred) => pred.store_id === targetStoreId);
    },
    [predictions]
  );

  // Calculate total revenue at risk
  const getTotalRevenueAtRisk = useCallback(() => {
    return predictions.reduce(
      (total, pred) => total + (pred.estimated_impact?.revenue_at_risk || 0),
      0
    );
  }, [predictions]);

  // Get trend analysis
  const getTrendAnalysis = useCallback(() => {
    return {
      upward_trends: marketTrends.filter((trend) => trend.impact_score > 7),
      seasonal_patterns: predictions.filter((pred) =>
        pred.factors?.includes("seasonal_trend")
      ),
      external_factors: predictions.filter(
        (pred) =>
          pred.factors?.includes("weather") ||
          pred.factors?.includes("festival")
      ),
    };
  }, [marketTrends, predictions]);

  const refreshData = useCallback(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    predictions,
    metadata,
    regionalForecasts,
    marketTrends,
    modelPerformance,
    loading,
    error,
    lastUpdated,
    getHighConfidencePredictions,
    getCriticalPredictions,
    getPredictionsByStore,
    getTotalRevenueAtRisk,
    getTrendAnalysis,
    refreshData,
  };
}
