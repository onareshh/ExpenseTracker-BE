// Main Node.js server file
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env or fallback to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using the URI from .env
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

