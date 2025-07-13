// src/pages/DemandAnalysis/DemandAnalysis.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  ShowChart,        // ✅ Fixed: Using ShowChart instead of Forecast
  Warning,
  CheckCircle,
  Info,
  Refresh,
  Download,
  FilterList,
  CalendarToday,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';

// Metric Card Component for Demand Analytics
const DemandMetricCard = ({ title, value, change, icon, color = 'primary', subtitle }) => (
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
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
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

// Forecast Accuracy Component
const ForecastAccuracy = ({ product, accuracy, trend }) => {
  const getAccuracyColor = (acc) => {
    if (acc >= 90) return 'success';
    if (acc >= 75) return 'warning';
    return 'error';
  };

  return (
    <TableRow hover>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell align="right">{product.currentDemand.toLocaleString()}</TableCell>
      <TableCell align="right">{product.forecastedDemand.toLocaleString()}</TableCell>
      <TableCell align="center">
        <Chip
          label={`${accuracy}%`}
          color={getAccuracyColor(accuracy)}
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        {trend === 'up' ? (
          <TrendingUp color="success" />
        ) : trend === 'down' ? (
          <TrendingDown color="error" />
        ) : (
          <div>-</div>
        )}
      </TableCell>
    </TableRow>
  );
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`demand-tabpanel-${index}`}
      aria-labelledby={`demand-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Demand Analysis Component
function DemandAnalysis() {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [demandData, setDemandData] = useState({
    metrics: {
      totalDemand: 125000,
      forecastAccuracy: 87.5,
      demandGrowth: 12.3,
      seasonalIndex: 1.15,
    },
    changes: {
      demand: 8.5,
      accuracy: 3.2,
      growth: -2.1,
      seasonal: 15.7,
    },
    forecastData: [
      { month: 'Jan', actual: 65000, forecast: 62000, confidence: 85 },
      { month: 'Feb', actual: 59000, forecast: 58000, confidence: 88 },
      { month: 'Mar', actual: 80000, forecast: 75000, confidence: 82 },
      { month: 'Apr', actual: 81000, forecast: 78000, confidence: 90 },
      { month: 'May', actual: 56000, forecast: 60000, confidence: 85 },
      { month: 'Jun', actual: 55000, forecast: 58000, confidence: 87 },
      { month: 'Jul', actual: null, forecast: 62000, confidence: 83 },
      { month: 'Aug', actual: null, forecast: 68000, confidence: 81 },
      { month: 'Sep', actual: null, forecast: 72000, confidence: 79 },
    ],
    productForecasts: [
      {
        id: 1,
        name: 'Samsung 55" Smart TV',
        category: 'Electronics',
        currentDemand: 450,
        forecastedDemand: 520,
        accuracy: 92,
        trend: 'up',
      },
      {
        id: 2,
        name: 'Nike Air Max Shoes',
        category: 'Clothing',
        currentDemand: 280,
        forecastedDemand: 310,
        accuracy: 88,
        trend: 'up',
      },
      {
        id: 3,
        name: 'Dyson V11 Vacuum',
        category: 'Home & Garden',
        currentDemand: 150,
        forecastedDemand: 135,
        accuracy: 85,
        trend: 'down',
      },
      {
        id: 4,
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        currentDemand: 680,
        forecastedDemand: 750,
        accuracy: 94,
        trend: 'up',
      },
      {
        id: 5,
        name: 'Adidas Running Shoes',
        category: 'Clothing',
        currentDemand: 320,
        forecastedDemand: 290,
        accuracy: 79,
        trend: 'down',
      },
    ],
    seasonalTrends: [
      { period: 'Q1', electronics: 85, clothing: 70, homeGarden: 60, sports: 45 },
      { period: 'Q2', electronics: 90, clothing: 85, homeGarden: 95, sports: 80 },
      { period: 'Q3', electronics: 95, clothing: 90, homeGarden: 85, sports: 100 },
      { period: 'Q4', electronics: 120, clothing: 110, homeGarden: 75, sports: 65 },
    ],
    alerts: [
      {
        type: 'warning',
        message: 'Demand forecast accuracy below 80% for 3 products',
        action: 'Review Models',
      },
      {
        type: 'info',
        message: 'Seasonal demand spike expected for Electronics in Q4',
        action: 'Plan Inventory',
      },
      {
        type: 'success',
        message: 'Overall forecast accuracy improved by 3.2% this month',
        action: 'View Details',
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDemandData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalDemand: prev.metrics.totalDemand + Math.floor(Math.random() * 1000 - 500),
        },
      }));
      setIsLoading(false);
    }, 2000);
  };

  const filteredProducts = demandData.productForecasts.filter(product => 
    !categoryFilter || product.category === categoryFilter
  );

  const { metrics, changes, forecastData, seasonalTrends, alerts } = demandData;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Demand Analysis & Forecasting
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7">7 Days</MenuItem>
              <MenuItem value="30">30 Days</MenuItem>
              <MenuItem value="90">90 Days</MenuItem>
              <MenuItem value="365">1 Year</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefreshData} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Alerts Section */}
      <Box mb={3}>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            severity={alert.type}
            action={
              <Chip
                label={alert.action}
                size="small"
                clickable
                color={alert.type === 'warning' ? 'warning' : 'primary'}
              />
            }
            sx={{ mb: 1 }}
          >
            {alert.message}
          </Alert>
        ))}
      </Box>

      {/* Metrics Cards */}
     {/* Metrics Cards */}
<Grid container spacing={3} mb={3}>
  <Grid item xs={12} sm={6} md={3}>
    <DemandMetricCard
      title="Total Demand"
      value={metrics.totalDemand.toLocaleString()}
      change={changes.demand}
      icon={<Analytics />}
      color="primary"
      subtitle="Units this month"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <DemandMetricCard
      title="Forecast Accuracy"
      value={`${metrics.forecastAccuracy}%`}
      change={changes.accuracy}
      icon={<ShowChart />}
      color="success"
      subtitle="Average accuracy"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <DemandMetricCard
      title="Demand Growth"
      value={`${metrics.demandGrowth}%`}
      change={changes.growth}
      icon={<TrendingUp />}
      color="info"
      subtitle="Month over month"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <DemandMetricCard
      title="Seasonal Index"
      value={metrics.seasonalIndex.toFixed(2)}
      change={changes.seasonal}
      icon={<CalendarToday />}
      color="secondary"
      subtitle="Current period"
    />
  </Grid>
</Grid>


      {/* Tabs Section */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Demand Forecast" />
            <Tab label="Product Analysis" />
            <Tab label="Seasonal Trends" />
            <Tab label="ML Models" />
          </Tabs>
        </Box>

        {/* Tab 1: Demand Forecast */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Demand Forecast vs Actual
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#0071ce" name="Actual Demand" />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#ffc220" 
                    strokeWidth={3}
                    name="Forecasted Demand"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="confidence" 
                    fill="#e3f2fd" 
                    fillOpacity={0.3}
                    name="Confidence Level"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Product Analysis */}
        <TabPanel value={tabValue} index={1}>
          <Box mb={2} display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Filter by Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Current Demand</TableCell>
                  <TableCell align="right">Forecasted Demand</TableCell>
                  <TableCell align="center">Accuracy</TableCell>
                  <TableCell align="center">Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <ForecastAccuracy
                    key={product.id}
                    product={product}
                    accuracy={product.accuracy}
                    trend={product.trend}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 3: Seasonal Trends */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Seasonal Demand Patterns by Category
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={seasonalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="electronics" 
                stackId="1" 
                stroke="#0071ce" 
                fill="#0071ce" 
                name="Electronics"
              />
              <Area 
                type="monotone" 
                dataKey="clothing" 
                stackId="1" 
                stroke="#ffc220" 
                fill="#ffc220" 
                name="Clothing"
              />
              <Area 
                type="monotone" 
                dataKey="homeGarden" 
                stackId="1" 
                stroke="#4caf50" 
                fill="#4caf50" 
                name="Home & Garden"
              />
              <Area 
                type="monotone" 
                dataKey="sports" 
                stackId="1" 
                stroke="#ff9800" 
                fill="#ff9800" 
                name="Sports"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>

        {/* Tab 4: ML Models */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active ML Models
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">ARIMA Time Series</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <LinearProgress variant="determinate" value={87} />
                    <Typography variant="caption" color="textSecondary">
                      Accuracy: 87%
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Neural Network (LSTM)</Typography>
                      <Chip label="Training" color="warning" size="small" />
                    </Box>
                    <LinearProgress variant="determinate" value={92} />
                    <Typography variant="caption" color="textSecondary">
                      Accuracy: 92%
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Random Forest</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <LinearProgress variant="determinate" value={84} />
                    <Typography variant="caption" color="textSecondary">
                      Accuracy: 84%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Model Performance Metrics
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Mean Absolute Error (MAE)
                    </Typography>
                    <Typography variant="h6">
                      2.3%
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Root Mean Square Error (RMSE)
                    </Typography>
                    <Typography variant="h6">
                      3.1%
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Mean Absolute Percentage Error (MAPE)
                    </Typography>
                    <Typography variant="h6">
                      12.5%
                    </Typography>
                  </Box>
                  
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Retrain Models
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default DemandAnalysis;
