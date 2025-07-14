import { useState, useEffect, useCallback } from "react";
import { dataService } from "../services/dataService";

export function useStoreData(filters = {}) {
  const [stores, setStores] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dataService.getStores(filters);

      setStores(data.stores);
      setMetrics(data.metrics);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err.message);
      console.error("Store data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Real-time store health monitoring
  const getStoreHealth = useCallback(
    (storeId) => {
      const store = stores.find((s) => s.id === storeId);
      if (!store) return null;

      return {
        id: store.id,
        name: store.name,
        health_score: store.health_score,
        risk_level: store.risk_level,
        status:
          store.health_score >= 85
            ? "excellent"
            : store.health_score >= 70
            ? "good"
            : store.health_score >= 50
            ? "warning"
            : "critical",
        last_check: Date.now(),
      };
    },
    [stores]
  );

  // Filter stores by region
  const getStoresByRegion = useCallback(
    (region) => {
      return stores.filter((store) => store.region === region);
    },
    [stores]
  );

  // Get top performing stores
  const getTopPerformers = useCallback(
    (limit = 10) => {
      return [...stores]
        .sort((a, b) => b.health_score - a.health_score)
        .slice(0, limit);
    },
    [stores]
  );

  // Get stores needing attention
  const getStoresNeedingAttention = useCallback(() => {
    return stores.filter(
      (store) =>
        store.risk_level === "high" ||
        store.health_score < 70 ||
        store.stockout_incidents > 15
    );
  }, [stores]);

  const refreshData = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    metrics,
    loading,
    error,
    lastUpdated,
    getStoreHealth,
    getStoresByRegion,
    getTopPerformers,
    getStoresNeedingAttention,
    refreshData,
  };
}
