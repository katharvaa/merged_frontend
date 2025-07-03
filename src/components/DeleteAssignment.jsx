import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  assignmentsAPI, 
  handleApiError 
} from '../utils/api';
import { 
  validateRequired, 
  validateSelect, 
  formatSuccessMessage 
} from '../utils/validation';

const DeleteAssignment = ({ onBack, onSuccess, initialAssignmentId = null }) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId || '');
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  // Data for dropdowns
  const [assignments, setAssignments] = useState([]);

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
      setConfirmationText('');
    }
  }, [selectedAssignmentId]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      const response = await assignmentsAPI.getAll();
      
      // Handle different response formats
      setAssignments(response.data || response || []);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(`Failed to load assignments: ${errorMessage}`);
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
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(`Failed to load assignment details: ${errorMessage}`);
      setAssignmentData(null);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssignmentId) {
      toast.error('Please select an assignment to delete');
      return;
    }

    if (confirmationText.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm deletion');
      return;
    }

    try {
      setLoading(true);
      
      await assignmentsAPI.delete(selectedAssignmentId);
      
      toast.success(formatSuccessMessage('delete', 'Assignment'));
      onSuccess();
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get shift badge styling
  const getShiftBadge = (shift) => {
    const isDay = shift?.toLowerCase() === 'day';
    return {
      variant: 'default',
      className: isDay 
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
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
          Delete Assignment
        </h1>
      </div>

      {/* Assignment Selection */}
      <Card className="w-full mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <span>Select Assignment to Delete</span>
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
                <SelectValue placeholder="Select an assignment to delete" />
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

      {/* Assignment Details and Confirmation */}
      {selectedAssignmentId && (
        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Assignment Details & Confirmation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {assignmentLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : assignmentData ? (
              <>
                {/* Warning Message */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                        Warning: This action cannot be undone
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Deleting this assignment will:
                      </p>
                      <ul className="text-sm text-red-700 dark:text-red-300 mt-2 list-disc list-inside space-y-1">
                        <li>Remove the assignment permanently from the system</li>
                        <li>Update the vehicle status to "Available"</li>
                        <li>Update the assigned workers' status to "Available"</li>
                        <li>Remove all associated scheduling information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Assignment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Assignment ID:</span>
                        <p className="text-sm font-semibold">{assignmentData.assignmentId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Zone:</span>
                        <p className="text-sm">{assignmentData.zone || assignmentData.zoneId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Route:</span>
                        <p className="text-sm">{assignmentData.route || assignmentData.routeId}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Vehicle:</span>
                        <p className="text-sm">{assignmentData.vehicle || assignmentData.vehicleId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Shift:</span>
                        <div className="mt-1">
                          <Badge 
                            variant={getShiftBadge(assignmentData.shift).variant} 
                            className={getShiftBadge(assignmentData.shift).className}
                          >
                            {assignmentData.shift}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Assigned Workers:</span>
                        <div className="mt-1 space-y-1">
                          {assignmentData.assignedWorkers?.map((worker, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1">
                              {worker}
                            </Badge>
                          )) || (
                            <p className="text-sm text-muted-foreground">No workers assigned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="confirmation" className="text-sm font-medium">
                      Type "delete" to confirm deletion <span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="text"
                      id="confirmation"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder="Type 'delete' to confirm"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={loading || confirmationText.toLowerCase() !== 'delete'}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Assignment</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
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

export default DeleteAssignment;

