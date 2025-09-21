import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface WateringData {
  baseTime: number; // seconds
  weatherAdjustedTime: number; // seconds
  recommendation: "skip" | "light" | "moderate" | "heavy";
  reason: string;
  nextWatering: string;
}

interface WateringRecommendationProps {
  region: string;
  soilType: { wateringMultiplier: number; name: string } | null;
  weather: { rainForecast: boolean; temperature: number } | null;
}

export const WateringRecommendation = ({ region, soilType, weather }: WateringRecommendationProps) => {
  const [wateringData, setWateringData] = useState<WateringData | null>(null);

  useEffect(() => {
    if (!region || !soilType || !weather) {
      setWateringData(null);
      return;
    }

    // Calculate watering recommendation
    const baseTime = 10; // Base 10 seconds
    let adjustedTime = baseTime * soilType.wateringMultiplier;

    // Weather adjustments
    if (weather.rainForecast) {
      adjustedTime *= 0.3; // Reduce by 70% if rain expected
    } else if (weather.temperature > 35) {
      adjustedTime *= 1.3; // Increase by 30% for hot weather
    }

    // Determine recommendation level
    let recommendation: "skip" | "light" | "moderate" | "heavy";
    let reason = "";

    if (weather.rainForecast) {
      recommendation = "skip";
      reason = "Rain expected - skipping irrigation to prevent overwatering";
    } else if (adjustedTime <= 5) {
      recommendation = "light";
      reason = `Light watering for ${adjustedTime.toFixed(1)} seconds`;
    } else if (adjustedTime <= 12) {
      recommendation = "moderate";
      reason = `Moderate watering for ${adjustedTime.toFixed(1)} seconds`;
    } else {
      recommendation = "heavy";
      reason = `Extended watering for ${adjustedTime.toFixed(1)} seconds due to soil type and weather`;
    }

    setWateringData({
      baseTime,
      weatherAdjustedTime: Math.round(adjustedTime * 10) / 10,
      recommendation,
      reason,
      nextWatering: "Based on soil moisture sensor reading"
    });
  }, [region, soilType, weather]);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "skip": return "bg-green-100 text-green-800";
      case "light": return "bg-blue-100 text-blue-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "heavy": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressValue = (rec: string) => {
    switch (rec) {
      case "skip": return 0;
      case "light": return 25;
      case "moderate": return 60;
      case "heavy": return 100;
      default: return 0;
    }
  };

  if (!region || !soilType || !weather) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Watering Recommendation
          </CardTitle>
          <CardDescription>Select region, soil type, and wait for weather data to get recommendations</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          Watering Recommendation
        </CardTitle>
        <CardDescription>Personalized irrigation timing based on your soil and weather</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {wateringData && (
          <>
            {/* Main Recommendation */}
            <div className="text-center space-y-2">
              <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(wateringData.recommendation)}`}>
                {wateringData.recommendation.toUpperCase()} WATERING
              </Badge>
              <p className="text-sm text-muted-foreground">{wateringData.reason}</p>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Watering Intensity</span>
                <span>{wateringData.recommendation}</span>
              </div>
              <Progress value={getProgressValue(wateringData.recommendation)} className="h-2" />
            </div>

            {/* Timing Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {wateringData.recommendation === "skip" ? "0 seconds" : `${wateringData.weatherAdjustedTime}s`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Soil Factor</p>
                  <p className="text-sm text-muted-foreground">{soilType.name}</p>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
              <p className="font-medium">Calculation:</p>
              <p>Base time: {wateringData.baseTime}s</p>
              <p>Soil multiplier: {soilType.wateringMultiplier}x</p>
              {weather.rainForecast && <p>Rain reduction: -70%</p>}
              {weather.temperature > 35 && <p>Heat increase: +30%</p>}
              <p className="font-medium">Final: {wateringData.weatherAdjustedTime}s</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};