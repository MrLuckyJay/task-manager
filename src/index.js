const express = require('express')
require('./db/mongoose')

const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')
const multer = require('multer')



//configuration for port in both dev env and production
const port = process.env.PORT
const app = express()

app.use(express.json())
//crating custom routers
app.use(userRoute)
app.use(taskRoute)






//server listening
app.listen(port,()=>{
    console.log('server is running at '+port)
})


