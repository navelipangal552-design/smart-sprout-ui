import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Droplets } from "lucide-react";
import { RegionSoilSelector } from "@/components/RegionSoilSelector";
import { WeatherPanel } from "@/components/WeatherPanel";
import { WateringRecommendation } from "@/components/WateringRecommendation";
import { PumpControl } from "@/components/PumpControl";
import { ActivityLog } from "@/components/ActivityLog";
import { ProfileSection } from "@/components/ProfileSection";

interface SoilType {
  id: string;
  name: string;
  description: string;
  image: string;
  wateringMultiplier: number;
}

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSoilType, setSelectedSoilType] = useState<SoilType | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // Mock weather data - in real app this would come from WeatherPanel
  const [mockWeather] = useState({
    rainForecast: Math.random() > 0.7,
    temperature: Math.floor(Math.random() * 15) + 25
  });

  const handleRegionSoilChange = (region: string, soilType: SoilType) => {
    setSelectedRegion(region);
    setSelectedSoilType(soilType);
  };

  // Calculate if watering should happen
  const shouldWater = selectedSoilType && !mockWeather.rainForecast;
  
  // Calculate recommended watering time
  const getRecommendedTime = () => {
    if (!selectedSoilType) return 0;
    let baseTime = 10 * selectedSoilType.wateringMultiplier;
    if (mockWeather.rainForecast) baseTime *= 0.3;
    else if (mockWeather.temperature > 35) baseTime *= 1.3;
    return Math.round(baseTime);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Smart Irrigation</h1>
                  <p className="text-sm text-muted-foreground">Organic Gardening Assistant</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Region & Soil Selection */}
            <RegionSoilSelector
              onSelectionChange={handleRegionSoilChange}
              selectedRegion={selectedRegion}
              selectedSoilType={selectedSoilType?.id}
            />

            {/* Weather & Recommendations Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherPanel region={selectedRegion} />
              <WateringRecommendation
                region={selectedRegion}
                soilType={selectedSoilType}
                weather={mockWeather}
              />
            </div>

            {/* Pump Control */}
            <PumpControl
              recommendedTime={getRecommendedTime()}
              shouldWater={shouldWater || false}
            />
          </div>

          {/* Right Column - Activity Log */}
          <div className="space-y-6">
            <ActivityLog />
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">System Status</h3>
              <p className="text-sm text-muted-foreground">
                {selectedRegion && selectedSoilType 
                  ? `Monitoring ${selectedRegion} region with ${selectedSoilType.name.toLowerCase()}`
                  : "Select region and soil type to start monitoring"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">System Active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <ProfileSection isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
};

export default Index;