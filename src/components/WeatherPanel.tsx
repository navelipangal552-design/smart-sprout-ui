import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Thermometer, Droplets, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  rainForecast: boolean;
  description: string;
  city: string;
  region: string;
}

interface WeatherPanelProps {
  region: string;
}

export const WeatherPanel = ({ region }: WeatherPanelProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real weather data fetch from backend API
  const fetchWeatherData = async (regionName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/weather/${regionName.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const weatherData = await response.json();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
      // Fallback to mock data if API fails
      setWeather(getMockWeatherData(regionName));
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback (for development or API failure)
  const getMockWeatherData = (regionName: string): WeatherData => {
    const conditions = ['sunny', 'cloudy', 'rainy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: Math.floor(Math.random() * 15) + 25,
      humidity: Math.floor(Math.random() * 30) + 50,
      condition: randomCondition,
      rainForecast: randomCondition === 'rainy',
      description: randomCondition === 'rainy' ? 'Light rain expected' : 'Clear skies',
      city: regionName.charAt(0).toUpperCase() + regionName.slice(1),
      region: regionName
    };
  };

  useEffect(() => {
    if (!region) return;
    fetchWeatherData(region);
  }, [region]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getConditionBadge = (condition: string, rainForecast: boolean) => {
    if (rainForecast) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">🌧️ Rain Expected</Badge>;
    }
    if (condition === "sunny") {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">☀️ Hot & Dry</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">☁️ Cloudy</Badge>;
  };

  const handleRefresh = () => {
    if (region) {
      fetchWeatherData(region);
    }
  };

  if (!region) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Weather Information
          </CardTitle>
          <CardDescription>Please select a region to view weather data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Weather in {region.charAt(0).toUpperCase() + region.slice(1)}
          </CardTitle>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <CardDescription>Live weather data for optimal irrigation planning</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ {error}. Showing sample data.
            </p>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Current Condition */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.condition)}
                <div>
                  <p className="text-2xl font-bold">{weather.temperature}°C</p>
                  <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                </div>
              </div>
              {getConditionBadge(weather.condition, weather.rainForecast)}
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-sm text-muted-foreground">{weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{weather.humidity}%</p>
                </div>
              </div>
            </div>

            {/* Rain Impact */}
            {weather.rainForecast && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  🌧️ Rain expected today - watering will be automatically reduced
                </p>
              </div>
            )}

            {/* Data Source Info */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              {error ? "Sample data" : "Live data from OpenWeatherMap"}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};