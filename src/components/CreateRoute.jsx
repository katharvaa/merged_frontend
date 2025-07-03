import React, { useState } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Plus } from 'lucide-react';

const CreateRoute = ({ onBack, onSuccess }) => {
  const { zones, createRoute } = usePickup();
  const [zoneId, setZoneId] = useState('');
  const [routeName, setRouteName] = useState('');
  const [pathDetails, setPathDetails] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!zoneId || !routeName || !pathDetails || !estimatedTime) {
      toast.error('Please fill in all fields.');
      return;
    }

    const timeRegex = /^\d+\s*(hour|hours|minute|minutes)$/i;
    if (!timeRegex.test(estimatedTime.trim())) {
      toast.error('Estimated time must be in format "X hours" or "X minutes".');
      return;
    }

    const newRoute = createRoute({
      zoneId,
      name: routeName,
      pathDetails,
      estimatedTime,
    });

    if (newRoute?.id && newRoute?.name) {
      toast.success(`Route ${newRoute.id} - "${newRoute.name}" created successfully!`);
    } else {
      toast.success('Route created successfully!');
    }

    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4"
    >
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="mb-4 flex items-center text-green-600 hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Route Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-6 w-6" />
            <span>Create New Route</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Zone Selection */}
            <div className="space-y-2">
              <Label htmlFor="zoneId">Zone ID</Label>
              <Select value={zoneId} onValueChange={setZoneId}>
                <SelectTrigger className="w-full" disabled={zones.length === 0}>
                  <SelectValue placeholder={zones.length === 0 ? 'No zones available' : 'Select a Zone'} />
                </SelectTrigger>
                <SelectContent>
                  {zones.length === 0 ? (
                    <SelectItem value="" disabled>No zones available</SelectItem>
                  ) : (
                    zones.map((zone) => (
                      <SelectItem key={zone.id} value={String(zone.id)}>
                        {zone.id} - {zone.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Route Name */}
            <div className="space-y-2">
              <Label htmlFor="routeName">Route Name</Label>
              <Input
                id="routeName"
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g., North Residential Loop"
                required
              />
            </div>

            {/* Path Details */}
            <div className="space-y-2">
              <Label htmlFor="pathDetails">Path Details (comma-separated)</Label>
              <Input
                id="pathDetails"
                type="text"
                value={pathDetails}
                onChange={(e) => setPathDetails(e.target.value)}
                placeholder="e.g., Main St, Oak Ave, Elm St"
                required
              />
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (e.g., 2 hours, 30 minutes)</Label>
              <Input
                id="estimatedTime"
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 2 hours, 30 minutes"
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Create Route
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateRoute;