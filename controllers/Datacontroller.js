const fs = require('fs');
const Country = require('../models/countryModel');

var data = fs.readFileSync(`${__dirname}/../data/Merged_Country_Data.json`, 'utf-8');
const countries = JSON.parse(data);

// Function to store data in MongoDB
const storeDataInDB = async () => {
  try {
    await Country.deleteMany(); // Clear existing data
    await Country.insertMany(countries);
    console.log('Data successfully stored in MongoDB');
  } catch (err) {
    console.error(err);
  }
};

module.exports = { storeDataInDB };