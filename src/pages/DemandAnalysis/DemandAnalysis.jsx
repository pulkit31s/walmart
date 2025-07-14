// src/pages/DemandAnalysis/DemandAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { fetchDemand, addDemand, updateDemand, deleteDemand } from './demandApi';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  ShowChart,
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

// TabPanel helper for MUI Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Add/Edit Dialog for Product Forecasts
function AddEditForecastDialog({ open, onClose, onSave, initialData, loading }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    currentDemand: '',
    forecastedDemand: '',
    accuracy: '',
    trend: 'up',
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        name: '',
        category: '',
        currentDemand: '',
        forecastedDemand: '',
        accuracy: '',
        trend: 'up',
      });
    }
  }, [initialData, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Product Forecast' : 'Add Product Forecast'}</DialogTitle>
      <DialogContent>
        <TextField label="Product Name" value={form.name} onChange={handleChange('name')} fullWidth margin="normal" />
        <TextField label="Category" value={form.category} onChange={handleChange('category')} fullWidth margin="normal" />
        <TextField label="Current Demand" value={form.currentDemand} onChange={handleChange('currentDemand')} type="number" fullWidth margin="normal" />
        <TextField label="Forecasted Demand" value={form.forecastedDemand} onChange={handleChange('forecastedDemand')} type="number" fullWidth margin="normal" />
        <TextField label="Accuracy (%)" value={form.accuracy} onChange={handleChange('accuracy')} type="number" fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Trend</InputLabel>
          <Select value={form.trend} onChange={handleChange('trend')} label="Trend">
            <MenuItem value="up">Up</MenuItem>
            <MenuItem value="down">Down</MenuItem>
            <MenuItem value="flat">Flat</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>{initialData ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}
// ...existing code...

function DemandAnalysis() {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demandData, setDemandData] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch demand data from backend
  const loadDemandData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDemand();
      setDemandData(data);
    } catch (err) {
      setError('Failed to load demand data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemandData();
    // eslint-disable-next-line
  }, []);

  const handleRefreshData = () => {
    loadDemandData();
  };

  const handleAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };


  const handleEdit = (product) => {
    setEditData(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setDialogLoading(true);
    setError(null);
    try {
      await deleteDemand(id);
      await loadDemandData();
    } catch (err) {
      setError('Failed to delete demand data');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  const handleDialogSave = async (form) => {
    setDialogLoading(true);
    setError(null);
    try {
      if (editData && (editData._id || editData.id)) {
        await updateDemand(editData._id || editData.id, form);
      } else {
        await addDemand(form);
      }
      setDialogOpen(false);
      setEditData(null);
      await loadDemandData();
    } catch (err) {
      setError('Failed to save demand data');
    } finally {
      setDialogLoading(false);
    }
  };

  const filteredProducts = demandData && demandData.productForecasts
    ? demandData.productForecasts.filter(product =>
      !categoryFilter || product.category === categoryFilter
    )
    : [];

  const metrics = demandData?.metrics || {};
  const changes = demandData?.changes || {};
  const forecastData = demandData?.forecastData || [];
  const seasonalTrends = demandData?.seasonalTrends || [];
  const alerts = demandData?.alerts || [];

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
          <Button variant="contained" onClick={handleAdd}>
            Add Product Forecast
          </Button>
        </Box>
      </Box>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
      {/* ...existing code... */}

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
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow hover key={product._id || product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">{product.currentDemand?.toLocaleString?.() ?? product.currentDemand}</TableCell>
                    <TableCell align="right">{product.forecastedDemand?.toLocaleString?.() ?? product.forecastedDemand}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${product.accuracy}%`}
                        color={product.accuracy >= 90 ? 'success' : product.accuracy >= 75 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.trend === 'up' ? (
                        <TrendingUp color="success" />
                      ) : product.trend === 'down' ? (
                        <TrendingDown color="error" />
                      ) : (
                        <div>-</div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(product._id || product.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
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

      {/* Add/Edit Dialog */}
      <AddEditForecastDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        initialData={editData}
        loading={dialogLoading}
      />
    </Box>
  );
}

export default DemandAnalysis;
