const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const shoppingListRoutes = require('./routes/shoppingList');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// pripojeni k mongodb
connectDB();

// nastaveni middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routy pro shopping listy
app.use('/shoppingList', shoppingListRoutes);

// error handler musi byt posledni
app.use(errorHandler);

// spusteni serveru
app.listen(PORT, () => {
  console.log(`Server bezi na portu ${PORT}`);
});

module.exports = app;

