const express = require('express');
const initTables = require('./scripts/initTables')
require('dotenv').config();

const app = express();
app.use(express.json());

initTables();



app.get('/', (req, res) => {
    res.send('Music Management APP')
});






const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Sever is running on ${port}`)
})