import React, { useState } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Trash2, 
  MapPin, 
  Clock, 
  Users, 
  Truck,
  CheckCircle,
  Moon,
  Sun,
  AlertTriangle,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

const DeletePickup = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const { pickups, deletePickup, getZoneName, getVehicleName, getWorkerName } = usePickup();
  const { theme, toggleTheme } = useTheme();
  
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePickupSelect = (pickupId) => {
    setSelectedPickupId(pickupId);
    const pickup = pickups.find(p => p.id === pickupId);
    setSelectedPickup(pickup);
    setError('');
  };

  const handleDeleteClick = () => {
    if (!selectedPickup) {
      setError('Please select a pickup to delete');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      deletePickup(selectedPickup.id);
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setError('Failed to delete pickup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-green-100 dark:bg-green-900 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Pickup Deleted Successfully!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={onBack}
                className="transition-all duration-200 hover:scale-105 text-white hover:bg-green-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-white" />
                <span>WasteWise</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-105 text-gray-800 dark:text-white"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">#{user?.empId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Pickup Selection */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span>Delete Pickup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-id">Pickup ID:</Label>
                  <Select value={selectedPickupId} onValueChange={handlePickupSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pickup ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickups.length === 0 ? (
                        <SelectItem value="no-pickups" disabled>
                          No pickups available
                        </SelectItem>
                      ) : (
                        pickups.map((pickup) => (
                          <SelectItem key={pickup.id} value={pickup.id}>
                            {pickup.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pickup Details */}
          {selectedPickup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-lg border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Pick-up deletion selected for
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Zone:</Label>
                          <p className="text-sm">{selectedPickup.zone} - {getZoneName(selectedPickup.zone)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Location:</Label>
                          <p className="text-sm">{selectedPickup.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Time slot:</Label>
                          <p className="text-sm">{selectedPickup.startTime} - {selectedPickup.endTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Frequency:</Label>
                          <p className="text-sm">{selectedPickup.frequency}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Vehicle:</Label>
                          <p className="text-sm">{selectedPickup.vehicle} - {getVehicleName(selectedPickup.vehicle)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Worker 1:</Label>
                          <p className="text-sm">{selectedPickup.worker1} - {getWorkerName(selectedPickup.worker1)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium">Worker 2:</Label>
                          <p className="text-sm">{selectedPickup.worker2} - {getWorkerName(selectedPickup.worker2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={handleDeleteClick}
                      disabled={isLoading}
                      className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {pickups.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No Pickups Available
                    </h3>
                    <p className="text-muted-foreground">
                      There are no pickups to delete. Create some pickups first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirm Deletion</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete pickup <strong>{selectedPickup?.id}</strong>? 
              This action cannot be undone and will permanently remove the pickup from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Pickup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeletePickup;

