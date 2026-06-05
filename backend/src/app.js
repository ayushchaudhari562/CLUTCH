const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// Serve the 'uploads' directory statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Example of linking your routes
const feedRoutes = require('./routes/feed');
app.use('/api/feed', feedRoutes);
module.exports = app;