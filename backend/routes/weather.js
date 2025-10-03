const express = require('express');
const router = express.Router();
const { getWeatherByRegion, getAllRegionsWeather } = require('../controllers/weatherController');

// GET /api/weather/:region - Get weather for specific region
router.get('/:region', getWeatherByRegion);

// GET /api/weather - Get weather for all regions
router.get('/', getAllRegionsWeather);

module.exports = router;