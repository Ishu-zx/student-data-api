const express = require('express')
const app = express()
const connectDB = require('./config/database')
const studentRoute = require('./routers/students.routes')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const auth = require('./middleware/auth')
const userRoute = require('./routers/users.routes')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 1000*60,
    limit:5,
    message:'Too many request from this IP. please try again later.'
})

//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use(cors())

app.use('/api/users',userRoute)
app.use(auth)
app.use('/api/students',studentRoute)

app.use((err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        return res.status(400).send(`Image Error: ${err.message} : ${err.code}`)
    }else if(err){
        return res.status(500).send(`Something went wrong: ${err.message}`)
    }
})

//
connectDB()

app.listen(3000,()=>{
    console.log('Server started!')
})