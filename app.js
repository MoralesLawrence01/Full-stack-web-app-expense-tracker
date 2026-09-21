require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors");

const user = require("./userSchema")
const expense = require("./expenseSchema");
//create express
const app = express()
//middlewares
app.use(cors())
app.use(express.json())

//connection to database
mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("connected")
    })
    .catch((e)=>{
        console.log(e,"not connected")
    })



app.get("/", async (req,res)=>{
    res.send("hello world")

})

app.get("/users", async (req, res) =>{
    const users = await user.find()
    res.json(users)
})

app.post("/register", async (req,res)=>{
    const newUser = new user({  
        userName: req.body.userName,
        password: req.body.password
    }) 
    await newUser.save()
    res.json({message: "Account Registered"})
})

app.post("/login", async (req,res)=>{
    const userFound = await user.findOne({
        userName: req.body.userName
    })
    if (userFound === null){
        res.json({
            message: "Invalid password or username",
            ok: false
        })
    }
    if(userFound.password !== req.body.password){
        res.json({
            message: "Invalid password or username",
            ok: false
        })
    }
    else  {
        res.json({
            message: "Log in Successfull",
            userId: userFound._id,
            userName: userFound.userName,
            ok: true
        })
    }
})

//exnpenses
app.post("/expense", async (req,res) => {
    const newExpense = new expense({
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        user: req.body.userId
    })
    const currUser = await user.findOne({
        _id: req.body.userId
    })
    

    const updateBalance = (currUser.balance + (req.body.amount))
    currUser.balance = updateBalance
    await currUser.save()
    await newExpense.save()
    
    res.json({
        message: "Expense Added",
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,       
        newBalance: currUser.balance,
        expenseId: newExpense._id
    })
    
})

//addingBalance
app.post("/addBalance", async (req,res) =>{
    const newBalance =  new expense({
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        user: req.body.userId
    })

    const currUser = await user.findOne({
        _id: req.body.userId
    })

    const updateBalance = (currUser.balance + Number((req.body.amount)))
    currUser.balance = updateBalance

    await currUser.save()
    await newBalance.save()
    res.json({
        message: "Expense Added",
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,       
        newBalance: currUser.balance,
        expenseId: newBalance._id
    })
})

//for updating balance
app.post("/balance", async (req,res)=>{
    const currUser = await user.findOne({
        _id: req.body.userId
    })
    res.json({
        balance: currUser.balance
    })
})

app.get("/renderTransaction/:id", async (req, res) => {
    const transaction = await expense.find({user: req.params.id})
    res.json(transaction)
})

app.delete("/deleteTransaction/:id/:userId", async (req,res) => {
    const transactionId = await expense.findOne({_id: req.params.id})
    const userId = await user.findOne({_id: req.params.userId})

    if(transactionId.amount > 0){
        const negativeAmount = Number(`-${transactionId.amount}`)
        userId.balance += negativeAmount
        await userId.save()
        await expense.findByIdAndDelete(req.params.id)    
    }else if(transactionId.amount < 0){
        const positiveAmount = Number(Math.abs(transactionId.amount))
        userId.balance += positiveAmount
        await userId.save()
        await expense.findByIdAndDelete(req.params.id)
    }

    res.json(transactionId, userId)
})

app.put("/editTransaction/:tranId/:userId", async (req,res) => {
    const transaction = await expense.findOne({_id: req.params.tranId})
    const User = await user.findOne({_id: req.params.userId})

    if(transaction.amount > 0){
        const negativeAmount = Number(`-${transaction.amount}`)
        User.balance += negativeAmount
        User.balance += Number(req.body.amount)
        transaction.amount = req.body.amount
        transaction.description = req.body.description
        transaction.date = req.body.date
        await User.save()
        await transaction.save()
           
    }else if(transaction.amount < 0){
        const positiveAmount = Number(Math.abs(transaction.amount))
        User.balance += positiveAmount
        User.balance += Number(req.body.amount)
        transaction.amount = req.body.amount
        transaction.description = req.body.description
        transaction.date = req.body.date
        await User.save()
        await transaction.save()
        
    }
    else{
        User.balance += Number(req.body.amount)
        transaction.amount = req.body.amount
        transaction.description = req.body.description
        transaction.date = req.body.date
        await User.save()
        await transaction.save()
    }


    res.json({
        transaction: transaction,
        balance: User.amount
    })
})

app.listen(3000)