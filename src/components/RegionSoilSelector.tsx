import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Layers } from "lucide-react";
import { useState } from "react";
import sandySoilImg from "@/assets/sandy-soil.jpg";
import claySoilImg from "@/assets/clay-soil.jpg";
import loamySoilImg from "@/assets/loamy-soil.jpg";

interface SoilType {
  id: string;
  name: string;
  description: string;
  image: string;
  wateringMultiplier: number;
}

interface Region {
  id: string;
  name: string;
  soilTypes: SoilType[];
}

const regions: Region[] = [
  {
    id: "nagpur",
    name: "Nagpur",
    soilTypes: [
      { id: "sandy", name: "Sandy Soil", description: "Drains quickly, needs frequent watering", image: sandySoilImg, wateringMultiplier: 1.5 },
      { id: "clay", name: "Clay Soil", description: "Retains water well, less frequent watering", image: claySoilImg, wateringMultiplier: 0.7 },
      { id: "loamy", name: "Loamy Soil", description: "Perfect balance, moderate watering", image: loamySoilImg, wateringMultiplier: 1.0 }
    ]
  },
  {
    id: "amravati",
    name: "Amravati", 
    soilTypes: [
      { id: "sandy", name: "Sandy Soil", description: "Drains quickly, needs frequent watering", image: sandySoilImg, wateringMultiplier: 1.5 },
      { id: "clay", name: "Clay Soil", description: "Retains water well, less frequent watering", image: claySoilImg, wateringMultiplier: 0.7 },
      { id: "loamy", name: "Loamy Soil", description: "Perfect balance, moderate watering", image: loamySoilImg, wateringMultiplier: 1.0 }
    ]
  },
  {
    id: "yavatmal",
    name: "Yavatmal",
    soilTypes: [
      { id: "sandy", name: "Sandy Soil", description: "Drains quickly, needs frequent watering", image: sandySoilImg, wateringMultiplier: 1.5 },
      { id: "clay", name: "Clay Soil", description: "Retains water well, less frequent watering", image: claySoilImg, wateringMultiplier: 0.7 },
      { id: "loamy", name: "Loamy Soil", description: "Perfect balance, moderate watering", image: loamySoilImg, wateringMultiplier: 1.0 }
    ]
  }
];

interface RegionSoilSelectorProps {
  onSelectionChange: (region: string, soilType: SoilType) => void;
  selectedRegion?: string;
  selectedSoilType?: string;
}

export const RegionSoilSelector = ({ onSelectionChange, selectedRegion, selectedSoilType }: RegionSoilSelectorProps) => {
  const [currentRegion, setCurrentRegion] = useState<string>(selectedRegion || "");

  const handleRegionSelect = (regionId: string) => {
    setCurrentRegion(regionId);
  };

  const handleSoilSelect = (soilType: SoilType) => {
    if (currentRegion) {
      onSelectionChange(currentRegion, soilType);
    }
  };

  const selectedRegionData = regions.find(r => r.id === currentRegion);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Region & Soil Selection
        </CardTitle>
        <CardDescription>Choose your farming region and soil type for personalized irrigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selection */}
        <div>
          <h3 className="text-sm font-medium mb-3">Select Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={currentRegion === region.id ? "default" : "outline"}
                onClick={() => handleRegionSelect(region.id)}
                className="h-auto p-4"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {region.name}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Soil Type Selection */}
        {selectedRegionData && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Select Soil Type for {selectedRegionData.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedRegionData.soilTypes.map((soil) => (
                <Card 
                  key={soil.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSoilType === soil.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSoilSelect(soil)}
                >
                  <CardContent className="p-4">
                    <img 
                      src={soil.image} 
                      alt={soil.name}
                      className="w-full h-24 object-cover rounded-md mb-3 bg-secondary"
                    />
                    <h4 className="font-medium text-sm">{soil.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{soil.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};