import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehiclesAPI, handleApiError } from '../utils/api';

const VehicleContext = createContext();

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiclesAPI.getAll();
      setVehicles(response.data || response || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching vehicles:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const createVehicle = async (vehicleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiclesAPI.create(vehicleData);
      await fetchVehicles(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (vehicleId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiclesAPI.update(vehicleId, updatedData);
      await fetchVehicles(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      setLoading(true);
      setError(null);
      await vehiclesAPI.delete(vehicleId);
      await fetchVehicles(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleById = async (vehicleId) => {
    try {
      const response = await vehiclesAPI.getById(vehicleId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching vehicle by ID:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPickupTrucks = async () => {
    try {
      const response = await vehiclesAPI.getPickupTrucks();
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching pickup trucks:', errorMessage);
      return [];
    }
  };

  const getRouteTrucks = async () => {
    try {
      const response = await vehiclesAPI.getRouteTrucks();
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching route trucks:', errorMessage);
      return [];
    }
  };

  // Filter vehicles by type
  const getVehiclesByType = (type) => {
    return vehicles.filter(vehicle => vehicle.type === type);
  };

  // Filter vehicles by status
  const getVehiclesByStatus = (status) => {
    return vehicles.filter(vehicle => vehicle.status === status);
  };

  // Get available vehicles
  const getAvailableVehicles = () => {
    return vehicles.filter(vehicle => vehicle.status === 'available');
  };

  const value = {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchVehicles,
    getVehicleById,
    getPickupTrucks,
    getRouteTrucks,
    getVehiclesByType,
    getVehiclesByStatus,
    getAvailableVehicles
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

