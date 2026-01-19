require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const freeRoutes = require('./routes/free');
const calendarRoutes = require('./routes/calendar');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/free', freeRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API!');
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`)
})