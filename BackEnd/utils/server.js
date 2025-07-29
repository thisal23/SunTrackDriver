// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('../config/db');
const authRoutes = require('../controllers/authController');
const maintenanceRoutes = require('../routes/maintenanceRoutes');
const tripsRoutes = require('../routes/trips');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/driver-trips', tripsRoutes);

app.get('/', (req, res) => {
    res.send('Hello from updated API (server.js)!');
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
