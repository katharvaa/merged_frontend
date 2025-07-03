import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { 
  assignmentsAPI, 
  zonesAPI, 
  routesAPI, 
  vehiclesAPI, 
  workersAPI, 
  handleApiError 
} from '../utils/api';
import { 
  validateForm, 
  validateRequired, 
  validateSelect, 
  formatSuccessMessage,
  trimInput 
} from '../utils/validation';

const CreateAssignment = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    zone: '',
    route: '',
    vehicle: '',
    worker1: '',
    worker2: '',
    shift: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Data for dropdowns
  const [zones, setZones] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workers, setWorkers] = useState([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      
      // Load data from APIs
      const [zonesResponse, routesResponse, vehiclesResponse, workersResponse] = await Promise.all([
        zonesAPI.getAll().catch(() => ({ data: [] })),
        routesAPI.getAll().catch(() => ({ data: [] })),
        vehiclesAPI.getRouteTrucks().catch(() => ({ data: [] })),
        workersAPI.getAvailable().catch(() => ({ data: [] }))
      ]);
      
      setZones(zonesResponse.data || zonesResponse || []);
      setAllRoutes(routesResponse.data || routesResponse || []);
      setVehicles(vehiclesResponse.data || vehiclesResponse || []);
      setWorkers(workersResponse.data || workersResponse || []);
      
    } catch (err) {
      console.error('Data loading failed:', err);
      setZones([]);
      setAllRoutes([]);
      setVehicles([]);
      setWorkers([]);
    } finally {
      setDataLoading(false);
    }
  };

  // Filter routes when zone changes
  useEffect(() => {
    if (formData.zone) {
      const filteredRoutes = allRoutes.filter(route => 
        route.zoneId === formData.zone || route.zone === formData.zone
      );
      setRoutes(filteredRoutes);
      
      // Clear route selection if current route is not in filtered list
      if (formData.route && !filteredRoutes.some(r => r.routeId === formData.route || r.id === formData.route)) {
        setFormData(prev => ({ ...prev, route: '' }));
      }
    } else {
      setRoutes([]);
      setFormData(prev => ({ ...prev, route: '' }));
    }
  }, [formData.zone, allRoutes]);

  const handleInputChange = (field, value) => {
    const trimmedValue = trimInput(value);
    setFormData(prev => ({ ...prev, [field]: trimmedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateFormData = () => {
    const validationRules = {
      zone: [
        (value) => validateRequired(value, 'Zone'),
        (value) => validateSelect(value, 'zone')
      ],
      route: [
        (value) => validateRequired(value, 'Route'),
        (value) => validateSelect(value, 'route')
      ],
      vehicle: [
        (value) => validateRequired(value, 'Vehicle'),
        (value) => validateSelect(value, 'vehicle')
      ],
      worker1: [
        (value) => validateRequired(value, 'First Worker'),
        (value) => validateSelect(value, 'worker')
      ],
      worker2: [
        (value) => validateRequired(value, 'Second Worker'),
        (value) => validateSelect(value, 'worker')
      ],
      shift: [
        (value) => validateRequired(value, 'Shift'),
        (value) => validateSelect(value, 'shift')
      ]
    };

    // Additional validation for different workers
    const additionalValidation = (formData) => {
      const errors = {};
      
      if (formData.worker1 && formData.worker2 && formData.worker1 === formData.worker2) {
        errors.worker2 = 'Please select different workers for the assignment';
      }
      
      return errors;
    };

    const { isValid, errors: validationErrors } = validateForm(formData, validationRules);
    const additionalErrors = additionalValidation(formData);
    
    const allErrors = { ...validationErrors, ...additionalErrors };
    
    return {
      isValid: isValid && Object.keys(additionalErrors).length === 0,
      errors: allErrors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateFormData();
    
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Prepare assignment data according to backend API
      const assignmentData = {
        zoneId: formData.zone,
        routeId: formData.route,
        vehicleId: formData.vehicle,
        workerIds: [formData.worker1, formData.worker2],
        shift: formData.shift.toUpperCase()
      };

      await assignmentsAPI.create(assignmentData);
      
      toast.success(formatSuccessMessage('create', 'Assignment'));
      onSuccess();
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      
      // Handle field-specific errors if provided by backend
      if (err.response?.data?.fieldErrors) {
        setErrors(err.response.data.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
      className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Create Assignment
        </h1>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5" />
            <span>Assignment Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zone Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="zone" className="text-sm font-medium">
                  Select Zone <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.zone} onValueChange={(value) => handleInputChange('zone', value)}>
                  <SelectTrigger className={`w-full ${errors.zone ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.zoneId || zone.id} value={zone.zoneId || zone.id}>
                        {zone.zoneId || zone.id} - {zone.zoneName || zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.zone && (
                  <p className="text-sm text-red-500">{errors.zone}</p>
                )}
              </motion.div>

              {/* Route Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="route" className="text-sm font-medium">
                  Select Route <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.route} 
                  onValueChange={(value) => handleInputChange('route', value)}
                  disabled={!formData.zone}
                >
                  <SelectTrigger className={`w-full ${errors.route ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={formData.zone ? "Select a route" : "Select zone first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.routeId || route.id} value={route.routeId || route.id}>
                        {route.routeId || route.id} - {route.routeName || route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.route && (
                  <p className="text-sm text-red-500">{errors.route}</p>
                )}
              </motion.div>

              {/* Vehicle Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="vehicle" className="text-sm font-medium">
                  Select Vehicle (Route Truck) <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.vehicle} onValueChange={(value) => handleInputChange('vehicle', value)}>
                  <SelectTrigger className={`w-full ${errors.vehicle ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a route truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === 'AVAILABLE').map((vehicle) => (
                      <SelectItem key={vehicle.vehicleId || vehicle.id} value={vehicle.vehicleId || vehicle.id}>
                        {vehicle.vehicleId || vehicle.id} - {vehicle.registrationNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicle && (
                  <p className="text-sm text-red-500">{errors.vehicle}</p>
                )}
              </motion.div>

              {/* Shift Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="shift" className="text-sm font-medium">
                  Shift <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                  <SelectTrigger className={`w-full ${errors.shift ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAY">Day Shift</SelectItem>
                    <SelectItem value="NIGHT">Night Shift</SelectItem>
                  </SelectContent>
                </Select>
                {errors.shift && (
                  <p className="text-sm text-red-500">{errors.shift}</p>
                )}
              </motion.div>

              {/* First Worker Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="worker1" className="text-sm font-medium">
                  Select First Worker <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.worker1} onValueChange={(value) => handleInputChange('worker1', value)}>
                  <SelectTrigger className={`w-full ${errors.worker1 ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select first worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.filter(w => w.status === 'AVAILABLE').map((worker) => (
                      <SelectItem key={worker.workerId || worker.id} value={worker.workerId || worker.id}>
                        {worker.workerId || worker.id} - {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.worker1 && (
                  <p className="text-sm text-red-500">{errors.worker1}</p>
                )}
              </motion.div>

              {/* Second Worker Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="worker2" className="text-sm font-medium">
                  Select Second Worker <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.worker2} onValueChange={(value) => handleInputChange('worker2', value)}>
                  <SelectTrigger className={`w-full ${errors.worker2 ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select second worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.filter(w => w.status === 'AVAILABLE' && (w.workerId || w.id) !== formData.worker1).map((worker) => (
                      <SelectItem key={worker.workerId || worker.id} value={worker.workerId || worker.id}>
                        {worker.workerId || worker.id} - {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.worker2 && (
                  <p className="text-sm text-red-500">{errors.worker2}</p>
                )}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end space-x-4 pt-6"
            >
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Create Assignment</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateAssignment;

