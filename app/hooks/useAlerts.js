import { useState, useEffect, useCallback } from "react";
import { dataService } from "../services/dataService";

export function useAlerts(priority = null) {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [performance, setPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dataService.getAlerts(priority);

      setAlerts(data.alerts);
      setSummary(data.summary);
      setRecommendations(data.recommendations);
      setPerformance(data.performance);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err.message);
      console.error("Alerts fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [priority]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Get alerts by priority
  const getAlertsByPriority = useCallback(
    (targetPriority) => {
      return alerts.filter((alert) => alert.priority === targetPriority);
    },
    [alerts]
  );

  // Get urgent alerts (critical + high priority)
  const getUrgentAlerts = useCallback(() => {
    return alerts.filter(
      (alert) => alert.priority === "critical" || alert.urgency_score > 80
    );
  }, [alerts]);

  // Get alerts by store
  const getAlertsByStore = useCallback(
    (storeId) => {
      return alerts.filter((alert) => alert.store_id === storeId);
    },
    [alerts]
  );

  // Calculate total business impact
  const getTotalBusinessImpact = useCallback(() => {
    return alerts.reduce(
      (total, alert) => total + (alert.estimated_lost_revenue || 0),
      0
    );
  }, [alerts]);

  // Get actionable alerts
  const getActionableAlerts = useCallback(() => {
    return alerts.filter(
      (alert) =>
        alert.action_required && alert.estimated_resolution_time !== "unknown"
    );
  }, [alerts]);

  // Mark alert as acknowledged
  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, acknowledged_at: Date.now() }
          : alert
      )
    );
  }, []);

  // Get alert statistics
  const getAlertStatistics = useCallback(() => {
    const stats = alerts.reduce(
      (acc, alert) => {
        acc.total++;
        acc.byPriority[alert.priority] =
          (acc.byPriority[alert.priority] || 0) + 1;
        acc.byType[alert.type] = (acc.byType[alert.type] || 0) + 1;
        if (alert.age_minutes < 60) acc.recent++;
        return acc;
      },
      {
        total: 0,
        byPriority: {},
        byType: {},
        recent: 0,
      }
    );

    return stats;
  }, [alerts]);

  const refreshData = useCallback(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    summary,
    recommendations,
    performance,
    loading,
    error,
    lastUpdated,
    getAlertsByPriority,
    getUrgentAlerts,
    getAlertsByStore,
    getTotalBusinessImpact,
    getActionableAlerts,
    acknowledgeAlert,
    getAlertStatistics,
    refreshData,
  };
}
