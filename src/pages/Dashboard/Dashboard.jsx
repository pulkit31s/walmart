// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  AttachMoney,
  People,
  Warning,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ✅ MetricCard Component Definition
const MetricCard = ({ title, value, change, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {change > 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={change > 0 ? 'success.main' : 'error.main'}
              sx={{ ml: 0.5 }}
            >
              {Math.abs(change)}%
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ✅ AlertCard Component Definition
const AlertCard = ({ severity, message, action }) => (
  <Alert
    severity={severity}
    action={action}
    sx={{ mb: 2 }}
  >
    {message}
  </Alert>
);

// ✅ Main Dashboard Component
function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalRevenue: 2450000,
      inventoryTurnover: 8.5,
      supplierPerformance: 94.2,
      customerSatisfaction: 4.7,
    },
    changes: {
      revenue: 12.5,
      inventory: -2.3,
      supplier: 5.8,
      satisfaction: 8.2,
    },
    salesData: [
      { month: 'Jan', sales: 65000, forecast: 62000 },
      { month: 'Feb', sales: 59000, forecast: 58000 },
      { month: 'Mar', sales: 80000, forecast: 75000 },
      { month: 'Apr', sales: 81000, forecast: 78000 },
      { month: 'May', sales: 56000, forecast: 60000 },
      { month: 'Jun', sales: 55000, forecast: 58000 },
    ],
    categoryData: [
      { name: 'Electronics', value: 35, color: '#0088FE' },
      { name: 'Clothing', value: 25, color: '#00C49F' },
      { name: 'Home & Garden', value: 20, color: '#FFBB28' },
      { name: 'Sports', value: 15, color: '#FF8042' },
      { name: 'Others', value: 5, color: '#8884D8' },
    ],
    alerts: [
      {
        severity: 'warning',
        message: 'Low stock alert: 15 products below reorder point',
        action: 'View Inventory',
      },
      {
        severity: 'info',
        message: 'Supplier performance review due for 3 vendors',
        action: 'Review',
      },
      {
        severity: 'success',
        message: 'Q2 sales target achieved - 105% completion',
        action: 'Details',
      },
    ],
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalRevenue: prev.metrics.totalRevenue + Math.random() * 1000 - 500,
        },
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Destructure all variables from dashboardData
  const { metrics, changes, salesData, categoryData, alerts } = dashboardData;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Alerts Section */}
      <Box mb={3}>
        {alerts.map((alert, index) => (
          <AlertCard
            key={index}
            severity={alert.severity}
            message={alert.message}
            action={
              <Chip
                label={alert.action}
                size="small"
                clickable
                color={alert.severity === 'warning' ? 'warning' : 'primary'}
              />
            }
          />
        ))}
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${(metrics.totalRevenue / 1000000).toFixed(2)}M`}
            change={changes.revenue}
            icon={<AttachMoney />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Inventory Turnover"
            value={metrics.inventoryTurnover}
            change={changes.inventory}
            icon={<Inventory />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Supplier Performance"
            value={`${metrics.supplierPerformance}%`}
            change={changes.supplier}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Customer Satisfaction"
            value={`${metrics.customerSatisfaction}/5`}
            change={changes.satisfaction}
            icon={<People />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Sales vs Forecast
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0071ce"
                  strokeWidth={2}
                  name="Actual Sales"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#ffc220"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Performance Indicators */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Performance Indicators
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Inventory Accuracy
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={96}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    96%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Order Fulfillment
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={89}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="secondary"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    89%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Customer Retention
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    92%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Profit Margin
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="info"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    78%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
