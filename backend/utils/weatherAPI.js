const { weatherAPI, REGION_COORDINATES } = require('../config/openweather');

const getWeatherData = async (region) => {
  try {
    const coordinates = REGION_COORDINATES[region.toLowerCase()];
    
    if (!coordinates) {
      throw new Error(`Region ${region} not found`);
    }

    const response = await weatherAPI.get('/weather', {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon
      }
    });
    
    // Process the data to match your frontend needs
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main.toLowerCase(),
      description: response.data.weather[0].description,
      rainForecast: response.data.rain ? true : false,
      city: response.data.name,
      region: region
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    // Fallback to mock data if API fails (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock weather data for development');
      return getMockWeatherData(region);
    }
    
    throw new Error('Failed to fetch weather data');
  }
};

// Mock data for development (remove in production)
const getMockWeatherData = (region) => {
  const conditions = ['sunny', 'cloudy', 'rainy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    condition: randomCondition,
    description: randomCondition === 'rainy' ? 'Light rain expected' : 'Clear skies',
    rainForecast: randomCondition === 'rainy',
    city: region.charAt(0).toUpperCase() + region.slice(1),
    region: region
  };
};

module.exports = { getWeatherData };