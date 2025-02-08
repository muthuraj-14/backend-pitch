const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const postRoutes = require('./routes/posts')
const categoryRoutes = require('./routes/categories')

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "50mb" })); // Allow larger JSON payloads
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Allow larger form data

//Middeleware
app.use(bodyParser.json());
app.use(cors());
//Connect to MongoDB
mongoose.connect('mongodb://localHost:27017/post')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log("DB error" , err));


// app.get('/',(req,res)=>{
//     res.send("Helloworld")

// })
app.use('/api/posts',postRoutes);
app.use('/api/categories',categoryRoutes);


app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`);
})