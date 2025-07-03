import React, { useState } from 'react';
import { useRoute } from '../contexts/RouteContext';
import { useAssignment } from '../contexts/AssignmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Route, Clock, ClipboardList, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const RouteManagementDashboard = ({ onCreateRoute, onUpdateRoute, onDeleteRoute, onBack }) => {
  const { routes, loading: routesLoading, error: routesError, fetchRoutes } = useRoute();
  const { assignments, loading: assignmentsLoading, error: assignmentsError, fetchAssignments } = useAssignment();

  const handleRetry = () => {
    fetchRoutes();
    fetchAssignments();
  };

  if (routesLoading || assignmentsLoading) {
    return <LoadingDisplay message="Loading route and assignment data..." />;
  }

  // If there's an error, we still render the dashboard but with empty data and a message
  const displayRoutes = routesError ? [] : routes;
  const displayAssignments = assignmentsError ? [] : assignments;

  const totalRoutes = displayRoutes.length;
  const totalRoutesAssignedForAssignment = new Set(displayAssignments.map(assignment => assignment.routeId)).size;
  const avgEstimatedTime = displayRoutes.length > 0 
    ? (displayRoutes.reduce((sum, route) => {
        const timeParts = route.estimatedTime.match(/(\d+)\s*(hour|minute)s?/);
        if (timeParts) {
          const value = parseInt(timeParts[1]);
          const unit = timeParts[2];
          return sum + (unit === 'hour' ? value * 60 : value);
        }
        return sum;
      }, 0) / displayRoutes.length).toFixed(0) + ' minutes'
    : 'N/A';

  const stats = [
    {
      title: 'Total Routes',
      value: totalRoutes,
      icon: Route,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Routes Assigned for Assignment',
      value: totalRoutesAssignedForAssignment,
      icon: ClipboardList,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Avg. Estimated Time',
      value: avgEstimatedTime,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
  ];

  const errorMessage = (routesError || assignmentsError) ? "We're having trouble loading route and assignment information. Please try again." : null;

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
            </Button>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Route Management</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="w-full"
          >
            <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg w-full">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons - Centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button 
            onClick={onCreateRoute} 
            className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700 rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Route
          </Button>
          <Button 
            onClick={() => onUpdateRoute()} 
            className="px-6 py-2 h-9 text-sm text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600 rounded-full"
          >
            <Edit className="mr-2 h-4 w-4" /> Update Route
          </Button>
          <Button 
            onClick={() => onDeleteRoute()} 
            className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700 rounded-full"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Route
          </Button>
        </div>
      </motion.div>

      {/* Routes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-0">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
              <Route className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>All Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6 pt-2">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Route ID</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Zone ID</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Route Name</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Path Details</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                        No routes available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    routes.map((route) => (
                      <TableRow key={route.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap font-medium">{route.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{route.zoneId}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{route.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap max-w-xs truncate" title={route.pathDetails}>{route.pathDetails}</TableCell>
                        <TableCell className="px-2 sm:px-4">
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button variant="outline" size="sm" onClick={() => onUpdateRoute(route.id)} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onDeleteRoute(route.id)} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile-friendly route cards for very small screens */}
            <div className="block sm:hidden mt-4">
              {routes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3">Route Details</h3>
                  {routes.map((route) => (
                    <Card key={`mobile-${route.id}`} className="mx-3">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{route.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {route.id}</p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button variant="outline" size="sm" onClick={() => onUpdateRoute(route.id)} className="h-7 w-7 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => onDeleteRoute(route.id)} className="h-7 w-7 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>🏷️ Zone: {route.zoneId}</p>
                            <p>🛣️ Path: {route.pathDetails}</p>
                            <p>⏱️ Est. Time: {route.estimatedTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RouteManagementDashboard;

