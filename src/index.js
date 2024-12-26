const express = require('express');
const initTables = require('./scripts/initTables')
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

initTables();

const BASE_URL = '/api/v1'
app.use(BASE_URL, authRoutes);
app.use(`${BASE_URL}/users`, userRoutes);
app.use(`${BASE_URL}/artists`, artistRoutes);
app.use(`${BASE_URL}/albums`, albumRoutes);


app.get('/', (req, res) => {
    res.send('Music Management APP')
});






const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Sever is running on ${port}`)
})