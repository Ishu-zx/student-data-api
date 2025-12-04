const express = require('express')
const router = express.Router()
const Students = require('../models/students.model')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        const newFileName = Date.now() + path.extname(file.originalname)
        cb(null,newFileName)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new Error('Only images are allowed.'),false)
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize:1024*1024*5
    }
})


//get students
router.get('/',async (req,res)=>{
    try {
        
        const limit = req.query.limit || 3
        const currentPage = req.query.page || 1
        const skip = (currentPage-1)*limit
        
        const search = req.query.search || ''
        const query={
            $or:[
                {first_name: {$regex: search, $options: 'i'}},
                {last_name: {$regex: search, $options: 'i'}},
                //{full_name:{$regex:{$concat:['$first_name',' ','$last_name']},$options:'i'}}
            ]
        }
        const totalRecord = await Students.countDocuments(query)
        const totalPages = Math.ceil(totalRecord/limit)
        
        const students =await Students.find(query).skip(skip).limit(limit)
        res.status(200).json({
            limit,
            currentPage,
            totalPages,
            students
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//get student
router.get('/:id',async (req,res)=>{
    try {
        const student =await Students.findById(req.params.id)
        if(student){
            res.status(200).json(student)
        }else{
            res.status(404).json({message:'Student not Found!'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
})

//add new student
router.post('/',upload.single('profile_pic'),async (req,res)=>{
    try {
        //const student = await Students.create(req.body)
        const student = await new Students(req.body)
        if(req.file.filename){
            student.profile_pic = req.file.filename
        }
        const newStudent = await student.save()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//update student
router.put('/:id',upload.single('profile_pic'),async (req,res)=>{
    try {

        const existingStudent = await Students.findById(req.params.id)
        if(!existingStudent){
            const filePath = path.join('./uploads',req.file.filename)
            fs.unlink(filePath,(err)=>{console.log(err)})
            return res.status(404).json({message:'Student not found!'})
        }
        if(req.file){
            if(existingStudent.profile_pic){
                const filePath = path.join('./uploads',existingStudent.profile_pic)
                fs.unlink(filePath,(err)=>{console.log(err)})
            }
            req.body.profile_pic=req.file.filename
        }

        const student = await Students.findByIdAndUpdate(req.params.id,req.body,{new:true})
        
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

//delete student
router.delete('/:id',async (req,res)=>{
    try {
        const student = await Students.findByIdAndDelete(req.params.id)
        const filePath = path.join('./uploads',student.profile_pic)
        fs.unlink(filePath,(err)=>{console.log(err)})
        if(student){
            res.status(200).json({message:'Student Deleted.'})
        }else{
            res.status(404).json({message:'Student not found!'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router