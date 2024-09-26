// Expense schema
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Expense', ExpenseSchema);

