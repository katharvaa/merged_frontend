import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Route, ClipboardList } from 'lucide-react';
import { Label } from '@/components/ui/label';

const DeleteRoute = ({ onBack, onSuccess, initialRouteId = null }) => {
  const { routes, assignments, deleteRoute, getAssignmentsByRouteId } = usePickup();
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [linkedAssignments, setLinkedAssignments] = useState([]);

  useEffect(() => {
    if (initialRouteId) {
      setSelectedRouteId(initialRouteId);
    }
  }, [initialRouteId]);

  useEffect(() => {
    if (selectedRouteId) {
      const route = routes.find(r => r.id === selectedRouteId);
      if (route) {
        setRouteToDelete(route);
        const assignments = getAssignmentsByRouteId(selectedRouteId);
        setLinkedAssignments(assignments);
      } else {
        setRouteToDelete(null);
        setLinkedAssignments([]);
      }
    } else {
      setRouteToDelete(null);
      setLinkedAssignments([]);
    }
  }, [selectedRouteId, routes, getAssignmentsByRouteId]);

  const handleDeleteClick = () => {
    if (!selectedRouteId) {
      toast.error('Please select a Route ID to delete.');
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (routeToDelete) {
      const result = deleteRoute(routeToDelete.id);
      if (result.success) {
        toast.success(`Route ${routeToDelete.id} - "${routeToDelete.name}" deleted successfully!`);
        onSuccess();
      } else {
        toast.error(
          <div className="flex flex-col">
            <p>Cannot delete Route {routeToDelete.id} - "{routeToDelete.name}".</p>
            <p>The following assignments are linked to this route:</p>
            <ul className="list-disc list-inside mt-2">
              {result.assignedAssignments.map(assignment => (
                <li key={assignment.id}>{assignment.id}</li>
              ))}
            </ul>
            <p className="mt-2">Please unassign these assignments before deleting the route.</p>
          </div>,
          { duration: 8000 }
        );
      }
    }
    setDeleteDialogOpen(false);
    setRouteToDelete(null);
    setSelectedRouteId(null); // Clear selection after attempt
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
            <Trash2 className="h-6 w-6" />
            <span>Delete Route</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6"> {/* Changed from space-y-4 to space-y-6 */}
            <div className="space-y-2"> {/* Added space-y-2 for label and input */}
              <Label htmlFor="routeId">Route ID</Label>
              <Select
                value={selectedRouteId || ''}
                onValueChange={setSelectedRouteId}
                disabled={!!initialRouteId} // Disable if initialRouteId is provided (from table action)
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Route ID" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.id} - {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRouteId && routeToDelete && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50 dark:bg-muted-foreground/10 space-y-2"> {/* Added space-y-2 */}
                <p className="font-semibold">Selected Route Details:</p>
                <p><strong>ID:</strong> {routeToDelete.id}</p>
                <p><strong>Name:</strong> {routeToDelete.name}</p>
                <p><strong>Zone ID:</strong> {routeToDelete.zoneId}</p>
                <p><strong>Path Details:</strong> {routeToDelete.pathDetails}</p>
                <p><strong>Estimated Time:</strong> {routeToDelete.estimatedTime}</p>
                {linkedAssignments.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-red-500">Assigned Assignments:</p>
                    <ul className="list-disc list-inside text-red-500">
                      {linkedAssignments.map(assignment => (
                        <li key={assignment.id}>{assignment.id}</li>
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
              disabled={!selectedRouteId || (selectedRouteId && linkedAssignments.length > 0)}
            >
              Delete Route
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
              Are you sure you want to delete Route {routeToDelete?.id} - "{routeToDelete?.name}"? This action cannot be undone.
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

export default DeleteRoute;


