const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,


    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error('enter a valid Email')
            }
        },

    }, password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password should not contain the phrase password')
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new error('Age value must be a positive number')
            }
        }

    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }],avatar:{
        type:Buffer
    }
},{
    timestamps:true
})



userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//generate jwt


userSchema.methods.generateAuthToken = async function (){
    const user = this
    const JWT_SECRET = process.env.JWT_SECRET

    const token = jwt.sign({_id: user._id.toString()},JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//hide sensitive data

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//create a virtual link between user and task

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//hash the plain text password
userSchema.pre('save', async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

//remove user task when user is deleted

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User',userSchema)


module.exports = User