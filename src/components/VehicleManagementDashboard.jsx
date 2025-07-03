import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useVehicle } from '../contexts/VehicleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Trash2,
  Edit,
  Truck,
  TrendingUp,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const VehicleManagementDashboard = ({ onBack, onCreateVehicle, onUpdateVehicle, onDeleteVehicle }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { vehicles, loading, error, deleteVehicle, fetchVehicles } = useVehicle();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleUpdateClick = (vehicleId) => {
    onUpdateVehicle(vehicleId);
  };

  const handleRetry = () => {
    fetchVehicles();
  };

  // Calculate stats from vehicles data
  if (loading) {
    return <LoadingDisplay message="Loading vehicle data..." />;
  }

  // If there's an error, we still render the dashboard but with empty data and a message
  const displayVehicles = error ? [] : vehicles;

  const totalVehicles = displayVehicles.length;
  const routeTrucks = displayVehicles.filter(v => v.type === 'route truck').length;
  const pickupTrucks = displayVehicles.filter(v => v.type === 'pickup truck').length;
  const availableVehicles = displayVehicles.filter(v => v.status === 'available').length;

  const stats = [
    {
      title: 'Total Vehicles',
      value: totalVehicles,
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Route Trucks',
      value: routeTrucks,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Pickup Trucks',
      value: pickupTrucks,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  const errorMessage = error ? "We're having trouble loading vehicle information. Please try again." : null;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'available':
        return 'success'; // Green
      case 'under maintenance':
        return 'warning'; // Yellow
      case 'unavailable':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'route truck':
        return 'default';
      case 'pickup truck':
        return 'secondary';
      default:
        return 'outline';
    }
  };

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Vehicle Management</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
          <Button
            onClick={onCreateVehicle}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Create Vehicle
          </Button>
          <Button
            onClick={() => onUpdateVehicle()}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600"
          >
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Update Vehicle
          </Button>
          <Button
            onClick={() => onDeleteVehicle()}
            className="flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Delete Vehicle
          </Button>
        </div>
      </motion.div>

      {/* Vehicles Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.id}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(vehicle.type)}>
                          {vehicle.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.registrationNumber}</TableCell>
                      <TableCell>
                        <Badge className={`
                          ${vehicle.status === 'available' ? 'bg-green-500 text-white' : ''}
                          ${vehicle.status === 'under maintenance' ? 'bg-yellow-500 text-black' : ''}
                          ${vehicle.status === 'unavailable' ? 'bg-red-500 text-white' : ''}
                        `}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateClick(vehicle.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(vehicle)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            disabled={vehicle.status === 'unavailable'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {vehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No vehicles found. Create your first vehicle to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle
              "{vehicleToDelete?.id}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default VehicleManagementDashboard;


