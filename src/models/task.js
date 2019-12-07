const mongoose = require('mongoose')
const validator = require('validator')

const taskModel = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        required:true,
        ref:'User'

        }
    
},{
        timestamps: true
})

const Task = mongoose.model('Task', taskModel)

module.exports = Task
