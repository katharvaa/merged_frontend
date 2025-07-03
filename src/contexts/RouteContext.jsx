import React, { createContext, useContext, useState, useEffect } from 'react';
import { routesAPI, handleApiError } from '../utils/api';

const RouteContext = createContext();

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

export const RouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch routes from API
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routesAPI.getAll();
      setRoutes(response.data || response || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching routes:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const createRoute = async (routeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await routesAPI.create(routeData);
      await fetchRoutes(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (routeId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await routesAPI.update(routeId, updatedData);
      await fetchRoutes(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (routeId) => {
    try {
      setLoading(true);
      setError(null);
      await routesAPI.delete(routeId);
      await fetchRoutes(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRoutesByZone = async (zoneId) => {
    try {
      const response = await routesAPI.getByZone(zoneId);
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching routes by zone:', errorMessage);
      return [];
    }
  };

  const getRouteById = async (routeId) => {
    try {
      const response = await routesAPI.getById(routeId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching route by ID:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    routes,
    loading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    fetchRoutes,
    getRoutesByZone,
    getRouteById
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};

