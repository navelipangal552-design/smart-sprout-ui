import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Power, Gauge, Droplets, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";

interface SensorData {
  moistureLevel: number; // 0-100%
  threshold: number; // 0-100%
  temperature: number;
  lastReading: string;
}

interface PumpStatus {
  isRunning: boolean;
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  mode: "auto" | "manual";
}

interface PumpControlProps {
  recommendedTime: number;
  shouldWater: boolean;
}

export const PumpControl = ({ recommendedTime, shouldWater }: PumpControlProps) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    moistureLevel: 45,
    threshold: 60,
    temperature: 28,
    lastReading: new Date().toLocaleTimeString()
  });

  const [pumpStatus, setPumpStatus] = useState<PumpStatus>({
    isRunning: false,
    timeRemaining: 0,
    totalTime: 0,
    mode: "auto"
  });

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        moistureLevel: Math.max(0, Math.min(100, prev.moistureLevel + (Math.random() - 0.5) * 5)),
        temperature: Math.max(20, Math.min(40, prev.temperature + (Math.random() - 0.5) * 2)),
        lastReading: new Date().toLocaleTimeString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update pump countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pumpStatus.isRunning && pumpStatus.timeRemaining > 0) {
      interval = setInterval(() => {
        setPumpStatus(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            return { ...prev, isRunning: false, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pumpStatus.isRunning, pumpStatus.timeRemaining]);

  const handleManualWatering = () => {
    if (pumpStatus.isRunning) {
      // Stop watering
      setPumpStatus(prev => ({ ...prev, isRunning: false, timeRemaining: 0 }));
    } else {
      // Start manual watering
      const wateringTime = recommendedTime || 10;
      setPumpStatus({
        isRunning: true,
        timeRemaining: wateringTime,
        totalTime: wateringTime,
        mode: "manual"
      });
    }
  };

  const needsWatering = sensorData.moistureLevel < sensorData.threshold;
  const moistureStatus = needsWatering ? "low" : "adequate";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          Pump Control & Sensors
        </CardTitle>
        <CardDescription>Real-time monitoring and irrigation control</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sensor Readings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Soil Moisture</h3>
            <Badge variant={moistureStatus === "low" ? "destructive" : "secondary"}>
              {moistureStatus === "low" ? "Needs Water" : "Adequate"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Level</span>
              <span>{sensorData.moistureLevel.toFixed(1)}%</span>
            </div>
            <Progress 
              value={sensorData.moistureLevel} 
              className={`h-3 ${sensorData.moistureLevel < sensorData.threshold ? 'bg-red-100' : 'bg-green-100'}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dry (0%)</span>
              <span className="text-primary">Threshold: {sensorData.threshold}%</span>
              <span>Wet (100%)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Soil Temperature</p>
              <p className="font-medium">{sensorData.temperature.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Reading</p>
              <p className="font-medium">{sensorData.lastReading}</p>
            </div>
          </div>
        </div>

        {/* Pump Status */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Power className="h-4 w-4" />
              Pump Status
            </h3>
            <Badge variant={pumpStatus.isRunning ? "default" : "secondary"}>
              {pumpStatus.isRunning ? "RUNNING" : "IDLE"}
            </Badge>
          </div>

          {pumpStatus.isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time Remaining</span>
                <span>{pumpStatus.timeRemaining}s</span>
              </div>
              <Progress 
                value={(pumpStatus.timeRemaining / pumpStatus.totalTime) * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Auto Watering Status */}
          {needsWatering && shouldWater && !pumpStatus.isRunning && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Auto watering will start based on recommendation ({recommendedTime}s)
              </p>
            </div>
          )}

          {!needsWatering && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Soil moisture adequate - no watering needed
              </p>
            </div>
          )}
        </div>

        {/* Manual Control */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Manual Override</h3>
          <Button 
            onClick={handleManualWatering}
            variant={pumpStatus.isRunning ? "destructive" : "default"}
            className="w-full"
            size="lg"
          >
            {pumpStatus.isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Watering
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Manual Watering ({recommendedTime || 10}s)
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Manual override will water for the recommended duration
          </p>
        </div>
      </CardContent>
    </Card>
  );
};