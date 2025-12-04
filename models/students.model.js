const mongoose = require('mongoose')

const studentsSchema = mongoose.Schema({
    first_name:{
        type:String,
        require:true,
    },
    last_name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
        enum:['Male','Female','Other']
    },
    profile_pic:{
        type:String,
    }
})

const Students = mongoose.model('Students',studentsSchema)

module.exports = Students