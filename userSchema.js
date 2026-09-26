const mongoose = require("mongoose")
const expense = require("./expenseSchema")
const { type } = require("node:os")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    savings: {
        type: Number,
        default: 0
    }
})

const user = mongoose.model("user", userSchema)

module.exports = user
