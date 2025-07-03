import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Edit, Trash2, Users, Route, MapPin, ArrowLeft } from 'lucide-react';
import { useAssignment } from '../contexts/AssignmentContext';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const AssignmentDashboard = ({ onBack, onCreateAssignment, onUpdateAssignment, onDeleteAssignment }) => {
  const { assignments, loading, error, fetchAssignments, deleteAssignment } = useAssignment();

  const handleRetry = () => {
    fetchAssignments();
  };

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalAssignments = assignments ? assignments.length : 0;
    const uniqueRoutes = assignments ? new Set(assignments.map(a => a.route)).size : 0;
    const uniqueZones = assignments ? new Set(assignments.map(a => a.zone)).size : 0;

    return {
      totalAssignments,
      uniqueRoutes,
      uniqueZones
    };
  }, [assignments]);

  // Handle assignment deletion
  const handleDeleteAssignmentClick = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(assignmentId);
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

  if (loading) {
    return <LoadingDisplay message="Loading assignment data..." />;
  }

  // If there is an error, we still render the dashboard but with empty data and a message
  const displayAssignments = error ? [] : assignments;

  const errorMessage = error ? "We're having trouble loading assignment information. Please try again." : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-2 sm:p-4 lg:p-6 max-w-full overflow-hidden"
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Assignment Management</h1>
        </div>
        
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Total Assignments
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {dashboardStats.totalAssignments}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 ml-2">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Number of Routes
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {dashboardStats.uniqueRoutes}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 ml-2">
                  <Route className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Number of Zones
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {dashboardStats.uniqueZones}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0 ml-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
          <Button
            onClick={onCreateAssignment}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Create Assignment
          </Button>
          <Button
            onClick={onUpdateAssignment}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600"
          >
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Update Assignment
          </Button>
          <Button
            onClick={onDeleteAssignment}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Delete Assignment
          </Button>
        </div>
      </motion.div>

      {/* Assignments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Assignment List</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6 sm:pt-0 lg:pt-0">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                      Assignment ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                      Vehicle
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">
                      Route
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">
                      Zone
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden lg:table-cell">
                      Assigned Workers
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                      Shift
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                        {errorMessage ? "No assignments found due to an error. Please try again." : "No assignments found. Create your first assignment to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayAssignments.map((assignment) => {
                      const shiftBadge = getShiftBadge(assignment.shift);
                      return (
                        <TableRow key={assignment.assignmentId} className="hover:bg-muted/50">
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap font-medium">
                            {assignment.assignmentId}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                            {assignment.vehicle}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden sm:table-cell">
                            {assignment.route}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden md:table-cell">
                            {assignment.zone}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {assignment.assignedWorkers?.map((worker, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {worker}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                            <Badge variant={shiftBadge.variant} className={`text-xs ${shiftBadge.className}`}>
                              {assignment.shift}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onUpdateAssignment(assignment.assignmentId)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAssignmentClick(assignment.assignmentId)}
                                className="h-6 w-6 p-0 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile-friendly assignment cards for very small screens */}
            <div className="block sm:hidden mt-4">
              {displayAssignments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3">Assignment Details</h3>
                  {displayAssignments.map((assignment) => {
                    const shiftBadge = getShiftBadge(assignment.shift);
                    return (
                      <Card key={`mobile-${assignment.assignmentId}`} className="mx-3">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{assignment.assignmentId}</p>
                                <p className="text-xs text-muted-foreground">Vehicle: {assignment.vehicle}</p>
                                <p className="text-xs text-muted-foreground">Route: {assignment.route}</p>
                                <p className="text-xs text-muted-foreground">Zone: {assignment.zone}</p>
                              </div>
                              <Badge variant={shiftBadge.variant} className={`text-xs ml-2 ${shiftBadge.className}`}>
                                {assignment.shift}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>👥 Workers: {assignment.assignedWorkers?.join(", ") || "None"}</p>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onUpdateAssignment(assignment.assignmentId)}
                                className="flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAssignmentClick(assignment.assignmentId)}
                                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AssignmentDashboard;