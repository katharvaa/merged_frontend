import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    LogOut,
    Moon,
    Sun,
    Leaf,
    MapPin,
    Truck,
    Clock,
    Calendar,
    User,
    AlertCircle,
    Play,
    Square,
    Weight
} from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerDashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // State for assignment type - can be 'unassigned', 'route', or 'pickup'
    // For demo purposes, we'll simulate different states based on user empId
    const [assignmentType] = useState(() => {
        // Simulate different assignment states for demo
        if (user?.empId === 'W003') {
            return 'route'; // Route assignment for W003
        } else if (user?.empId === 'W002') {
            return 'pickup'; // Pickup assignment for W002
        } else {
            return 'unassigned'; // Unassigned for others
        }
    });

    // State for route assignment workflow
    const [isRouteStarted, setIsRouteStarted] = useState(false);
    const [collectedWeight, setCollectedWeight] = useState('');

    // Dummy data for assignments
    const routeAssignment = {
        assignmentId: 'AS001',
        vehicleId: 'RT001',
        zoneId: 'Z001',
        routeId: 'Z001-R001',
        shift: 'DAY'
    };

    const pickupAssignment = {
        assignmentId: 'P001',
        zoneId: 'Z002',
        vehicleId: 'PT001',
        pickupLocation: 'Green Valley Shopping Complex',
        pickupFrequency: 'Daily',
        pickupTimeSlot: '08:00 AM to 10:00 AM'
    };

    const handleStartRoute = () => {
        setIsRouteStarted(true);
    };

    const handleEndRoute = () => {
        // Here you would typically save the collected weight and end the route
        console.log('Route ended with collected weight:', collectedWeight);
        setIsRouteStarted(false);
        setCollectedWeight('');
    };

    const renderAssignmentContent = () => {
        switch (assignmentType) {
            case 'unassigned':
                return (
                    <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400">
                                <AlertCircle className="h-6 w-6" />
                                <span>No Assignment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                                    You are currently not assigned to any route or pickup task.
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Please report to the facility manager for your assignment.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 'route':
                return (
                    <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                                <MapPin className="h-6 w-6" />
                                <span>Route Assignment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignment Type</Label>
                                    <p className="text-lg font-semibold">Route Assignment</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignment ID</Label>
                                    <p className="text-lg font-semibold">{routeAssignment.assignmentId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle ID</Label>
                                    <p className="text-lg font-semibold">{routeAssignment.vehicleId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Zone ID</Label>
                                    <p className="text-lg font-semibold">{routeAssignment.zoneId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Route ID</Label>
                                    <p className="text-lg font-semibold">{routeAssignment.routeId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Shift</Label>
                                    <Badge variant={routeAssignment.shift === 'DAY' ? 'default' : 'secondary'}>
                                        {routeAssignment.shift}
                                    </Badge>
                                </div>
                            </div>

                            {!isRouteStarted ? (
                                <div className="pt-4">
                                    <Button
                                        onClick={handleStartRoute}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        size="lg"
                                    >
                                        <Play className="h-5 w-5 mr-2" />
                                        Start Route
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-4 space-y-4">
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <p className="text-green-700 dark:text-green-300 font-medium mb-4">
                                            Route in progress...
                                        </p>

                                        <div className="space-y-3">
                                            <Label htmlFor="weight" className="text-sm font-medium">
                                                Weight Collected (kg)
                                            </Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                placeholder="Enter weight in kg"
                                                value={collectedWeight}
                                                onChange={(e) => setCollectedWeight(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleEndRoute}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        size="lg"
                                        disabled={!collectedWeight}
                                    >
                                        <Square className="h-5 w-5 mr-2" />
                                        End Route
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );

            case 'pickup':
                return (
                    <Card className="w-full max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                                <Truck className="h-6 w-6" />
                                <span>Pickup Assignment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignment Type</Label>
                                    <p className="text-lg font-semibold">Pickup Assignment</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignment ID</Label>
                                    <p className="text-lg font-semibold">{pickupAssignment.assignmentId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Zone ID</Label>
                                    <p className="text-lg font-semibold">{pickupAssignment.zoneId}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle ID</Label>
                                    <p className="text-lg font-semibold">{pickupAssignment.vehicleId}</p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Location</Label>
                                    <p className="text-lg font-semibold">{pickupAssignment.pickupLocation}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Frequency</Label>
                                    <Badge variant="outline">{pickupAssignment.pickupFrequency}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Slot</Label>
                                    <p className="text-lg font-semibold">{pickupAssignment.pickupTimeSlot}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-800">
            {/* Header - Same as other dashboards */}
            <header className="bg-green-600 dark:bg-green-800 text-white sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl lg:text-3xl font-bold flex items-center space-x-2">
                                <Leaf className="h-6 w-6 text-white" />
                                <span>WasteWise</span>
                            </h1>
                            <Badge variant="secondary" className="hidden sm:inline-flex bg-green-700 text-white/80">
                                Worker
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
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'W'}
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
                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">
                            Hello, {user?.name || 'Worker'}!
                        </h2>
                        <p className="text-green-100 dark:text-blue-100">
                            Welcome to your worker dashboard. Check your current assignment below.
                        </p>
                    </div>
                </motion.div>

                {/* Assignment Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {renderAssignmentContent()}
                </motion.div>
            </div>
        </div>
    );
};

export default WorkerDashboard;

