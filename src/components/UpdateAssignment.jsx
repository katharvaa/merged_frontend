import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';
import { 
  assignmentsAPI, 
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

const UpdateAssignment = ({ onBack, onSuccess, initialAssignmentId = null }) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId || '');
  const [assignmentData, setAssignmentData] = useState(null);
  const [formData, setFormData] = useState({
    vehicle: '',
    worker1: '',
    worker2: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  
  // Data for dropdowns
  const [assignments, setAssignments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workers, setWorkers] = useState([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load assignment details when assignment ID changes
  useEffect(() => {
    if (selectedAssignmentId) {
      loadAssignmentDetails(selectedAssignmentId);
    } else {
      setAssignmentData(null);
      setFormData({ vehicle: '', worker1: '', worker2: '' });
    }
  }, [selectedAssignmentId]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      
      const [assignmentsResponse, vehiclesResponse, workersResponse] = await Promise.all([
        assignmentsAPI.getAll(),
        vehiclesAPI.getRouteTrucks(),
        workersAPI.getByRole('003') // Sanitary workers
      ]);

      // Handle different response formats
      setAssignments(assignmentsResponse.data || assignmentsResponse || []);
      setVehicles(vehiclesResponse.data || vehiclesResponse || []);
      setWorkers(workersResponse.data || workersResponse || []);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(`Failed to load data: ${errorMessage}`);
    } finally {
      setDataLoading(false);
    }
  };

  const loadAssignmentDetails = async (assignmentId) => {
    try {
      setAssignmentLoading(true);
      const response = await assignmentsAPI.getById(assignmentId);
      const assignment = response.data || response;
      
      setAssignmentData(assignment);
      setFormData({
        vehicle: assignment.vehicleId || assignment.vehicle || '',
        worker1: assignment.workerIds?.[0] || assignment.assignedWorkers?.[0] || '',
        worker2: assignment.workerIds?.[1] || assignment.assignedWorkers?.[1] || ''
      });
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(`Failed to load assignment details: ${errorMessage}`);
      setAssignmentData(null);
    } finally {
      setAssignmentLoading(false);
    }
  };

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
    
    if (!selectedAssignmentId) {
      toast.error('Please select an assignment to update');
      return;
    }

    const { isValid, errors: validationErrors } = validateFormData();
    
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Prepare update data according to backend API
      const updateData = {
        vehicleId: formData.vehicle,
        workerIds: [formData.worker1, formData.worker2]
      };

      await assignmentsAPI.update(selectedAssignmentId, updateData);
      
      toast.success(formatSuccessMessage('update', 'Assignment'));
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

  // Get available vehicles (including currently assigned one)
  const getAvailableVehicles = () => {
    const currentVehicle = assignmentData?.vehicleId || assignmentData?.vehicle;
    return vehicles.filter(v => 
      v.status === 'AVAILABLE' || 
      (v.vehicleId || v.id) === currentVehicle
    );
  };

  // Get available workers (including currently assigned ones)
  const getAvailableWorkers = () => {
    const currentWorkers = [
      assignmentData?.workerIds?.[0] || assignmentData?.assignedWorkers?.[0],
      assignmentData?.workerIds?.[1] || assignmentData?.assignedWorkers?.[1]
    ].filter(Boolean);
    
    return workers.filter(w => 
      w.status === 'AVAILABLE' || 
      currentWorkers.includes(w.workerId || w.id)
    );
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
          Update Assignment
        </h1>
      </div>

      {/* Assignment Selection */}
      <Card className="w-full mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Select Assignment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="assignmentId" className="text-sm font-medium">
              Assignment ID <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedAssignmentId} 
              onValueChange={setSelectedAssignmentId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an assignment to update" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem 
                    key={assignment.assignmentId || assignment.id} 
                    value={assignment.assignmentId || assignment.id}
                  >
                    {assignment.assignmentId || assignment.id} - {assignment.route} ({assignment.shift})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Details */}
      {selectedAssignmentId && (
        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Update Assignment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {assignmentLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : assignmentData ? (
              <>
                {/* Current Assignment Info */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3">Current Assignment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Assignment ID:</span> {assignmentData.assignmentId}
                    </div>
                    <div>
                      <span className="font-medium">Zone:</span> {assignmentData.zone || assignmentData.zoneId}
                    </div>
                    <div>
                      <span className="font-medium">Route:</span> {assignmentData.route || assignmentData.routeId}
                    </div>
                    <div>
                      <span className="font-medium">Shift:</span> {assignmentData.shift}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Update */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="vehicle" className="text-sm font-medium">
                        Update Vehicle <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.vehicle} onValueChange={(value) => handleInputChange('vehicle', value)}>
                        <SelectTrigger className={`w-full ${errors.vehicle ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select a route truck" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableVehicles().map((vehicle) => (
                            <SelectItem key={vehicle.vehicleId || vehicle.id} value={vehicle.vehicleId || vehicle.id}>
                              {vehicle.vehicleId || vehicle.id} - {vehicle.registrationNo}
                              {(vehicle.vehicleId || vehicle.id) === (assignmentData.vehicleId || assignmentData.vehicle) && ' (Current)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.vehicle && (
                        <p className="text-sm text-red-500">{errors.vehicle}</p>
                      )}
                    </motion.div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Update Assigned Workers</span>
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Worker Update */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="worker1" className="text-sm font-medium">
                        Update First Worker <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.worker1} onValueChange={(value) => handleInputChange('worker1', value)}>
                        <SelectTrigger className={`w-full ${errors.worker1 ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select first worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableWorkers().map((worker) => {
                            const workerId = worker.workerId || worker.id;
                            const currentWorkers = [
                              assignmentData?.workerIds?.[0] || assignmentData?.assignedWorkers?.[0],
                              assignmentData?.workerIds?.[1] || assignmentData?.assignedWorkers?.[1]
                            ];
                            const isCurrent = currentWorkers.includes(workerId);
                            
                            return (
                              <SelectItem key={workerId} value={workerId}>
                                {workerId} - {worker.name}
                                {isCurrent && ' (Current)'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.worker1 && (
                        <p className="text-sm text-red-500">{errors.worker1}</p>
                      )}
                    </motion.div>

                    {/* Second Worker Update */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="worker2" className="text-sm font-medium">
                        Update Second Worker <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.worker2} onValueChange={(value) => handleInputChange('worker2', value)}>
                        <SelectTrigger className={`w-full ${errors.worker2 ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select second worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableWorkers().filter(w => (w.workerId || w.id) !== formData.worker1).map((worker) => {
                            const workerId = worker.workerId || worker.id;
                            const currentWorkers = [
                              assignmentData?.workerIds?.[0] || assignmentData?.assignedWorkers?.[0],
                              assignmentData?.workerIds?.[1] || assignmentData?.assignedWorkers?.[1]
                            ];
                            const isCurrent = currentWorkers.includes(workerId);
                            
                            return (
                              <SelectItem key={workerId} value={workerId}>
                                {workerId} - {worker.name}
                                {isCurrent && ' (Current)'}
                              </SelectItem>
                            );
                          })}
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
                    transition={{ delay: 0.4 }}
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
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Update Assignment</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Failed to load assignment details. Please try selecting again.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default UpdateAssignment;

