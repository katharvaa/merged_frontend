import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePickup } from '../contexts/PickupContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  LogOut,
  Moon,
  Sun,
  Calendar,
  MapPin,
  Clock,
  Users,
  Truck,
  TrendingUp,
  Activity,
  Leaf,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const Dashboard = ({ onCreatePickup, onDeletePickup, onUpdatePickup }) => {
  const { user, logout } = useAuth();
  const { pickups, loading, error, fetchPickups, getZoneName, getVehicleName, getWorkerName, deletePickup } = usePickup();
  const { theme, toggleTheme } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pickupToDelete, setPickupToDelete] = useState(null);

  const handleDeleteClick = (pickup) => {
    setPickupToDelete(pickup);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pickupToDelete) {
      deletePickup(pickupToDelete.id);
      setDeleteDialogOpen(false);
      setPickupToDelete(null);
    }
  };

  const handleRetry = () => {
    fetchPickups();
  };
  if (loading) {
    return <LoadingDisplay message="Loading pickup data..." />;
  }

  // If there is an error, we still render the dashboard but with empty data and a message
  const displayPickups = error ? [] : pickups;

  const errorMessage = error ? "We\"re having trouble loading pickup information. Please try again." : null;

  const stats = [
    {
      title: 'Total Pickups',
      value: displayPickups ? displayPickups.length : 0,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Active Routes',
      value: displayPickups ? new Set(displayPickups.map(p => p.zone)).size : 0,
      icon: MapPin,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Today\'s Jobs',
      value: displayPickups ? displayPickups.filter(p => p.frequency === 'Daily').length : 0,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black-50 dark:from-gray-950 dark:to-gray-800">
      {/* Header - Removed motion animation to make it stationary */}
      <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-white" />
                <span>WasteWise</span>
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-green-700 text-white/80">
                Pickup
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full h-8 w-8">
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
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="transition-all duration-200 hover:scale-105 bg-green-100 dark:bg-green-900 text-green-600 dark:text-white-400 rounded-full h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
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
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={onCreatePickup}
              className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Pickup
            </Button>
            <Button
              onClick={onUpdatePickup}
              className="px-6 py-2 h-9 text-sm text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-500 hover:bg-yellow-600 rounded-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Pickup
            </Button>
            <Button
              onClick={onDeletePickup}
              className="px-6 py-2 h-9 text-sm text-white transition-all duration-200 hover:scale-105 bg-red-500 hover:bg-red-700 rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Pickup
            </Button>
          </div>
        </motion.div>

        {/* Pickup Summary Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Current Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pickup ID</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Workers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayPickups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {errorMessage ? "No pickups found due to an error. Please try again." : "No pickups scheduled. Create your first pickup to get started!"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayPickups.map((pickup) => (
                        <TableRow key={pickup.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{pickup.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{pickup.zone} - {getZoneName(pickup.zone)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{pickup.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{pickup.startTime} - {pickup.endTime}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={pickup.frequency === 'Daily' ? 'default' : 'secondary'}>
                              {pickup.frequency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span>{pickup.vehicle} - {getVehicleName(pickup.vehicle)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm">
                                <div>{pickup.worker1} - {getWorkerName(pickup.worker1)}</div>
                                <div>{pickup.worker2} - {getWorkerName(pickup.worker2)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {pickup.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(pickup)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete pickup {pickupToDelete?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;