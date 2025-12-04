const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect('mongodb+srv://ishu_zx:chucha46024@todo-list.n9rypz4.mongodb.net/?appName=Todo-list')
    .then(()=>{console.log('MongoDb connected!')})
}

module.exports = connectDB