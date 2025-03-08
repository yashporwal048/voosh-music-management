import express from 'express';
import initTables from './scripts/initTables.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import './listeners/favoriteListener.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

initTables();

const BASE_URL = '/api/v1';
app.use(BASE_URL, authRoutes);
app.use(`${BASE_URL}/users`, userRoutes);
app.use(`${BASE_URL}/artists`, artistRoutes);
app.use(`${BASE_URL}/albums`, albumRoutes);
app.use(`${BASE_URL}/tracks`, trackRoutes);
app.use(`${BASE_URL}/favorites`, favoritesRoutes);

app.get('/', (req, res) => {
    res.send('Music Management APP');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
