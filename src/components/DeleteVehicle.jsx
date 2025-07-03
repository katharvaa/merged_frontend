import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const DeleteVehicle = ({ onBack, onSuccess, vehicleId }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { vehicles, deleteVehicle, getVehicleById } = usePickup();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleId || '');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletedVehicle, setDeletedVehicle] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = getVehicleById(selectedVehicleId);
      setSelectedVehicle(vehicle);
    } else {
      setSelectedVehicle(null);
    }
  }, [selectedVehicleId, getVehicleById]);

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setErrors({});
  };

  const handleDeleteClick = () => {
    if (!selectedVehicleId) {
      setErrors({ vehicleId: 'Please select a vehicle to delete' });
      return;
    }

    if (selectedVehicle?.status === 'unavailable') {
      toast.error('Cannot delete vehicle that is currently assigned (unavailable)');
      return;
    }

    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteDialogOpen(false);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deleted = deleteVehicle(selectedVehicleId);
      setDeletedVehicle(deleted);
      setShowSuccess(true);
      
      toast.success('Vehicle deleted successfully!');
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to delete vehicle. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackClick = () => {
    if (showSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'under maintenance':
        return 'secondary';
      case 'unavailable':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'route truck':
        return 'default';
      case 'pickup truck':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const canDelete = selectedVehicle && selectedVehicle.status !== 'unavailable';

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vehicle Deleted Successfully!
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                Deleted Vehicle Details:
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <p><strong>Vehicle ID:</strong> {deletedVehicle?.id}</p>
                <p><strong>Type:</strong> {deletedVehicle?.type}</p>
                <p><strong>Registration Number:</strong> {deletedVehicle?.registrationNumber}</p>
                <p><strong>Status:</strong> {deletedVehicle?.status}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The vehicle has been permanently removed from your fleet.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Delete Vehicle</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <span>Delete Vehicle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vehicle Selection */}
          {!vehicleId && (
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Select Vehicle *</Label>
              <Select
                value={selectedVehicleId}
                onValueChange={handleVehicleSelect}
              >
                <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choose a vehicle to delete" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.id} - {vehicle.registrationNumber} ({vehicle.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && (
                <p className="text-sm text-red-600">{errors.vehicleId}</p>
              )}
            </div>
          )}

          {/* Vehicle Details */}
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Vehicle ID</Label>
                    <p className="font-medium">{selectedVehicle.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Registration Number</Label>
                    <p className="font-medium">{selectedVehicle.registrationNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Type</Label>
                    <div className="mt-1">
                      <Badge variant={getTypeBadgeVariant(selectedVehicle.type)}>
                        {selectedVehicle.type}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(selectedVehicle.status)}>
                        {selectedVehicle.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for unavailable vehicles */}
              {selectedVehicle.status === 'unavailable' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      Cannot Delete Vehicle
                    </h4>
                  </div>
                  <p className="text-red-700 dark:text-red-300 mt-2">
                    This vehicle is currently assigned and cannot be deleted. Please change its status to "available" or "under maintenance" before deletion.
                  </p>
                </div>
              )}

              {/* Delete Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  disabled={!canDelete || isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Vehicle
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle
              "{selectedVehicle?.id} - {selectedVehicle?.registrationNumber}" from your fleet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Vehicle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default DeleteVehicle;

