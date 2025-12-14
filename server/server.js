const express = require('express');
const cors = require('cors');
require('dotenv').config();

const shoppingListRoutes = require('./routes/shoppingList');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Nastavení middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routy pro shopping listy
app.use('/shoppingList', shoppingListRoutes);

// Error handler musí být poslední, aby zachytil všechny chyby
app.use(errorHandler);

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

module.exports = app;

