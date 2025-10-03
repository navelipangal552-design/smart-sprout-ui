const { getWeatherData } = require('../utils/weatherAPI');

const getWeatherByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    
    // Validate region
    const validRegions = ['nagpur', 'amravati', 'yavatmal'];
    if (!validRegions.includes(region.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid region. Please use: nagpur, amravati, or yavatmal' 
      });
    }
    
    // Get weather data
    const weatherData = await getWeatherData(region);
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch weather data' });
  }
};

const getAllRegionsWeather = async (req, res) => {
  try {
    const regions = ['nagpur', 'amravati', 'yavatmal'];
    const weatherPromises = regions.map(region => getWeatherData(region));
    
    const weatherData = await Promise.all(weatherPromises);
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching all regions weather:', error);
    res.status(500).json({ message: 'Failed to fetch weather data for all regions' });
  }
};

module.exports = {
  getWeatherByRegion,
  getAllRegionsWeather
};