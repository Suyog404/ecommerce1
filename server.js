require('dotenv').config()
const express =require ('express')
const mongoose=require('mongoose')
const cors =require('cors')
const fileUpload = require('express-fileupload')
const cookieParser=require ('cookie-parser')
const morgan = require('morgan')



const app=express ()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))

//Routes

app.use('/user',require('./routes/userRouter'))
app.use('/api',require('./routes/categoryRouter'))
app.use('/api',require('./routes/upload'))
app.use('/api',require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))



//load third-party middleware
app.use(morgan('dev'))

//Connect to MongoDb
const URI = process.env.MONGODB_URL
mongoose.connect(URI,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology:true,
}, err=>{
    if(err) throw err;
    console.log('Connected to MongoDb')
})
app.use(function (req, res, next) { //for undefined request
    next({
        msg: 'NOT FOUND 404',
        status: 404
    })
})


// Test
const PORT =process.env.PORT || 5000
app.listen(PORT,()=> {
    console.log('Server is running on port',PORT)
})