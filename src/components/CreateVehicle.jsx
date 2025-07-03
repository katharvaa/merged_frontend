import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePickup } from '../contexts/PickupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Truck, CheckCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const CreateVehicle = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { createVehicle } = usePickup();
  
  const [formData, setFormData] = useState({
    registrationNumber: '',
    status: '',
    type: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (formData.registrationNumber.length < 3) {
      newErrors.registrationNumber = 'Registration number must be at least 3 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      
      const newVehicle = createVehicle(formData);
      setCreatedVehicle(newVehicle);
      setShowSuccess(true);
      
      toast.success('Vehicle created successfully!');
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to create vehicle. Please try again.');
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
              Vehicle Created Successfully!
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                Vehicle Details:
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <p><strong>Vehicle ID:</strong> {createdVehicle?.id}</p>
                <p><strong>Type:</strong> {createdVehicle?.type}</p>
                <p><strong>Registration Number:</strong> {createdVehicle?.registrationNumber}</p>
                <p><strong>Status:</strong> {createdVehicle?.status}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The vehicle has been added to your fleet and is now available for assignments.
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Vehicle</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Vehicle Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="route truck">Route Truck</SelectItem>
                  <SelectItem value="pickup truck">Pickup Truck</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
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

            {/* Submit Button */}
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
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Vehicle
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateVehicle;

