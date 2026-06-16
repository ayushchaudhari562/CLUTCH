const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const collegeRoutes = require('./routes/college');
const commentRoutes = require('./routes/comments');
const swapRoutes = require('./routes/swapRoutes');

app.use('/api/feed', feedRoutes);
app.use('/api', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/swaps', swapRoutes);

module.exports = app;