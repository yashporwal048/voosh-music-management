const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log('Connected to Mongoose!'))
.catch((error) => console.log('Error Connecting to Mongooose' + error))


app.get('/', (req, res) => {
    res.send('Music Management APP')
});


const PORT = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Sever is running on ${PORT}`)
})