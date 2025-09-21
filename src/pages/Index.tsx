import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Droplets, 
  MapPin, 
  Sun, 
  CloudRain, 
  Power, 
  Play, 
  Square,
  Thermometer,
  Gauge,
  Container,
  AlertTriangle
} from "lucide-react";
import sandySoilImg from "@/assets/sandy-soil.jpg";
import claySoilImg from "@/assets/clay-soil.jpg";
import loamySoilImg from "@/assets/loamy-soil.jpg";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [selectedSoil, setSelectedSoil] = useState("");
  const [pumpRunning, setPumpRunning] = useState(false);
  const [wateringTime, setWateringTime] = useState(0);
  const [moistureLevel] = useState(45);
  const [temperature] = useState(32);
  const [humidity] = useState(65);
  const [rainExpected] = useState(false);
  const [tankLevel] = useState(75); // Tank water level percentage
  const [lastTankAlert, setLastTankAlert] = useState<string | null>(null);
  
  const { toast } = useToast();

  const defaultRegions = ["Nagpur", "Amravati", "Yavatmal"];
  const soilTypes = [
    { name: "Sandy", img: sandySoilImg, time: 15 },
    { name: "Clay", img: claySoilImg, time: 7 },
    { name: "Loamy", img: loamySoilImg, time: 10 }
  ];

  // Tank monitoring alerts
  useEffect(() => {
    const currentAlert = tankLevel <= 20 ? 'empty' : tankLevel >= 95 ? 'full' : null;
    
    if (currentAlert && currentAlert !== lastTankAlert) {
      setLastTankAlert(currentAlert);
      
      if (currentAlert === 'empty') {
        toast({
          title: "⚠️ Tank Empty",
          description: "Water tank level is critically low. Please refill the tank.",
          variant: "destructive",
        });
      } else if (currentAlert === 'full') {
        toast({
          title: "✅ Tank Full", 
          description: "Water tank is full and ready for irrigation.",
        });
      }
    } else if (!currentAlert) {
      setLastTankAlert(null);
    }
  }, [tankLevel, lastTankAlert, toast]);

  const calculateWateringTime = () => {
    const soil = soilTypes.find(s => s.name === selectedSoil);
    if (!soil) return 0;
    
    let time = soil.time;
    if (rainExpected) time = Math.round(time * 0.3);
    if (temperature > 35) time = Math.round(time * 1.3);
    
    return time;
  };

  const startWatering = () => {
    const time = calculateWateringTime();
    setWateringTime(time);
    setPumpRunning(true);
    
    setTimeout(() => {
      setPumpRunning(false);
      setWateringTime(0);
    }, time * 1000);
  };

  const stopWatering = () => {
    setPumpRunning(false);
    setWateringTime(0);
  };

  const needsWater = moistureLevel < 60;
  const recommendedTime = calculateWateringTime();

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplets className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Smart Irrigation</h1>
        </div>
        <p className="text-muted-foreground">Simple organic garden watering</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step 1: Select Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              1. Choose Your Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {defaultRegions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region)}
                  className="h-12"
                >
                  {region}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or enter custom region:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter region name"
                  value={customRegion}
                  onChange={(e) => setCustomRegion(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => {
                    if (customRegion.trim()) {
                      setSelectedRegion(customRegion.trim());
                      setCustomRegion("");
                    }
                  }}
                  disabled={!customRegion.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Select Soil Type */}
        {selectedRegion && (
          <Card>
            <CardHeader>
              <CardTitle>2. Choose Your Soil Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {soilTypes.map((soil) => (
                  <div
                    key={soil.name}
                    className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:shadow-md ${
                      selectedSoil === soil.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedSoil(soil.name)}
                  >
                    <img 
                      src={soil.img} 
                      alt={soil.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <h3 className="font-medium">{soil.name} Soil</h3>
                    <p className="text-sm text-muted-foreground">{soil.time}s watering</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tank Status & Weather & Soil Status */}
        {selectedRegion && selectedSoil && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tank Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5" />
                  Tank Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Water Level</span>
                    <Badge variant={tankLevel <= 20 ? "destructive" : tankLevel >= 95 ? "default" : "secondary"}>
                      {tankLevel <= 20 ? "Tank Empty ⚠️" : tankLevel >= 95 ? "Tank Full ✅" : "Normal"}
                    </Badge>
                  </div>
                  <Progress value={tankLevel} className="h-3" />
                  <div className="text-center">
                    <span className="text-2xl font-bold">{tankLevel}%</span>
                  </div>
                  {tankLevel <= 20 && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Please refill tank</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {rainExpected ? <CloudRain className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                  Weather in {selectedRegion}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span>Temperature</span>
                    </div>
                    <span className="font-medium">{temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Humidity</span>
                    </div>
                    <span className="font-medium">{humidity}%</span>
                  </div>
                  {rainExpected && (
                    <Badge className="bg-blue-100 text-blue-800">🌧️ Rain Expected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Soil Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Soil Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Moisture Level</span>
                    <Badge variant={needsWater ? "destructive" : "secondary"}>
                      {needsWater ? "Needs Water" : "Good"}
                    </Badge>
                  </div>
                  <Progress value={moistureLevel} className="h-3" />
                  <div className="text-center">
                    <span className="text-2xl font-bold">{moistureLevel}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pump Control */}
        {selectedRegion && selectedSoil && tankLevel > 20 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5" />
                Irrigation Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {/* Recommendation */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Recommendation</h3>
                  <p className="text-2xl font-bold text-primary">
                    {rainExpected ? "Skip watering" : `Water for ${recommendedTime} seconds`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rainExpected ? "Rain will provide enough water" : 
                     `Based on ${selectedSoil.toLowerCase()} soil in ${selectedRegion}`}
                  </p>
                </div>

                {/* Pump Status */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className={`h-4 w-4 rounded-full ${pumpRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">
                    {pumpRunning ? `Watering... ${wateringTime}s remaining` : "Pump Ready"}
                  </span>
                </div>

                {/* Control Button */}
                <Button
                  size="lg"
                  onClick={pumpRunning ? stopWatering : startWatering}
                  variant={pumpRunning ? "destructive" : "default"}
                  className="w-full"
                  disabled={rainExpected && !needsWater}
                >
                  {pumpRunning ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Watering
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Watering ({recommendedTime}s)
                    </>
                  )}
                </Button>

                {rainExpected && !needsWater && (
                  <p className="text-sm text-muted-foreground">
                    Watering disabled - rain expected and soil moisture is adequate
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tank Empty Warning */}
        {selectedRegion && selectedSoil && tankLevel <= 20 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Tank Empty - Cannot Water
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <p className="text-destructive">Water tank level is too low ({tankLevel}%)</p>
                <p className="text-sm text-muted-foreground">Please refill the tank before starting irrigation</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;