
const Country = require('../models/countryModel');

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get countries by criterion
exports.filterCountries = async (req, res) => {
  try {
    const { criterion, type, limit } = req.query;
    const allowedCriteria = ['Quality of Life', 'Adventure', 'Heritage', 'Cost of Living Index', 'Restaurant Price Index'];
    
    if (!allowedCriteria.includes(criterion)) {
      return res.status(400).json({ error: 'Criterion problem' });
    }
    if (type !== 'lowest' && type !== 'highest') {
      return res.status(400).json({ error: 'Type problem' });
    }

    const sortOrder = type === 'lowest' ? 1 : -1;
    let query = Country.find({ [criterion]: { $ne: null } }).sort({ [criterion]: sortOrder });
    if (limit) query = query.limit(parseInt(limit));
    
    const countries = await query;
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new country
exports.createCountry = async (req, res) => {
  try {
    const countryData = req.body;
    
    const country = new Country({
      Country: countryData.Country,
      "Quality of Life": countryData["Quality of Life"],
      Adventure: countryData.Adventure,
      Heritage: countryData.Heritage,
      "Cost of Living Index": countryData["Cost of Living Index"],
      "Restaurant Price Index": countryData["Restaurant Price Index"]
    });

    await country.save();
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a country by id
exports.getCountry = async (req, res) => {
  try {
      const country = await Country.findById(req.params.id);
      if (!country) {
          return res.status(404).json({ error: 'Country not found' });
      }
      res.json(country);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Update a country
exports.updateCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!country) return res.status(404).json({ error: 'It is not exist' });
    res.json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a country
exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country is not exist' });
    res.json({ message: 'Country deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};