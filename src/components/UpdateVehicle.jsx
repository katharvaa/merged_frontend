import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const UpdateVehicle = ({ onBack, onSuccess, vehicleId }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { vehicles, updateVehicle, getVehicleById } = usePickup();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleId || '');
  const [formData, setFormData] = useState({
    registrationNumber: '',
    status: '',
    type: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updatedVehicle, setUpdatedVehicle] = useState(null);
  const [vehicleSelected, setVehicleSelected] = useState(!!vehicleId);

  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = getVehicleById(selectedVehicleId);
      if (vehicle) {
        setFormData({
          registrationNumber: vehicle.registrationNumber,
          status: vehicle.status,
          type: vehicle.type
        });
        setVehicleSelected(true);
      }
    }
  }, [selectedVehicleId, getVehicleById]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedVehicleId) {
      newErrors.vehicleId = 'Please select a vehicle to update';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (formData.registrationNumber.length < 3) {
      newErrors.registrationNumber = 'Registration number must be at least 3 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setErrors(prev => ({ ...prev, vehicleId: '' }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updated = updateVehicle(selectedVehicleId, formData);
      setUpdatedVehicle(updated);
      setShowSuccess(true);
      
      toast.success('Vehicle updated successfully!');
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to update vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (showSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

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
              Vehicle Updated Successfully!
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                Updated Vehicle Details:
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <p><strong>Vehicle ID:</strong> {updatedVehicle?.id}</p>
                <p><strong>Type:</strong> {updatedVehicle?.type}</p>
                <p><strong>Registration Number:</strong> {updatedVehicle?.registrationNumber}</p>
                <p><strong>Status:</strong> {updatedVehicle?.status}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The vehicle information has been updated successfully.
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Update Vehicle</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Vehicle Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            {!vehicleId && (
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Select Vehicle *</Label>
                <Select
                  value={selectedVehicleId}
                  onValueChange={handleVehicleSelect}
                >
                  <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choose a vehicle to update" />
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

            {vehicleSelected && (
              <>
                {/* Registration Number */}
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="e.g., ABC-1234"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className={errors.registrationNumber ? 'border-red-500' : ''}
                  />
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-600">{errors.registrationNumber}</p>
                  )}
                </div>

                {/* Type (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    type="text"
                    value={formData.type}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-sm text-gray-500">Vehicle type cannot be changed after creation</p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select vehicle status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            {vehicleSelected && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Vehicle
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpdateVehicle;

