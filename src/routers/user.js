const express = require('express')
const app = new express.Router()
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')
const sharp = require('sharp')


const User = require('../models/user')


const auth = require('../middleWare/auth')

//create single user route

app.post('/users',async (req, res) => {
    
    const user = new User(req.body)
    

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }



})

//get users route
app.get('/users/me', auth,async (req, res) => {

    try {
        //  await User.find({})
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(2)
    }

})

//logout
app.post('/users/logout',auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
        
    }
})

//logout all users

app.post('/usere/logoutAll',auth, async(req, res)=>{

    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})


//logging the use in

app.post('/users/login',async (req,res)=>{
    try {
       const user = await User.findByCredentials(req.body.email,req.body.password) 
       const token = await user.generateAuthToken()
       res.send({user,token})
    } catch (e) {
        
        res.status(400).send(e)
    
    }
})

//update user route
app.patch('/users/me', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isvalid = updates.every((update) => allowedUpdates.includes(update))
    if (!isvalid) {
        return res.status(400).send({ error: ' Invalid Updates !' })
    }
    try {
 
        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//creating the upload url
const upload = multer({
    limits:{
        fileSize:3000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an image File'))
        }

        cb(undefined, true)

    }
})
app.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
    console.log('upload Complete')
}, (error, req, res, next) => {
    res.status(400).send({ 'error': error.message })

})


//delete user profile

app.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


//server user profile

app.get('/users/:id/avatar',async(req,res)=>{
    try{

        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch (e){
        res.status(404).send(e)
    }
})

//delete route for users

app.delete('/users/me',auth, async (req, res) => {
    try {
        //
        await req.user.remove() 
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {

        res.status(500).send(e)

    }
})

module.exports = app

