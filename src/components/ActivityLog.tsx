import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Droplets, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityEntry {
  id: string;
  timestamp: Date;
  action: "watered" | "skipped" | "manual";
  duration: number; // seconds
  reason: string;
  moistureLevel: number;
  weather: string;
}

export const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  // Initialize with some sample data
  useEffect(() => {
    const sampleActivities: ActivityEntry[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        action: "watered",
        duration: 12,
        reason: "Low soil moisture + hot weather",
        moistureLevel: 35,
        weather: "sunny"
      },
      {
        id: "2", 
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        action: "skipped",
        duration: 0,
        reason: "Rain forecast detected",
        moistureLevel: 65,
        weather: "rainy"
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        action: "manual",
        duration: 15,
        reason: "Manual override by user",
        moistureLevel: 40,
        weather: "cloudy"
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        action: "watered",
        duration: 8,
        reason: "Scheduled watering - moderate soil moisture",
        moistureLevel: 45,
        weather: "sunny"
      }
    ];
    setActivities(sampleActivities);
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "watered":
        return <Badge className="bg-blue-100 text-blue-800">💧 Watered</Badge>;
      case "skipped":
        return <Badge className="bg-green-100 text-green-800">⏭️ Skipped</Badge>;
      case "manual":
        return <Badge className="bg-purple-100 text-purple-800">👤 Manual</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "sunny": return "☀️";
      case "rainy": return "🌧️";
      case "cloudy": return "☁️";
      default: return "🌤️";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Activity Log
        </CardTitle>
        <CardDescription>Recent irrigation history and system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  {getActionBadge(activity.action)}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(activity.timestamp)}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">{activity.reason}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">Moisture:</span>
                      <span className="font-medium">{activity.moistureLevel}%</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{activity.duration}s</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span>{getWeatherIcon(activity.weather)}</span>
                      <span className="text-muted-foreground">Weather:</span>
                      <span className="font-medium capitalize">{activity.weather}</span>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {activity.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No activity recorded yet</p>
            <p className="text-sm">Irrigation history will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};