const mongoose = require('mongoose');

// Define the schema
const CountrySchema = mongoose.Schema({
    "Country": { type: String, required: true, unique: true },
    "Quality of Life": { type: Number, default: null },
    "Adventure": { type: Number, default: null },
    "Heritage": { type: Number, default: null },
    "Cost of Living Index": { type: Number, default: null },
    "Restaurant Price Index": { type: Number, default: null }
  },
  { versionKey: false });
const Country = mongoose.model('Country', CountrySchema);
module.exports = Country;
