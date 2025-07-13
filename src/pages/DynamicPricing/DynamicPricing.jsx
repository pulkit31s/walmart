// src/pages/DynamicPricing/DynamicPricing.jsx
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

  const [pricingData, setPricingData] = useState({
    metrics: {
      totalProducts: 1250,
      autoPricingEnabled: 890,
      avgMarginImprovement: 15.3,
      revenueIncrease: 8.7,
    },
    changes: {
      products: 5.2,
      autoPricing: 12.8,
      margin: 23.5,
      revenue: 18.9,
    },
    products: [
      {
        id: 1,
        name: 'Samsung 55" Smart TV',
        sku: 'ELE001',
        category: 'Electronics',
        currentPrice: 599.99,
        originalPrice: 649.99,
        suggestedPrice: 579.99,
        priceChange: -3.3,
        competitorAvg: 585.00,
        competitiveStatus: 'Competitive',
        autoPricing: true,
        demandScore: 85,
      },
      {
        id: 2,
        name: 'Nike Air Max Shoes',
        sku: 'CLO001',
        category: 'Clothing',
        currentPrice: 129.99,
        originalPrice: 139.99,
        suggestedPrice: 134.99,
        priceChange: 3.8,
        competitorAvg: 132.00,
        competitiveStatus: 'Above Market',
        autoPricing: false,
        demandScore: 78,
      },
      {
        id: 3,
        name: 'Dyson V11 Vacuum',
        sku: 'HOM001',
        category: 'Home & Garden',
        currentPrice: 449.99,
        originalPrice: 499.99,
        suggestedPrice: 429.99,
        priceChange: -4.4,
        competitorAvg: 435.00,
        competitiveStatus: 'Below Market',
        autoPricing: true,
        demandScore: 92,
      },
      {
        id: 4,
        name: 'iPhone 15 Pro',
        sku: 'ELE002',
        category: 'Electronics',
        currentPrice: 999.99,
        originalPrice: 1099.99,
        suggestedPrice: 979.99,
        priceChange: -2.0,
        competitorAvg: 995.00,
        competitiveStatus: 'Competitive',
        autoPricing: true,
        demandScore: 96,
      },
      {
        id: 5,
        name: 'Adidas Running Shoes',
        sku: 'CLO002',
        category: 'Clothing',
        currentPrice: 89.99,
        originalPrice: 99.99,
        suggestedPrice: 94.99,
        priceChange: 5.6,
        competitorAvg: 92.00,
        competitiveStatus: 'Above Market',
        autoPricing: false,
        demandScore: 73,
      },
    ],
    priceHistory: [
      { date: 'Jan', avgPrice: 125.50, competitorPrice: 128.00, margin: 22.5 },
      { date: 'Feb', avgPrice: 123.75, competitorPrice: 126.50, margin: 23.1 },
      { date: 'Mar', avgPrice: 127.25, competitorPrice: 129.75, margin: 21.8 },
      { date: 'Apr', avgPrice: 129.50, competitorPrice: 131.25, margin: 24.2 },
      { date: 'May', avgPrice: 126.75, competitorPrice: 128.50, margin: 25.6 },
      { date: 'Jun', avgPrice: 131.25, competitorPrice: 133.00, margin: 26.3 },
    ],
    competitorAnalysis: [
      { competitor: 'Amazon', avgPrice: 128.50, priceGap: -2.3, marketShare: 35 },
      { competitor: 'Target', avgPrice: 132.75, priceGap: 1.2, marketShare: 18 },
      { competitor: 'Best Buy', avgPrice: 125.25, priceGap: -4.8, marketShare: 15 },
      { competitor: 'Costco', avgPrice: 119.99, priceGap: -8.9, marketShare: 12 },
      { competitor: 'Home Depot', avgPrice: 134.50, priceGap: 3.1, marketShare: 10 },
    ],
    pricingRules: [
      {
        id: 1,
        name: 'Competitive Pricing',
        description: 'Match competitor prices within 5% range',
        status: 'Active',
        productsAffected: 450,
      },
      {
        id: 2,
        name: 'Demand-Based Pricing',
        description: 'Adjust prices based on demand fluctuations',
        status: 'Active',
        productsAffected: 320,
      },
      {
        id: 3,
        name: 'Inventory Clearance',
        description: 'Reduce prices for overstocked items',
        status: 'Paused',
        productsAffected: 120,
      },
      {
        id: 4,
        name: 'Premium Product Strategy',
        description: 'Maintain premium pricing for high-end products',
        status: 'Active',
        productsAffected: 85,
      },
    ],
    alerts: [
      {
        type: 'warning',
        message: '15 products have competitor prices 10% lower than current pricing',
        action: 'Review Pricing',
      },
      {
        type: 'info',
        message: 'Seasonal pricing adjustment recommended for 45 products',
        action: 'Apply Changes',
      },
      {
        type: 'success',
        message: 'Auto-pricing generated $12,500 additional revenue this week',
        action: 'View Details',
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPricingData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          avgMarginImprovement: prev.metrics.avgMarginImprovement + Math.random() * 2 - 1,
        },
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setOptimizationOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product pricing:', product);
  };

  const handleApplyOptimizedPrice = (productId, newPrice) => {
    setPricingData(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === productId
          ? { ...product, currentPrice: newPrice }
          : product
      ),
    }));
  };

  const filteredProducts = pricingData.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const { metrics, changes, priceHistory, competitorAnalysis, pricingRules, alerts } = pricingData;

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
            value={metrics.totalProducts.toLocaleString()}
            change={changes.products}
            icon={<LocalOffer />}
            color="primary"
            subtitle="Under pricing management"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Auto-Pricing Enabled"
            value={metrics.autoPricingEnabled.toLocaleString()}
            change={changes.autoPricing}
            icon={<AutoMode />}
            color="success"
            subtitle="Automated pricing rules"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Margin Improvement"
            value={`${metrics.avgMarginImprovement}%`}
            change={changes.margin}
            icon={<TrendingUp />}
            color="info"
            subtitle="Average improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PricingMetricCard
            title="Revenue Increase"
            value={`${metrics.revenueIncrease}%`}
            change={changes.revenue}
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
