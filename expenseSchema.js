const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const expense = mongoose.model("expense", expenseSchema)

module.exports = expense