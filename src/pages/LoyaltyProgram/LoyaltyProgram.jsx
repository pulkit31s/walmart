// src/pages/LoyaltyProgram/LoyaltyProgram.jsx
import React, { useState, useEffect } from 'react';
import { fetchLoyalty, addLoyalty } from './loyaltyApi';
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  CircularProgress,
  AvatarGroup,
} from '@mui/material';
import {
  Stars,
  EmojiEvents,
  CardGiftcard,
  TrendingUp,
  TrendingDown,
  People,
  LocalOffer,
  Casino,
  Refresh,
  Download,
  Search,
  Edit,
  Visibility,
  Share,
  Redeem,
  WorkspacePremium,
  SportsEsports,
  Timeline,
  Leaderboard,
  Celebration,
  CardGiftcard as GiftIcon,  // ✅ Fixed: Using CardGiftcard as GiftIcon
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

// Loyalty Metric Card Component
const LoyaltyMetricCard = ({ title, value, change, icon, color = 'primary', subtitle }) => (
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

// Customer Row Component
const CustomerRow = ({ customer, onView, onEdit }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'primary';
      case 'Gold': return 'warning';
      case 'Silver': return 'info';
      case 'Bronze': return 'default';
      default: return 'default';
    }
  };

  const getEngagementColor = (level) => {
    if (level >= 80) return 'success';
    if (level >= 60) return 'warning';
    return 'error';
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: getTierColor(customer.tier) + '.main' }}>
            {customer.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{customer.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              Member since {customer.joinDate}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={customer.tier}
          color={getTierColor(customer.tier)}
          size="small"
          icon={<WorkspacePremium />}
        />
      </TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2">{customer.points.toLocaleString()}</Typography>
        <Typography variant="caption" color="textSecondary">
          points
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress
            variant="determinate"
            value={customer.engagementLevel}
            size={40}
            color={getEngagementColor(customer.engagementLevel)}
          />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {customer.engagementLevel}%
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">{customer.totalSpent.toLocaleString()}</TableCell>
      <TableCell align="center">{customer.achievements}</TableCell>
      <TableCell>
        <IconButton onClick={() => onView(customer)} size="small">
          <Visibility />
        </IconButton>
        <IconButton onClick={() => onEdit(customer)} size="small">
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// Spin Wheel Component
const SpinWheel = ({ onSpin, isSpinning }) => {
  const prizes = [
    { label: '10% Off', color: '#FF6B6B' },
    { label: '500 Points', color: '#4ECDC4' },
    { label: '5% Off', color: '#45B7D1' },
    { label: '1000 Points', color: '#96CEB4' },
    { label: 'Free Shipping', color: '#FFEAA7' },
    { label: '15% Off', color: '#DDA0DD' },
    { label: '2000 Points', color: '#98D8C8' },
    { label: 'Try Again', color: '#F7DC6F' },
  ];

  return (
    <Card sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Daily Spin Wheel
      </Typography>
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '8px solid #0071ce',
          margin: '0 auto 20px',
          position: 'relative',
          background: `conic-gradient(${prizes.map((prize, index) =>
            `${prize.color} ${index * 45}deg ${(index + 1) * 45}deg`
          ).join(', ')})`,
          animation: isSpinning ? 'spin 3s ease-out' : 'none',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(1440deg)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            backgroundColor: 'white',
            borderRadius: '50%',
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '20px solid #0071ce',
            zIndex: 3,
          }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={onSpin}
        disabled={isSpinning}
        startIcon={<Casino />}
        size="large"
      >
        {isSpinning ? 'Spinning...' : 'Spin Now!'}
      </Button>
    </Card>
  );
};

// Achievement Badge Component
const AchievementBadge = ({ achievement, earned = false }) => (
  <Card
    sx={{
      p: 2,
      textAlign: 'center',
      opacity: earned ? 1 : 0.5,
      border: earned ? '2px solid gold' : '1px solid #ddd',
    }}
  >
    <Avatar
      sx={{
        width: 60,
        height: 60,
        bgcolor: earned ? 'gold' : 'grey.300',
        margin: '0 auto 10px',
      }}
    >
      <EmojiEvents />
    </Avatar>
    <Typography variant="subtitle2" gutterBottom>
      {achievement.name}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      {achievement.description}
    </Typography>
    {earned && (
      <Chip
        label="Earned"
        color="success"
        size="small"
        sx={{ mt: 1 }}
      />
    )}
  </Card>
);

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loyalty-tabpanel-${index}`}
      aria-labelledby={`loyalty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Loyalty Program Component
function LoyaltyProgram() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [loyaltyData, setLoyaltyData] = useState(null);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch loyalty data from backend
  const loadLoyaltyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLoyalty();
      setLoyaltyData(data);
    } catch (err) {
      setError('Failed to load loyalty data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoyaltyData();
    // eslint-disable-next-line
  }, []);

  const handleRefreshData = () => {
    loadLoyaltyData();
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      // Show prize dialog or notification
      alert('Congratulations! You won 500 points!');
    }, 3000);
  };

  const handleViewCustomer = (customer) => {
    console.log('View customer:', customer);
  };

  const handleEditCustomer = (customer) => {
    console.log('Edit customer:', customer);
  };

  const filteredCustomers = loyaltyData && loyaltyData.customers
    ? loyaltyData.customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = !tierFilter || customer.tier === tierFilter;
      return matchesSearch && matchesTier;
    })
    : [];

  const metrics = loyaltyData?.metrics || {};
  const changes = loyaltyData?.changes || {};
  const engagementTrends = loyaltyData?.engagementTrends || [];
  const tierDistribution = loyaltyData?.tierDistribution || [];
  const achievements = loyaltyData?.achievements || [];
  const leaderboard = loyaltyData?.leaderboard || [];
  const alerts = loyaltyData?.alerts || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Loyalty Gaming Program
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
          <Button variant="contained" startIcon={<GiftIcon />}>  {/* ✅ Fixed: Using GiftIcon */}
            Create Campaign
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
          <LoyaltyMetricCard
            title="Total Members"
            value={metrics.totalMembers.toLocaleString()}
            change={changes.members}
            icon={<People />}
            color="primary"
            subtitle="Registered users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LoyaltyMetricCard
            title="Active Members"
            value={metrics.activeMembers.toLocaleString()}
            change={changes.active}
            icon={<TrendingUp />}
            color="success"
            subtitle="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LoyaltyMetricCard
            title="Avg Points"
            value={metrics.avgPointsPerMember.toLocaleString()}
            change={changes.points}
            icon={<Stars />}
            color="info"
            subtitle="Per member"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LoyaltyMetricCard
            title="Redemption Rate"
            value={`${metrics.redemptionRate}%`}
            change={changes.redemption}
            icon={<CardGiftcard />}
            color="secondary"
            subtitle="Points redeemed"
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Member Dashboard" />
            <Tab label="Gaming Features" />
            <Tab label="Analytics" />
            <Tab label="Achievements" />
            <Tab label="Leaderboard" />
          </Tabs>
        </Box>

        {/* Tab 1: Member Dashboard */}
        <TabPanel value={tabValue} index={0}>
          <Box mb={3} display="flex" gap={2} flexWrap="wrap">
            <TextField
              placeholder="Search members..."
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
              <InputLabel>Tier</InputLabel>
              <Select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                label="Tier"
              >
                <MenuItem value="">All Tiers</MenuItem>
                <MenuItem value="Platinum">Platinum</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
                <MenuItem value="Bronze">Bronze</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="center">Engagement</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell align="center">Achievements</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onView={handleViewCustomer}
                    onEdit={handleEditCustomer}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Gaming Features */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <SpinWheel onSpin={handleSpin} isSpinning={isSpinning} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Daily Check-in
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'success.main', margin: '0 auto' }}>
                    <Celebration fontSize="large" />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Check in daily to earn bonus points!
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{ my: 2 }}
                />
                <Typography variant="caption" display="block" gutterBottom>
                  6/10 days this month
                </Typography>
                <Button variant="contained" fullWidth>
                  Check In (+50 points)
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Scratch Card
                </Typography>
                <Box
                  sx={{
                    width: 150,
                    height: 100,
                    bgcolor: 'gold',
                    borderRadius: 2,
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'goldenrod',
                    },
                  }}
                >
                  <Typography variant="h6" color="white">
                    SCRATCH
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Scratch to reveal your prize!
                </Typography>
                <Button variant="outlined" fullWidth>
                  Get Scratch Card (100 points)
                </Button>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Active Challenges
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'Weekend Warrior', description: 'Shop on weekends for 3 weeks', progress: 67, reward: '1000 points' },
              { title: 'Review Guru', description: 'Write 5 product reviews', progress: 40, reward: '500 points' },
              { title: 'Social Butterfly', description: 'Share 3 products on social media', progress: 33, reward: '300 points' },
            ].map((challenge, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {challenge.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {challenge.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={challenge.progress}
                    sx={{ my: 1 }}
                  />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                      {challenge.progress}% complete
                    </Typography>
                    <Chip label={challenge.reward} size="small" color="primary" />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 3: Analytics */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Engagement Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={engagementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    stackId="1"
                    stroke="#0071ce"
                    fill="#0071ce"
                    name="Daily Logins"
                  />
                  <Area
                    type="monotone"
                    dataKey="purchases"
                    stackId="1"
                    stroke="#ffc220"
                    fill="#ffc220"
                    name="Purchases"
                  />
                  <Area
                    type="monotone"
                    dataKey="points"
                    stackId="2"
                    stroke="#4caf50"
                    fill="#4caf50"
                    name="Points Earned"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Tier Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="members"
                    label={({ tier, percentage }) => `${tier}: ${percentage}%`}
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Achievements */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Available Achievements
          </Typography>
          <Grid container spacing={3}>
            {achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <AchievementBadge
                  achievement={achievement}
                  earned={Math.random() > 0.5} // Random for demo
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 5: Leaderboard */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Top Members This Month
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="center">Badge</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((member) => (
                  <TableRow key={member.rank}>
                    <TableCell align="center">
                      <Avatar
                        sx={{
                          bgcolor: member.rank <= 3 ? 'gold' : 'grey.300',
                          width: 32,
                          height: 32,
                        }}
                      >
                        {member.rank}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        {member.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.tier}
                        color={member.tier === 'Platinum' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {member.points.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      {member.rank <= 3 && (
                        <EmojiEvents sx={{ color: 'gold' }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default LoyaltyProgram;
