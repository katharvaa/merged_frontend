import React, { createContext, useContext, useState, useEffect } from 'react';
import { assignmentsAPI, handleApiError } from '../utils/api';

const AssignmentContext = createContext();

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignment must be used within an AssignmentProvider');
  }
  return context;
};

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentsAPI.getAll();
      setAssignments(response.data || response || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching assignments:", errorMessage);
      // For demo purposes, set empty array instead of dummy data
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Load assignments on component mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async (assignmentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentsAPI.create(assignmentData);
      await fetchAssignments(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (assignmentId, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentsAPI.update(assignmentId, updatedData);
      await fetchAssignments(); // Refresh the list
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      setLoading(true);
      setError(null);
      await assignmentsAPI.delete(assignmentId);
      await fetchAssignments(); // Refresh the list
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentById = async (assignmentId) => {
    try {
      const response = await assignmentsAPI.getById(assignmentId);
      return response.data || response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      console.error('Error fetching assignment by ID:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Helper functions for assignment analytics
  const getAssignmentsByRoute = (routeId) => {
    return assignments.filter(assignment => assignment.routeId === routeId);
  };

  const getAssignmentsByVehicle = (vehicleId) => {
    return assignments.filter(assignment => assignment.vehicleId === vehicleId);
  };

  const getAssignmentsByWorker = (workerId) => {
    return assignments.filter(assignment => 
      assignment.worker1Id === workerId || assignment.worker2Id === workerId
    );
  };

  const getAssignmentsByStatus = (status) => {
    return assignments.filter(assignment => assignment.status === status);
  };

  const getActiveAssignments = () => {
    return assignments.filter(assignment => assignment.status === 'active');
  };

  const getAssignmentStats = () => {
    const totalAssignments = assignments.length;
    const activeAssignments = getActiveAssignments().length;
    const uniqueRoutes = new Set(assignments.map(a => a.routeId)).size;
    const uniqueVehicles = new Set(assignments.map(a => a.vehicleId)).size;

    return {
      totalAssignments,
      activeAssignments,
      uniqueRoutes,
      uniqueVehicles
    };
  };

  const value = {
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    fetchAssignments,
    getAssignmentById,
    getAssignmentsByRoute,
    getAssignmentsByVehicle,
    getAssignmentsByWorker,
    getAssignmentsByStatus,
    getActiveAssignments,
    getAssignmentStats
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};

