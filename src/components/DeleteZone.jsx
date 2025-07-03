import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, MapPin, Route } from 'lucide-react';
import { Label } from '@/components/ui/label'; // Added missing import

const DeleteZone = ({ onBack, onSuccess, initialZoneId = null }) => {
  const { zones, routes, deleteZone } = usePickup();
  const [selectedZoneId, setSelectedZoneId] = useState(initialZoneId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [assignedRoutes, setAssignedRoutes] = useState([]);

  useEffect(() => {
    if (selectedZoneId) {
      const zone = zones.find(z => z.id === selectedZoneId);
      if (zone) {
        setZoneToDelete(zone);
        const routesInZone = routes.filter(route => route.zoneId === selectedZoneId);
        setAssignedRoutes(routesInZone);
      } else {
        setZoneToDelete(null);
        setAssignedRoutes([]);
        toast.error('Selected Zone ID not found.');
      }
    } else {
      setZoneToDelete(null);
      setAssignedRoutes([]);
    }
  }, [selectedZoneId, zones, routes]);

  const handleDeleteClick = () => {
    if (!selectedZoneId) {
      toast.error('Please select a Zone ID to delete.');
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (zoneToDelete) {
      if (assignedRoutes.length > 0) {
        toast.error(
          <div className="flex flex-col">
            <p>Cannot delete Zone {zoneToDelete.id} - "{zoneToDelete.name}".</p>
            <p>The following routes are assigned to this zone:</p>
            <ul className="list-disc list-inside mt-2">
              {assignedRoutes.map(route => (
                <li key={route.id}>{route.id} - "{route.name}"</li>
              ))}
            </ul>
            <p className="mt-2">Please unassign these routes before deleting the zone.</p>
          </div>,
          { duration: 8000 } // Longer duration for detailed message
        );
      } else {
        deleteZone(zoneToDelete.id);
        toast.success(`Zone ${zoneToDelete.id} - "${zoneToDelete.name}" successfully deleted!`);
        onSuccess();
      }
      setDeleteDialogOpen(false);
      setZoneToDelete(null);
      setSelectedZoneId(null); // Clear selection after attempt
    }
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
            <Trash2 className="h-6 w-6" />
            <span>Delete Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
            
            {zoneToDelete && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50 dark:bg-muted-foreground/10">
                <p className="font-semibold">Selected Zone Details:</p>
                <p><strong>ID:</strong> {zoneToDelete.id}</p>
                <p><strong>Name:</strong> {zoneToDelete.name}</p>
                <p><strong>Area Coverage:</strong> {zoneToDelete.areaCoverage}</p>
                {assignedRoutes.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-red-500">Assigned Routes:</p>
                    <ul className="list-disc list-inside text-red-500">
                      {assignedRoutes.map(route => (
                        <li key={route.id}>{route.id} - "{route.name}"</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button
              type="button"
              onClick={handleDeleteClick}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!selectedZoneId}
            >
              Delete Zone
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Zone {zoneToDelete?.id} - "{zoneToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default DeleteZone;
