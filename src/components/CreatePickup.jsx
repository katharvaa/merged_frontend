import React, { useState } from 'react';
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
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Truck, 
  Calendar,
  CheckCircle,
  Moon,
  Sun,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

const CreatePickup = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const { zones, vehicles, workers, createPickup } = usePickup();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    zone: '',
    location: '',
    startTime: '',
    endTime: '',
    frequency: '',
    vehicle: '',
    worker1: '',
    worker2: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  // Generate time options (24-hour format)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Get available end times (minimum 1 hour after start time)
  const getAvailableEndTimes = () => {
    if (!formData.startTime) return timeOptions;
    
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const minEndTotalMinutes = startTotalMinutes + 60; // Minimum 1 hour
    
    return timeOptions.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const totalMinutes = hour * 60 + minute;
      return totalMinutes >= minEndTotalMinutes;
    });
  };

  // Get available workers (exclude selected worker1)
  const getAvailableWorkers2 = () => {
    return workers.filter(worker => worker.id !== formData.worker1);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.zone) newErrors.zone = 'Zone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';
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
      
      const newPickup = createPickup(formData);
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to create pickup. Please try again.' });
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
    
    // Reset end time if start time changes
    if (field === 'startTime' && formData.endTime) {
      const availableEndTimes = getAvailableEndTimes();
      if (!availableEndTimes.includes(formData.endTime)) {
        setFormData(prev => ({ ...prev, endTime: '' }));
      }
    }
    
    // Reset worker2 if worker1 changes to same value
    if (field === 'worker1' && value === formData.worker2) {
      setFormData(prev => ({ ...prev, worker2: '' }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
            Pickup Created Successfully!
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
        >
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Pickup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Zone and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="zone" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Zone</span>
                    </Label>
                    <Select value={formData.zone} onValueChange={(value) => handleInputChange('zone', value)}>
                      <SelectTrigger className={errors.zone ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.id} - {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.zone && <p className="text-sm text-red-500">{errors.zone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter a pick-up point"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                  </div>
                </div>

                {/* Time Slot and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Start Time</span>
                    </Label>
                    <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                      <SelectTrigger className={errors.startTime ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select 
                      value={formData.endTime} 
                      onValueChange={(value) => handleInputChange('endTime', value)}
                      disabled={!formData.startTime}
                    >
                      <SelectTrigger className={errors.endTime ? 'border-red-500' : ''}>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableEndTimes().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Frequency</span>
                    </Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            <Badge variant={freq === 'Daily' ? 'default' : 'secondary'}>
                              {freq}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.frequency && <p className="text-sm text-red-500">{errors.frequency}</p>}
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className="space-y-2">
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
                        <SelectItem key={vehicle.id} value={vehicle.registrationNumber}>
                          {vehicle.id}: {vehicle.registrationNumber}
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

                {errors.submit && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-lg transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePickup;

