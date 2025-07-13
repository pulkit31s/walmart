// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import InventoryManagement from './pages/InventoryManagement/InventoryManagement';
import DemandAnalysis from './pages/DemandAnalysis/DemandAnalysis.jsx';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0071ce', // Walmart blue
    },
    secondary: {
      main: '#ffc220', // Walmart yellow
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="demand" element={<DemandAnalysis/>}/>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
