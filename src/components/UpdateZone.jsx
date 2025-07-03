import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Edit, MapPin } from 'lucide-react';

const UpdateZone = ({ onBack, onSuccess, initialZoneId = null }) => {
  const { zones, updateZone } = usePickup();
  const [selectedZoneId, setSelectedZoneId] = useState(initialZoneId);
  const [zoneName, setZoneName] = useState('');
  const [areaCoverage, setAreaCoverage] = useState('');
  const [originalZone, setOriginalZone] = useState(null);

  useEffect(() => {
    if (selectedZoneId) {
      const zoneToUpdate = zones.find(zone => zone.id === selectedZoneId);
      if (zoneToUpdate) {
        setZoneName(zoneToUpdate.name);
        setAreaCoverage(zoneToUpdate.areaCoverage);
        setOriginalZone(zoneToUpdate);
      } else {
        // Clear fields if selected zone ID is not found (e.g., after deletion)
        setZoneName('');
        setAreaCoverage('');
        setOriginalZone(null);
        toast.error('Selected Zone ID not found.');
      }
    } else {
      // Clear fields if no zone is selected
      setZoneName('');
      setAreaCoverage('');
      setOriginalZone(null);
    }
  }, [selectedZoneId, zones]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedZoneId) {
      toast.error('Please select a Zone ID to update.');
      return;
    }

    if (!zoneName || !areaCoverage) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Check if any changes were made
    if (originalZone && 
        originalZone.name === zoneName && 
        originalZone.areaCoverage === areaCoverage) {
      toast.info('No changes were made to the zone.');
      onSuccess();
      return;
    }

    updateZone(selectedZoneId, {
      name: zoneName,
      areaCoverage: areaCoverage,
    });

    toast.success(`Zone details for ${selectedZoneId} - "${zoneName}" successfully updated!`);
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
        variant="outline"
        onClick={onBack}
        className="mb-4 flex items-center text-green-600 hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Zone Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-6 w-6" />
            <span>Update Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="zoneId" className="h-7">Zone ID</Label>
              <Select
                value={selectedZoneId}
                onValueChange={setSelectedZoneId}
                disabled={!!initialZoneId} // Disable if initialZoneId is provided (from table action button)
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Zone ID" />
                </SelectTrigger>
                <SelectContent>
                  {zones.length === 0 ? (
                    <SelectItem value="" disabled>No zones available</SelectItem>
                  ) : (
                    zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.id} - {zone.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zoneName" className="h-7">Zone Name</Label>
              <Input
                id="zoneName"
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g., Downtown Commercial"
                required
                disabled={!selectedZoneId} // Disable until a zone is selected
              />
            </div>
            <div>
              <Label htmlFor="areaCoverage" className="h-7">Area Coverage</Label>
              <Input
                id="areaCoverage"
                type="text"
                value={areaCoverage}
                onChange={(e) => setAreaCoverage(e.target.value)}
                placeholder="e.g., 10 sq km"
                required
                disabled={!selectedZoneId} // Disable until a zone is selected
              />
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600" disabled={!selectedZoneId}>
              Update Zone
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpdateZone;
