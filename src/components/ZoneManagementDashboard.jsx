import React, { useState } from 'react';
import { useZone } from '../contexts/ZoneContext';
import { useRoute } from '../contexts/RouteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const ZoneManagementDashboard = ({ onCreateZone, onUpdateZone, onDeleteZone, onBack }) => {
  const { zones, loading: zonesLoading, error: zonesError, fetchZones } = useZone();
  const { routes, loading: routesLoading, error: routesError, fetchRoutes } = useRoute();

  const handleRetry = () => {
    fetchZones();
    fetchRoutes();
  };

  if (zonesLoading || routesLoading) {
    return <LoadingDisplay message="Loading zone and route data..." />;
  }

  // If there's an error, we still render the dashboard but with empty data and a message
  const displayZones = zonesError ? [] : zones;
  const displayRoutes = routesError ? [] : routes;

  const totalZones = displayZones.length;
  const activeZones = displayZones.filter(zone => zone.status === 'Active').length;
  const totalRoutes = displayRoutes.length;

  const errorMessage = (zonesError || routesError) ? "We\"re having trouble loading zone or route information. Please try again." : null;

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Zone Management</h1>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Zones</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalZones}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
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
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Zones</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{activeZones}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
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
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Routes</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalRoutes}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            onClick={onCreateZone} 
            className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700 rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Zone
          </Button>
          <Button 
            onClick={() => onUpdateZone()} 
            className="px-6 py-2 h-9 text-sm text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600 rounded-full"
          >
            <Edit className="mr-2 h-4 w-4" /> Update Zone
          </Button>
          <Button 
            onClick={() => onDeleteZone()} 
            className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700 rounded-full"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Zone
          </Button>
        </div>
      </motion.div>

      {/* Zones Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card>
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-0">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>All Zones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 pt-2">
            <div className="overflow-x-auto">
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Zone ID</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Zone Name</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayZones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        {errorMessage ? "No zones found due to an error. Please try again." : "No zones available. Create your first zone to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayZones.map((zone) => (
                      <TableRow key={zone.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs sm:text-sm font-medium whitespace-nowrap">{zone.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">{zone.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateZone(zone.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteZone(zone.id)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ZoneManagementDashboard;