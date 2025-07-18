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
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  Schedule,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Refresh,
  Download,
  FilterList,
  Search,
  Add,
  Edit,
  Visibility,
  Star,
  LocalShipping,
  Assessment,
  ContactPhone,
  Delete,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } from './supplierApi';

// SupplierMetricCard component
function SupplierMetricCard({ title, value, change, icon, color, subtitle }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={2}>{icon}</Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" color={color + ".main"}>
              {value}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
        {change !== undefined && (
          <Typography variant="caption" color={change >= 0 ? "success.main" : "error.main"}>
            {change >= 0 ? "+" : ""}{change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// Supplier Row Component
const SupplierRow = ({ supplier, onEdit, onView, onDelete }) => {
  const getPerformanceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Review': return 'warning';
      case 'Suspended': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {supplier.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{supplier.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {supplier.category}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Rating value={supplier.rating} readOnly size="small" />
        <Typography variant="caption" display="block">
          {supplier.rating}/5
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Chip
          label={`${supplier.onTimeDelivery}%`}
          color={getPerformanceColor(supplier.onTimeDelivery)}
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          label={`${supplier.qualityScore}%`}
          color={getPerformanceColor(supplier.qualityScore)}
          size="small"
        />
      </TableCell>
      <TableCell align="right">${supplier.totalOrders.toLocaleString()}</TableCell>
      <TableCell>
        <Chip
          label={supplier.status}
          color={getStatusColor(supplier.status)}
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onView(supplier)} size="small">
          <Visibility />
        </IconButton>
        <IconButton onClick={() => onEdit(supplier)} size="small">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(supplier)} size="small" color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// Supplier Details Dialog
const SupplierDetailsDialog = ({ open, onClose, supplier }) => {
  if (!supplier) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {supplier.name.charAt(0)}
          </Avatar>
          {supplier.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> {supplier.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Phone:</strong> {supplier.phone}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Address:</strong> {supplier.address}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Box mb={2}>
              <Typography variant="body2">On-Time Delivery</Typography>
              <LinearProgress
                variant="determinate"
                value={supplier.onTimeDelivery}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption">{supplier.onTimeDelivery}%</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2">Quality Score</Typography>
              <LinearProgress
                variant="determinate"
                value={supplier.qualityScore}
                sx={{ mt: 1 }}
                color="secondary"
              />
              <Typography variant="caption">{supplier.qualityScore}%</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained">Edit Supplier</Button>
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
      id={`supplier-tabpanel-${index}`}
      aria-labelledby={`supplier-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Supplier Performance Component
function SupplierPerformance() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [supplierData, setSupplierData] = useState({
    metrics: {
      totalSuppliers: 156,
      activeSuppliers: 142,
      avgDeliveryTime: 3.2,
      avgQualityScore: 87.5,
    },
    changes: {
      suppliers: 8.3,
      active: 5.2,
      delivery: -12.5,
      quality: 4.7,
    },
    suppliers: [
      {
        id: 1,
        name: 'Samsung Electronics',
        category: 'Electronics',
        rating: 4.8,
        onTimeDelivery: 94,
        qualityScore: 96,
        totalOrders: 2450000,
        status: 'Active',
        email: 'contact@samsung.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, Seoul, South Korea',
      },
      {
        id: 2,
        name: 'Nike Inc.',
        category: 'Clothing',
        rating: 4.5,
        onTimeDelivery: 89,
        qualityScore: 92,
        totalOrders: 1850000,
        status: 'Active',
        email: 'orders@nike.com',
        phone: '+1-555-0124',
        address: '456 Sports Ave, Beaverton, OR',
      },
      {
        id: 3,
        name: 'Dyson Ltd.',
        category: 'Home & Garden',
        rating: 4.3,
        onTimeDelivery: 76,
        qualityScore: 88,
        totalOrders: 980000,
        status: 'Under Review',
        email: 'supply@dyson.com',
        phone: '+1-555-0125',
        address: '789 Innovation Blvd, Malmesbury, UK',
      },
      {
        id: 4,
        name: 'Apple Inc.',
        category: 'Electronics',
        rating: 4.9,
        onTimeDelivery: 97,
        qualityScore: 98,
        totalOrders: 3200000,
        status: 'Active',
        email: 'supplier@apple.com',
        phone: '+1-555-0126',
        address: '1 Apple Park Way, Cupertino, CA',
      },
      {
        id: 5,
        name: 'Adidas AG',
        category: 'Clothing',
        rating: 4.2,
        onTimeDelivery: 72,
        qualityScore: 85,
        totalOrders: 1450000,
        status: 'Suspended',
        email: 'orders@adidas.com',
        phone: '+1-555-0127',
        address: '456 Sports Plaza, Herzogenaurach, Germany',
      },
    ],
    performanceTrends: [
      { month: 'Jan', onTime: 85, quality: 88, cost: 92 },
      { month: 'Feb', onTime: 87, quality: 90, cost: 89 },
      { month: 'Mar', onTime: 89, quality: 87, cost: 91 },
      { month: 'Apr', onTime: 91, quality: 92, cost: 88 },
      { month: 'May', onTime: 88, quality: 89, cost: 90 },
      { month: 'Jun', onTime: 92, quality: 94, cost: 87 },
    ],
    categoryPerformance: [
      { category: 'Electronics', suppliers: 45, avgScore: 92 },
      { category: 'Clothing', suppliers: 38, avgScore: 85 },
      { category: 'Home & Garden', suppliers: 32, avgScore: 88 },
      { category: 'Sports', suppliers: 25, avgScore: 83 },
      { category: 'Books', suppliers: 16, avgScore: 90 },
    ],
    riskAssessment: [
      { supplier: 'Samsung Electronics', risk: 'Low', score: 95 },
      { supplier: 'Apple Inc.', risk: 'Low', score: 98 },
      { supplier: 'Nike Inc.', risk: 'Medium', score: 78 },
      { supplier: 'Dyson Ltd.', risk: 'High', score: 65 },
      { supplier: 'Adidas AG', risk: 'High', score: 58 },
    ],
    alerts: [
      {
        type: 'error',
        message: 'Adidas AG has been suspended due to quality issues',
        action: 'Review Contract',
      },
      {
        type: 'warning',
        message: 'Dyson Ltd. delivery performance below 80% threshold',
        action: 'Contact Supplier',
      },
      {
        type: 'info',
        message: '3 suppliers due for quarterly performance review',
        action: 'Schedule Reviews',
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch supplier data from backend
  const loadSupplierData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers();
      setSupplierData(data);
    } catch (err) {
      setError('Failed to load supplier data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupplierData();
    // eslint-disable-next-line
  }, []);

  const handleRefreshData = () => {
    loadSupplierData();
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setDetailsOpen(true);
  };


  const handleEditSupplier = (supplier) => {
    setEditData(supplier);
    setDialogOpen(true);
  };

  const handleDeleteSupplier = async (supplier) => {
    setDialogLoading(true);
    setError(null);
    try {
      await deleteSupplier(supplier._id || supplier.id);
      await loadSupplierData();
    } catch (err) {
      setError('Failed to delete supplier data');
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
        await updateSupplier(editData._id || editData.id, form);
      } else {
        await addSupplier(form);
      }
      setDialogOpen(false);
      setEditData(null);
      await loadSupplierData();
    } catch (err) {
      setError('Failed to save supplier data');
    } finally {
      setDialogLoading(false);
    }
  };

  const filteredSuppliers = supplierData && supplierData.suppliers
    ? supplierData.suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || supplier.category === categoryFilter;
      const matchesStatus = !statusFilter || supplier.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    : [];

  const metrics = supplierData?.metrics || {};
  const changes = supplierData?.changes || {};
  const performanceTrends = supplierData?.performanceTrends || [];
  const categoryPerformance = supplierData?.categoryPerformance || [];
  const riskAssessment = supplierData?.riskAssessment || [];
  const alerts = supplierData?.alerts || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Supplier Performance Management
        </Typography>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefreshData} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" startIcon={<Download />}>
            Export Report
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Supplier
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
                color={alert.type === 'error' ? 'error' : 'primary'}
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
          <SupplierMetricCard
            title="Total Suppliers"
            value={metrics.totalSuppliers}
            change={changes.suppliers}
            icon={<Business />}
            color="primary"
            subtitle="Registered suppliers"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SupplierMetricCard
            title="Active Suppliers"
            value={metrics.activeSuppliers}
            change={changes.active}
            icon={<CheckCircle />}
            color="success"
            subtitle="Currently active"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SupplierMetricCard
            title="Avg Delivery Time"
            value={`${metrics.avgDeliveryTime} days`}
            change={changes.delivery}
            icon={<LocalShipping />}
            color="info"
            subtitle="Average lead time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SupplierMetricCard
            title="Avg Quality Score"
            value={`${metrics.avgQualityScore?.toFixed ? metrics.avgQualityScore.toFixed(1) : metrics.avgQualityScore}%`}
            change={changes.quality}
            icon={<Star />}
            color="secondary"
            subtitle="Overall quality"
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Supplier Directory" />
            <Tab label="Performance Trends" />
            <Tab label="Risk Assessment" />
            <Tab label="Category Analysis" />
          </Tabs>
        </Box>

        {/* Tab 1: Supplier Directory */}
        <TabPanel value={tabValue} index={0}>
          <Box mb={3} display="flex" gap={2} flexWrap="wrap">
            <TextField
              placeholder="Search suppliers..."
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="center">On-Time Delivery</TableCell>
                  <TableCell align="center">Quality Score</TableCell>
                  <TableCell align="right">Total Orders</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <SupplierRow
                    key={supplier._id || supplier.id}
                    supplier={supplier}
                    onEdit={handleEditSupplier}
                    onView={handleViewSupplier}
                    onDelete={handleDeleteSupplier}
                  />
                ))}
                {/* Add/Edit Dialog */}
                <SupplierDialog
                  open={dialogOpen}
                  onClose={handleDialogClose}
                  onSave={handleDialogSave}
                  initialData={editData}
                  loading={dialogLoading}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Performance Trends */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Supplier Performance Trends
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="onTime"
                stroke="#0071ce"
                strokeWidth={2}
                name="On-Time Delivery %"
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#ffc220"
                strokeWidth={2}
                name="Quality Score %"
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#4caf50"
                strokeWidth={2}
                name="Cost Efficiency %"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabPanel>

        {/* Tab 3: Risk Assessment */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Supplier Risk Assessment
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="center">Risk Level</TableCell>
                  <TableCell align="center">Risk Score</TableCell>
                  <TableCell align="center">Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskAssessment.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.risk}
                        color={
                          item.risk === 'Low' ? 'success' :
                            item.risk === 'Medium' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{item.score}</TableCell>
                    <TableCell align="center">
                      <LinearProgress
                        variant="determinate"
                        value={item.score}
                        sx={{ width: 100 }}
                        color={
                          item.score >= 90 ? 'success' :
                            item.score >= 75 ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 4: Category Analysis */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Suppliers by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="suppliers"
                    label={({ category, suppliers }) => `${category}: ${suppliers}`}
                  >
                    {categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Average Performance by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="avgScore" fill="#0071ce" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Supplier Details Dialog */}
      <SupplierDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        supplier={selectedSupplier}
      />
    </Box>
  );
}

function SupplierDialog({ open, onClose, onSave, initialData, loading }) {
  const [form, setForm] = React.useState({
    name: '',
    category: '',
    rating: '',
    onTimeDelivery: '',
    qualityScore: '',
    totalOrders: '',
    status: 'Active',
    email: '',
    phone: '',
    address: '',
  });

  React.useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        name: '',
        category: '',
        rating: '',
        onTimeDelivery: '',
        qualityScore: '',
        totalOrders: '',
        status: 'Active',
        email: '',
        phone: '',
        address: '',
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
      <DialogTitle>{initialData ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
      <DialogContent>
        <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth margin="normal" />
        <TextField label="Category" value={form.category} onChange={handleChange('category')} fullWidth margin="normal" />
        <TextField label="Rating" value={form.rating} onChange={handleChange('rating')} type="number" fullWidth margin="normal" />
        <TextField label="On-Time Delivery (%)" value={form.onTimeDelivery} onChange={handleChange('onTimeDelivery')} type="number" fullWidth margin="normal" />
        <TextField label="Quality Score (%)" value={form.qualityScore} onChange={handleChange('qualityScore')} type="number" fullWidth margin="normal" />
        <TextField label="Total Orders" value={form.totalOrders} onChange={handleChange('totalOrders')} type="number" fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select value={form.status} onChange={handleChange('status')} label="Status">
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Under Review">Under Review</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth margin="normal" />
        <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth margin="normal" />
        <TextField label="Address" value={form.address} onChange={handleChange('address')} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>{initialData ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SupplierPerformance;
