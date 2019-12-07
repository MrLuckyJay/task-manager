const mongoose = require('mongoose')
const validator = require('validator')

const url = process.env.MONGODB_URL

const conn = mongoose.connect(url,{
useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology: true,
useFindAndModify:false
})





// 

// const myTask = new Task({
//     description:'Recieve product from alie express',
    
// })

// myTask.save().then(()=>{
//     console.log(myTask)
// }).catch((error)=>{
//     console.log(error)
// })


