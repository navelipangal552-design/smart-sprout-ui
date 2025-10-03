const axios = require('axios');

// Maharashtra region coordinates
const REGION_COORDINATES = {
  'nagpur': { lat: 21.1458, lon: 79.0882 },
  'amravati': { lat: 20.9374, lon: 77.7796 },
  'yavatmal': { lat: 20.3888, lon: 78.1204 }
};

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherAPI = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
  params: {
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric' // Get temperature in Celsius
  }
});

module.exports = { weatherAPI, REGION_COORDINATES };