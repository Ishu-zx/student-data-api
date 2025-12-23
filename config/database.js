const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect('mongodb+srv://ishu_zx:chucha46024@student-data.bjw1yve.mongodb.net/?appName=Student-data')
    .then(()=>{console.log('MongoDb connected!')})
}

module.exports = connectDB