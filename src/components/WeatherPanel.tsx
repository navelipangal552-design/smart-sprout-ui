import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Thermometer, Droplets } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  rainForecast: boolean;
  description: string;
}

interface WeatherPanelProps {
  region: string;
}

export const WeatherPanel = ({ region }: WeatherPanelProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock weather data fetch - in real app, this would call OpenWeatherMap API
  useEffect(() => {
    if (!region) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
        humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
        condition: Math.random() > 0.5 ? "sunny" : "rainy",
        rainForecast: Math.random() > 0.6,
        description: Math.random() > 0.5 ? "Clear skies expected" : "Light rain possible"
      };
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);
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
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Weather in {region.charAt(0).toUpperCase() + region.slice(1)}
        </CardTitle>
        <CardDescription>Live weather data for optimal irrigation planning</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Current Condition */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.condition)}
                <div>
                  <p className="text-2xl font-bold">{weather.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">{weather.description}</p>
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
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};