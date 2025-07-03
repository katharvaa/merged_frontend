import React, { useState, useEffect } from 'react';
import { useWorker } from '../contexts/WorkerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Users, UserCheck, UserMinus, UserX, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingDisplay from './LoadingDisplay';
import ErrorDisplay from './ErrorDisplay';

const WorkerManagementDashboard = ({ onBack, onCreateWorker, onUpdateWorker }) => {
  const { workers, loading, error, fetchWorkers } = useWorker();
  const [occupiedWorkers, setOccupiedWorkers] = useState(0);
  const [availableWorkers, setAvailableWorkers] = useState(0);
  const [absentWorkers, setAbsentWorkers] = useState(0);

  useEffect(() => {
    if (workers) {
      const occupied = workers.filter(w => w.status === 'occupied').length;
      const available = workers.filter(w => w.status === 'available').length;
      const absent = workers.filter(w => w.status === 'absent').length;

      setOccupiedWorkers(occupied);
      setAvailableWorkers(available);
      setAbsentWorkers(absent);
    }
  }, [workers]);

  const handleRetry = () => {
    fetchWorkers();
  };

  if (loading) {
    return <LoadingDisplay message="Loading worker data..." />;
  }

  // If there's an error, we still render the dashboard but with empty data and a message
  const displayWorkers = error ? [] : workers;

  useEffect(() => {
    if (displayWorkers) {
      const occupied = displayWorkers.filter(w => w.status === 'occupied').length;
      const available = displayWorkers.filter(w => w.status === 'available').length;
      const absent = displayWorkers.filter(w => w.status === 'absent').length;

      setOccupiedWorkers(occupied);
      setAvailableWorkers(available);
      setAbsentWorkers(absent);
    }
  }, [displayWorkers]);

  const stats = [
    {
      title: 'Occupied Workers',
      value: occupiedWorkers,
      icon: UserX,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Available Workers',
      value: availableWorkers,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Absent Workers',
      value: absentWorkers,
      icon: UserMinus,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  const errorMessage = error ? "We're having trouble loading worker information. Please try again." : null;

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Worker Management</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
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

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8"
      >
        <Button
          onClick={onCreateWorker}
          className="w-full sm:flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white transition-all duration-200 hover:scale-105 bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Create Worker
        </Button>
        <Button
          onClick={onUpdateWorker}
          className="w-full sm:flex-1 h-10 sm:h-12 text-sm sm:text-base lg:text-lg text-white dark:text-white transition-all duration-200 hover:scale-105 bg-yellow-600 hover:bg-yellow-700"
        >
          <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Update Worker
        </Button>
      </motion.div>

      {/* Workers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>All Workers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-3 lg:p-6 sm:pt-0 lg:pt-0">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Worker ID</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">Phone No.</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 hidden lg:table-cell">Role ID</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                        No workers found. Create a new worker to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    workers.map((worker) => (
                      <TableRow key={worker.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{worker.id}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">{worker.name}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden sm:table-cell">{worker.phone}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden md:table-cell">{worker.email}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap hidden lg:table-cell">{worker.roleId}</TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            worker.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            worker.status === 'occupied' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {worker.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile-friendly worker cards for very small screens */}
            <div className="block sm:hidden mt-4">
              {workers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3">Worker Details</h3>
                  {workers.map((worker) => (
                    <Card key={`mobile-${worker.id}`} className="mx-3">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{worker.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {worker.id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              worker.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              worker.status === 'occupied' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }`}>
                              {worker.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>📞 {worker.phone}</p>
                            <p>✉️ {worker.email}</p>
                            <p>👤 Role: {worker.roleId}</p>
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

export default WorkerManagementDashboard;


