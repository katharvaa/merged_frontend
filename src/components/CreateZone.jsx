import React, { useState } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, MapPin } from 'lucide-react';

const CreateZone = ({ onBack, onSuccess }) => {
  const { createZone } = usePickup();
  const [zoneName, setZoneName] = useState('');
  const [areaCoverage, setAreaCoverage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!zoneName || !areaCoverage) {
      toast.error('Please fill in all fields.');
      return;
    }

    const newZone = createZone({
      name: zoneName,
      areaCoverage: areaCoverage,
    });

    toast.success(`Zone ${newZone.id} - "${newZone.name}" created successfully!`);
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
            <MapPin className="h-6 w-6" />
            <span>Create New Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="zoneName" className="h-7">Zone Name</Label>
              <Input
                id="zoneName"
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g., Downtown Commercial"
                required
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
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Create Zone
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateZone;
