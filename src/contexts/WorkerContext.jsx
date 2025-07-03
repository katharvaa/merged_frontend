import React, { createContext, useContext, useState, useEffect } from 'react';
import { workersAPI, handleApiError } from '../utils/api';

const WorkerContext = createContext();

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workers from API
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workersAPI.getAll();
      setWorkers(response.data || response || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching workers:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

  const createWorker = async (workerData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workersAPI.create(workerData);
      await fetchWorkers(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateWorker = async (workerId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workersAPI.update(workerId, updatedData);
      await fetchWorkers(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (workerId) => {
    try {
      setLoading(true);
      setError(null);
      await workersAPI.delete(workerId);
      await fetchWorkers(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWorkerById = async (workerId) => {
    try {
      const response = await workersAPI.getById(workerId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching worker by ID:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getWorkersByRole = async (roleId) => {
    try {
      const response = await workersAPI.getByRole(roleId);
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching workers by role:', errorMessage);
      return [];
    }
  };

  const getAvailableWorkers = async () => {
    try {
      const response = await workersAPI.getAvailable();
      return response.data || response || [];
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching available workers:', errorMessage);
      return [];
    }
  };

  // Filter workers by status
  const getWorkersByStatus = (status) => {
    return workers.filter(worker => worker.status === status);
  };

  // Get worker statistics
  const getWorkerStats = () => {
    const totalWorkers = workers.length;
    const availableWorkers = workers.filter(w => w.status === 'available').length;
    const occupiedWorkers = workers.filter(w => w.status === 'occupied').length;
    const absentWorkers = workers.filter(w => w.status === 'absent').length;

    return {
      totalWorkers,
      availableWorkers,
      occupiedWorkers,
      absentWorkers
    };
  };

  const value = {
    workers,
    loading,
    error,
    createWorker,
    updateWorker,
    deleteWorker,
    fetchWorkers,
    getWorkerById,
    getWorkersByRole,
    getAvailableWorkers,
    getWorkersByStatus,
    getWorkerStats
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};

