import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Route, MapPin, Clock } from 'lucide-react';

const UpdateRoute = ({ onBack, onSuccess, initialRouteId = null }) => {
  const { routes, zones, updateRoute } = usePickup();
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId);
  const [routeName, setRouteName] = useState('');
  const [pathDetails, setPathDetails] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [originalRoute, setOriginalRoute] = useState(null);

  useEffect(() => {
    if (selectedRouteId) {
      const routeToUpdate = routes.find(route => route.id === selectedRouteId);
      if (routeToUpdate) {
        setRouteName(routeToUpdate.name);
        setPathDetails(routeToUpdate.pathDetails);
        setEstimatedTime(routeToUpdate.estimatedTime);
        setOriginalRoute(routeToUpdate);
      } else {
        setRouteName('');
        setPathDetails('');
        setEstimatedTime('');
        setOriginalRoute(null);
        toast.error('Selected Route ID not found.');
      }
    } else {
      setRouteName('');
      setPathDetails('');
      setEstimatedTime('');
      setOriginalRoute(null);
    }
  }, [selectedRouteId, routes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRouteId) {
      toast.error('Please select a Route ID to update.');
      return;
    }

    if (!routeName || !pathDetails || !estimatedTime) {
      toast.error('Please fill in all fields.');
      return;
    }

    const timeRegex = /^(\d+)\s*(hour|minute)s?$/i;
    if (!timeRegex.test(estimatedTime)) {
      toast.error('Estimated time must be in format "X hours" or "X minutes".');
      return;
    }

    if (originalRoute && 
        originalRoute.name === routeName && 
        originalRoute.pathDetails === pathDetails &&
        originalRoute.estimatedTime === estimatedTime) {
      toast.info('No changes were made to the route.');
      onSuccess();
      return;
    }

    updateRoute(selectedRouteId, {
      name: routeName,
      pathDetails,
      estimatedTime,
    });

    toast.success(`Route details for ${selectedRouteId} - "${routeName}" successfully updated!`);
    onSuccess();
  };

  const getZoneNameById = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'N/A';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4"
    >
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4 flex items-center text-green-600 hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Route Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-6 w-6" />
            <span>Update Route</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y for form sections */}
            <div className="space-y-2"> {/* Added space-y-2 for label and input */}
              <Label htmlFor="routeId">Route ID</Label>
              <Select
                value={selectedRouteId}
                onValueChange={setSelectedRouteId}
                disabled={!!initialRouteId} // Disable if initialRouteId is provided (from table action button)
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Route ID" />
                </SelectTrigger>
                <SelectContent>
                  {routes.length === 0 ? (
                    <SelectItem value="" disabled>No routes available</SelectItem>
                  ) : (
                    routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.id} - {route.name} (Zone: {route.zoneId})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedRouteId && originalRoute && (
              <div className="space-y-2"> {/* Added space-y-2 for label and input */}
                <Label htmlFor="zoneIdDisplay">Zone ID</Label>
                <Input
                  id="zoneIdDisplay"
                  type="text"
                  value={`${originalRoute.zoneId} - "${getZoneNameById(originalRoute.zoneId)}"`}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700"
                />
              </div>
            )}

            <div className="space-y-2"> {/* Added space-y-2 for label and input */}
              <Label htmlFor="routeName">Route Name</Label>
              <Input
                id="routeName"
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g., North Residential Loop"
                required
                disabled={!selectedRouteId}
              />
            </div>

            <div className="space-y-2"> {/* Added space-y-2 for label and input */}
              <Label htmlFor="pathDetails">Path Details (comma-separated)</Label>
              <Input
                id="pathDetails"
                type="text"
                value={pathDetails}
                onChange={(e) => setPathDetails(e.target.value)}
                placeholder="e.g., Main St, Oak Ave, Elm St"
                required
                disabled={!selectedRouteId}
              />
            </div>

            <div className="space-y-2"> {/* Added space-y-2 for label and input */}
              <Label htmlFor="estimatedTime">Estimated Time (e.g., 2 hours, 30 minutes)</Label>
              <Input
                id="estimatedTime"
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 2 hours, 30 minutes"
                required
                disabled={!selectedRouteId}
              />
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={!selectedRouteId}>
              Update Route
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpdateRoute;


