import React, { createContext, useContext, useState, useEffect } from 'react';
import { zonesAPI, handleApiError } from '../utils/api';

const ZoneContext = createContext();

export const useZone = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

export const ZoneProvider = ({ children }) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch zones from API
  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await zonesAPI.getAll();
      setZones(response.data || response || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching zones:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  // Load zones on component mount
  useEffect(() => {
    fetchZones();
  }, []);

  const createZone = async (zoneData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await zonesAPI.create(zoneData);
      await fetchZones(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateZone = async (zoneId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await zonesAPI.update(zoneId, updatedData);
      await fetchZones(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteZone = async (zoneId) => {
    try {
      setLoading(true);
      setError(null);
      await zonesAPI.delete(zoneId);
      await fetchZones(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getZoneById = async (zoneId) => {
    try {
      const response = await zonesAPI.getById(zoneId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching zone by ID:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const checkZoneExists = async (zoneId) => {
    try {
      const response = await zonesAPI.exists(zoneId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error checking zone existence:', errorMessage);
      return false;
    }
  };

  const getZoneNamesAndIds = async () => {
    try {
      const response = await zonesAPI.getNamesAndIds();
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching zone names and IDs:', errorMessage);
      return [];
    }
  };

  const value = {
    zones,
    loading,
    error,
    createZone,
    updateZone,
    deleteZone,
    fetchZones,
    getZoneById,
    checkZoneExists,
    getZoneNamesAndIds
  };

  return (
    <ZoneContext.Provider value={value}>
      {children}
    </ZoneContext.Provider>
  );
};

