const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: 'config.env' });
const { storeDataInDB } = require('./controllers/Datacontroller');

// Connect to the database
connectDB();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'view')));

//routes
const countryRoutes = require('./routes/CountryRoutes'); 
app.use('/api/countries', countryRoutes); 


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  storeDataInDB(); 
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});