// Expense management routes
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use JWT_SECRET from environment variable
        req.user = decoded.id; // Attach user ID to request
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Add an expense
router.post('/add', authenticateToken, async (req, res) => {
    const { type, name, date, amount } = req.body; // Assume user info is sent in the request body
    const user = req.user; // Get user ID from the request

    try {
        const expense = new Expense({ type, name, date, amount, user });
        await expense.save();
        res.json(expense);
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all expenses for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user }); // Get all expenses for the authenticated user
        res.json(expenses);
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete an expense
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        // Optionally, you could check if the expense belongs to the user
        if (!expense || expense.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized or Expense not found' });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
