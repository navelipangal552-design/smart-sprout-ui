import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Settings, Save, MapPin } from "lucide-react";
import { useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  defaultRegion: string;
  moistureThreshold: number;
  notifications: boolean;
  gardenType: string;
}

interface ProfileSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSection = ({ isOpen, onClose }: ProfileSectionProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Organic Gardener",
    email: "gardener@example.com",
    defaultRegion: "nagpur",
    moistureThreshold: 60,
    notifications: true,
    gardenType: "organic"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    console.log("Profile saved:", profile);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Profile
          </CardTitle>
          <CardDescription>Manage your account and irrigation preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Irrigation Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Irrigation Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="region">Default Region</Label>
              <Select
                value={profile.defaultRegion}
                onValueChange={(value) => handleInputChange("defaultRegion", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nagpur">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Nagpur
                    </div>
                  </SelectItem>
                  <SelectItem value="amravati">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Amravati
                    </div>
                  </SelectItem>
                  <SelectItem value="yavatmal">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Yavatmal
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Soil Moisture Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min="30"
                max="80"
                value={profile.moistureThreshold}
                onChange={(e) => handleInputChange("moistureThreshold", parseInt(e.target.value))}
                disabled={!isEditing}
              />
              <p className="text-xs text-muted-foreground">
                Watering will trigger when soil moisture drops below this level
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="garden-type">Garden Type</Label>
              <Select
                value={profile.gardenType}
                onValueChange={(value) => handleInputChange("gardenType", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organic">🌱 Organic Garden</SelectItem>
                  <SelectItem value="vegetable">🥕 Vegetable Garden</SelectItem>
                  <SelectItem value="flower">🌸 Flower Garden</SelectItem>
                  <SelectItem value="herbs">🌿 Herb Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium">Garden Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-800">Total Waterings</p>
                <p className="text-2xl font-bold text-green-900">47</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-800">Water Saved</p>
                <p className="text-2xl font-bold text-blue-900">23L</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline"
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};