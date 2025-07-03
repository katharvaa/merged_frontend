import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Clock, 
  Users, 
  Truck, 
  Calendar,
  CheckCircle,
  Moon,
  Sun,
  Leaf,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const UpdatePickup = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const { pickups, vehicles, workers, updatePickup, getZoneName, getVehicleName, getWorkerName } = usePickup();
  const { theme, toggleTheme } = useTheme();
  
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [formData, setFormData] = useState({
    vehicle: '',
    worker1: '',
    worker2: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load pickup data when pickup ID is selected
  useEffect(() => {
    if (selectedPickupId) {
      const pickup = pickups.find(p => p.id === selectedPickupId);
      if (pickup) {
        setSelectedPickup(pickup);
        setFormData({
          vehicle: pickup.vehicle,
          worker1: pickup.worker1,
          worker2: pickup.worker2
        });
      }
    } else {
      setSelectedPickup(null);
      setFormData({
        vehicle: '',
        worker1: '',
        worker2: ''
      });
    }
  }, [selectedPickupId, pickups]);

  // Get available workers (exclude selected worker1)
  const getAvailableWorkers2 = () => {
    return workers.filter(worker => worker.id !== formData.worker1);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedPickupId) newErrors.pickupId = 'Please select a pickup to update';
    if (!formData.vehicle) newErrors.vehicle = 'Vehicle is required';
    if (!formData.worker1) newErrors.worker1 = 'Worker 1 is required';
    if (!formData.worker2) newErrors.worker2 = 'Worker 2 is required';
    
    if (formData.worker1 && formData.worker2 && formData.worker1 === formData.worker2) {
      newErrors.worker2 = 'Worker 2 must be different from Worker 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPickup = updatePickup(selectedPickupId, formData);
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to update pickup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset worker2 if worker1 changes to same value
    if (field === 'worker1' && value === formData.worker2) {
      setFormData(prev => ({ ...prev, worker2: '' }));
    }
  };

  const handlePickupSelect = (pickupId) => {
    setSelectedPickupId(pickupId);
    if (errors.pickupId) {
      setErrors(prev => ({ ...prev, pickupId: '' }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            Pickup Updated Successfully!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
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
        >
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Update Pickup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pickup Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Select Pickup to Update</span>
                  </Label>
                  <Select value={selectedPickupId} onValueChange={handlePickupSelect}>
                    <SelectTrigger className={errors.pickupId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Choose a pickup to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickups.map((pickup) => (
                        <SelectItem key={pickup.id} value={pickup.id}>
                          {pickup.id} - {pickup.location} ({pickup.zone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pickupId && <p className="text-sm text-red-500">{errors.pickupId}</p>}
                </div>

                {/* Display current pickup details (read-only) */}
                {selectedPickup && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Pickup Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Zone</span>
                        </Label>
                        <Input
                          value={`${selectedPickup.zone} - ${getZoneName(selectedPickup.zone)}`}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={selectedPickup.location}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Start Time</span>
                        </Label>
                        <Input
                          value={selectedPickup.startTime}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          value={selectedPickup.endTime}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Frequency</span>
                        </Label>
                        <div className="flex items-center h-10 px-3 py-2 border border-input bg-gray-100 dark:bg-gray-700 rounded-md">
                          <Badge variant={selectedPickup.frequency === 'Daily' ? 'default' : 'secondary'}>
                            {selectedPickup.frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editable fields - only show when pickup is selected */}
                {selectedPickup && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Update Vehicle and Workers</h3>
                      
                      {/* Vehicle Selection */}
                      <div className="space-y-2 mb-6">
                        <Label className="flex items-center space-x-2">
                          <Truck className="h-4 w-4" />
                          <span>Select a vehicle</span>
                        </Label>
                        <Select value={formData.vehicle} onValueChange={(value) => handleInputChange('vehicle', value)}>
                          <SelectTrigger className={errors.vehicle ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Available vehicles" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.id} - {vehicle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.vehicle && <p className="text-sm text-red-500">{errors.vehicle}</p>}
                      </div>

                      {/* Worker Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Select worker 1</span>
                          </Label>
                          <Select value={formData.worker1} onValueChange={(value) => handleInputChange('worker1', value)}>
                            <SelectTrigger className={errors.worker1 ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Available workers" />
                            </SelectTrigger>
                            <SelectContent>
                              {workers.map((worker) => (
                                <SelectItem key={worker.id} value={worker.id}>
                                  {worker.id} - {worker.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.worker1 && <p className="text-sm text-red-500">{errors.worker1}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Select worker 2</span>
                          </Label>
                          <Select 
                            value={formData.worker2} 
                            onValueChange={(value) => handleInputChange('worker2', value)}
                            disabled={!formData.worker1}
                          >
                            <SelectTrigger className={errors.worker2 ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Available workers" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableWorkers2().map((worker) => (
                                <SelectItem key={worker.id} value={worker.id}>
                                  {worker.id} - {worker.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.worker2 && <p className="text-sm text-red-500">{errors.worker2}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Error Alert */}
                    {errors.submit && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.submit}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Edit className="h-4 w-4" />
                            <span>Update Pickup</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdatePickup;

