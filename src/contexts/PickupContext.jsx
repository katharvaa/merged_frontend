import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { pickupsAPI, handleApiError } from '../utils/api';

const PickupContext = createContext();

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};

export const PickupProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pickups from API
  const fetchPickups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pickupsAPI.getAll();
      setPickups(response.data || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching pickups:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setPickups([]);
    } finally {
      setLoading(false);
    }
  };

  // Load pickups on component mount
  useEffect(() => {
    fetchPickups();
  }, []);

  const createPickup = async (pickupData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pickupsAPI.create(pickupData);
      await fetchPickups(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePickup = async (pickupId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pickupsAPI.update(pickupId, updatedData);
      await fetchPickups(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePickup = async (pickupId) => {
    try {
      setLoading(true);
      setError(null);
      await pickupsAPI.delete(pickupId);
      await fetchPickups(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for analytics (using dummy data for now since logs API is not implemented)
  const getWeeklySummary = () => {
    // Mock data for weekly summary
    return {
      totalWeight: 175,
      totalCollections: 1
    };
  };

  const getMonthlySummary = () => {
    // Mock data for monthly summary
    return {
      totalWeight: 0,
      totalCollections: 0
    };
  };

  const getZoneDailyCollections = (zoneId, startDate, endDate) => {
    // Mock data for zone daily collections
    return [];
  };

  const getVehicleDailyWeight = (vehicleId, startDate, endDate) => {
    // Mock data for vehicle daily weight
    return [];
  };

  // Mock data for zones, vehicles, workers (these should be moved to separate contexts)
  const zones = [];
  const vehicles = [];
  const workers = [];
  const logs = []; // Empty for now

  const value = {
    // Pickup operations
    pickups,
    loading,
    error,
    createPickup,
    updatePickup,
    deletePickup,
    fetchPickups,
    
    // Analytics functions
    getWeeklySummary,
    getMonthlySummary,
    getZoneDailyCollections,
    getVehicleDailyWeight,
    
    // Mock data (to be moved to separate contexts)
    zones,
    vehicles,
    workers,
    logs
  };

  return (
    <PickupContext.Provider value={value}>
      {children}
    </PickupContext.Provider>
  );
};

