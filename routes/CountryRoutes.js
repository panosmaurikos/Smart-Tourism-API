const express = require('express');
const router = express.Router();
const countryController = require('../controllers/CountryController');

router.get('/', countryController.getAllCountries); // Get all countries
router.get('/filter', countryController.filterCountries); // Get filtered countries
router.get('/:id', countryController.getCountry); // Get country by id for update
router.post('/', countryController.createCountry); // Create new country
router.put('/:id', countryController.updateCountry); // Update country
router.delete('/:id', countryController.deleteCountry); // Delete country

module.exports = router;