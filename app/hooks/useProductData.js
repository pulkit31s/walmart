import { useState, useEffect, useCallback } from "react";
import { dataService } from "../services/dataService";

export function useProductData(filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dataService.getProducts(filters);

      setProducts(data.products);
      setCategories(data.categories);
      setMetrics(data.metrics);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError(err.message);
      console.error("Product data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get products by category
  const getProductsByCategory = useCallback(
    (categoryId) => {
      return products.filter((product) => product.category_id === categoryId);
    },
    [products]
  );

  // Get low stock products
  const getLowStockProducts = useCallback(() => {
    return products.filter(
      (product) =>
        product.stock_status === "critical" || product.stock_status === "low"
    );
  }, [products]);

  // Get high performing products
  const getHighPerformers = useCallback(
    (limit = 20) => {
      return [...products]
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, limit);
    },
    [products]
  );

  // Calculate seasonal demand
  const getSeasonalDemand = useCallback(
    (productId, month) => {
      const product = products.find((p) => p.id === productId);
      if (!product || !product.seasonal_demand) return 1;

      const monthKeys = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];
      const monthKey = monthKeys[month - 1];

      return product.seasonal_demand[monthKey] || 1;
    },
    [products]
  );

  // Get reorder recommendations
  const getReorderRecommendations = useCallback(() => {
    return products
      .filter((product) => product.stock_status === "critical")
      .map((product) => ({
        ...product,
        recommended_quantity: Math.ceil(product.max_stock * 0.8),
        estimated_cost: product.cost * Math.ceil(product.max_stock * 0.8),
        urgency: "immediate",
        lead_time: product.lead_time_days || 7,
      }))
      .sort((a, b) => b.popularity_score - a.popularity_score);
  }, [products]);

  const refreshData = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    categories,
    metrics,
    loading,
    error,
    lastUpdated,
    getProductsByCategory,
    getLowStockProducts,
    getHighPerformers,
    getSeasonalDemand,
    getReorderRecommendations,
    refreshData,
  };
}
