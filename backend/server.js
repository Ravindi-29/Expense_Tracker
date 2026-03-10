const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
const auth = require('./routes/auth');
const transactions = require('./routes/transactions');
const summary = require('./routes/summary');

app.use('/api/auth', auth);
app.use('/api/transactions', transactions);
app.use('/api/summary', summary);

// Basic route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        // If MongoDB fails, we could potentially fall back to something else, 
        // but for now we'll just log it.
        // process.exit(1);
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
