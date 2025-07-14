// src/pages/DynamicPricing/DynamicPricing.jsx
import React, { useState, useEffect } from 'react';
import { fetchPricing, addPricing } from './pricingApi';
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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Slider,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  LocalOffer,
  AttachMoney,
  CompareArrows,
  AutoMode,
  Warning,
  CheckCircle,
  Refresh,
  Download,
  Search,
  Edit,
  Visibility,
  Timeline,
  Assessment,
  Speed,
  MonetizationOn,
  PriceChange,
  Analytics,
  Add as AddIcon,  // ✅ Fixed: Using Add as AddIcon
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
  ScatterChart,
  Scatter,
} from 'recharts';

// Pricing Metric Card Component
const PricingMetricCard = ({ title, value, change, icon, color = 'primary', subtitle }) => (
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

// Product Pricing Row Component
const ProductPricingRow = ({ product, onEdit, onView }) => {
  const getPriceChangeColor = (change) => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  const getCompetitiveStatusColor = (status) => {
    switch (status) {
      case 'Competitive': return 'success';
      case 'Above Market': return 'warning';
      case 'Below Market': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box>
          <Typography variant="subtitle2">{product.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            SKU: {product.sku}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2">${product.currentPrice}</Typography>
        <Typography variant="caption" color="textSecondary">
          Was: ${product.originalPrice}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2">${product.suggestedPrice}</Typography>
        <Chip
          label={`${product.priceChange > 0 ? '+' : ''}${product.priceChange}%`}
          color={getPriceChangeColor(product.priceChange)}
          size="small"
          sx={{ mt: 0.5 }}
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          label={product.competitiveStatus}
          color={getCompetitiveStatusColor(product.competitiveStatus)}
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <FormControlLabel
          control={
            <Switch
              checked={product.autoPricing}
              size="small"
              color="primary"
            />
          }
          label=""
        />
      </TableCell>
      <TableCell align="right">{product.demandScore}</TableCell>
      <TableCell>
        <IconButton onClick={() => onView(product)} size="small">
          <Visibility />
        </IconButton>
        <IconButton onClick={() => onEdit(product)} size="small">
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// Price Optimization Dialog
const PriceOptimizationDialog = ({ open, onClose, product, onApply }) => {
  const [optimizedPrice, setOptimizedPrice] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100]);

  useEffect(() => {
    if (product) {
      setOptimizedPrice(product.suggestedPrice);
      setPriceRange([product.currentPrice * 0.8, product.currentPrice * 1.2]);
    }
  }, [product]);

  if (!product) return null;

  const handleApplyPrice = () => {
    onApply(product.id, optimizedPrice);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Price Optimization - {product.name}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Current Pricing
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Current Price
              </Typography>
              <Typography variant="h5">
                ${product.currentPrice}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Competitor Average
              </Typography>
              <Typography variant="h6">
                ${product.competitorAvg}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Demand Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={product.demandScore}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption">{product.demandScore}/100</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Price Optimization
            </Typography>
            <Box mb={3}>
              <Typography variant="body2" gutterBottom>
                Optimized Price: ${optimizedPrice}
              </Typography>
              <Slider
                value={optimizedPrice}
                onChange={(e, value) => setOptimizedPrice(value)}
                min={priceRange[0]}
                max={priceRange[1]}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption">${priceRange[0]}</Typography>
                <Typography variant="caption">${priceRange[1]}</Typography>
              </Box>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Expected Revenue Impact
              </Typography>
              <Typography variant="h6" color="success.main">
                +${((optimizedPrice - product.currentPrice) * 100).toFixed(0)}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Margin Impact
              </Typography>
              <Typography variant="h6" color="primary.main">
                +{((optimizedPrice - product.currentPrice) / product.currentPrice * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApplyPrice} variant="contained">
          Apply Price
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pricing-tabpanel-${index}`}
      aria-labelledby={`pricing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Dynamic Pricing Component
function DynamicPricing() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pricingStrategy, setPricingStrategy] = useState('competitive');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [optimizationOpen, setOptimizationOpen] = useState(false);

  const [pricingData, setPricingData] = useState(null);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch pricing data from backend
  const loadPricingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPricing();
      setPricingData(data);
    } catch (err) {
      setError('Failed to load pricing data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPricingData();
    // eslint-disable-next-line
  }, []);

  const handleRefreshData = () => {
    loadPricingData();
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setOptimizationOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product pricing:', product);
  };

  const handleApplyOptimizedPrice = async (productId, newPrice) => {
    setIsLoading(true);
    setError(null);
    try {
      // Find the product to update
      const product = pricingData.products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      const updatedProduct = { ...product, currentPrice: newPrice };
      await addPricing(updatedProduct);
      await loadPricingData();
    } catch (err) {
      setError('Failed to update price');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = pricingData && pricingData.products
    ? pricingData.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    : [];

  const metrics = pricingData?.metrics || {};
  const changes = pricingData?.changes || {};
  const priceHistory = pricingData?.priceHistory || [];
  const competitorAnalysis = pricingData?.competitorAnalysis || [];
  const pricingRules = pricingData?.pricingRules || [];
  const alerts = pricingData?.alerts || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Dynamic Pricing Engine
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Pricing Strategy</InputLabel>
            <Select
              value={pricingStrategy}
              onChange={(e) => setPricingStrategy(e.target.value)}
              label="Pricing Strategy"
            >
              <MenuItem value="competitive">Competitive</MenuItem>
              <MenuItem value="demand">Demand-Based</MenuItem>
              <MenuItem value="margin">Margin Optimization</MenuItem>
              <MenuItem value="penetration">Market Penetration</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefreshData} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<Download />}>
            Export Report
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
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Total Products"
            value={(metrics.totalProducts != null ? metrics.totalProducts : 0).toLocaleString()}
            change={changes.products != null ? changes.products : 0}
            icon={<LocalOffer />}
            color="primary"
            subtitle="Under pricing management"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Auto-Pricing Enabled"
            value={(metrics.autoPricingEnabled != null ? metrics.autoPricingEnabled : 0).toLocaleString()}
            change={changes.autoPricing != null ? changes.autoPricing : 0}
            icon={<AutoMode />}
            color="success"
            subtitle="Automated pricing rules"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Margin Improvement"
            value={`${metrics.avgMarginImprovement != null ? metrics.avgMarginImprovement : 0}%`}
            change={changes.margin != null ? changes.margin : 0}
            icon={<TrendingUp />}
            color="info"
            subtitle="Average improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Revenue Increase"
            value={`${metrics.revenueIncrease != null ? metrics.revenueIncrease : 0}%`}
            change={changes.revenue != null ? changes.revenue : 0}
            icon={<MonetizationOn />}
            color="secondary"
            subtitle="From dynamic pricing"
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Product Pricing" />
            <Tab label="Price Analytics" />
            <Tab label="Competitor Analysis" />
            <Tab label="Pricing Rules" />
          </Tabs>
        </Box>

        {/* Tab 1: Product Pricing */}
        <TabPanel value={tabValue} index={0}>
          <Box mb={3} display="flex" gap={2} flexWrap="wrap">
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<PriceChange />}>
              Bulk Price Update
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Suggested Price</TableCell>
                  <TableCell align="center">Competitive Status</TableCell>
                  <TableCell align="center">Auto-Pricing</TableCell>
                  <TableCell align="right">Demand Score</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <ProductPricingRow
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onView={handleViewProduct}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Price Analytics */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Price Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="margin" fill="#4caf50" name="Margin %" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#0071ce"
                    strokeWidth={2}
                    name="Avg Price"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="competitorPrice"
                    stroke="#ffc220"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Competitor Avg"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Competitor Analysis */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Competitor Price Comparison
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Competitor</TableCell>
                  <TableCell align="right">Average Price</TableCell>
                  <TableCell align="center">Price Gap</TableCell>
                  <TableCell align="center">Market Share</TableCell>
                  <TableCell align="center">Competitive Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {competitorAnalysis.map((competitor, index) => (
                  <TableRow key={index}>
                    <TableCell>{competitor.competitor}</TableCell>
                    <TableCell align="right">${competitor.avgPrice}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${competitor.priceGap > 0 ? '+' : ''}${competitor.priceGap}%`}
                        color={competitor.priceGap > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{competitor.marketShare}%</TableCell>
                    <TableCell align="center">
                      <LinearProgress
                        variant="determinate"
                        value={competitor.marketShare}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 4: Pricing Rules */}
        <TabPanel value={tabValue} index={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Active Pricing Rules
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>  {/* ✅ Fixed: Using AddIcon */}
              Create Rule
            </Button>
          </Box>

          <Grid container spacing={3}>
            {pricingRules.map((rule) => (
              <Grid item xs={12} md={6} key={rule.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6">{rule.name}</Typography>
                      <Chip
                        label={rule.status}
                        color={rule.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      {rule.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption">
                        {rule.productsAffected} products affected
                      </Typography>
                      <Box>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Price Optimization Dialog */}
      <PriceOptimizationDialog
        open={optimizationOpen}
        onClose={() => setOptimizationOpen(false)}
        product={selectedProduct}
        onApply={handleApplyOptimizedPrice}
      />
    </Box>
  );
}

export default DynamicPricing;
