require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/demand', require('./routes/demand'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/supplier', require('./routes/supplier'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
