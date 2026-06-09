const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app.use('/api/feed', feedRoutes);
app.use('/api', authRoutes);

module.exports = app;