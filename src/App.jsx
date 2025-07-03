import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard'; // Scheduler Dashboard
import CreatePickup from './components/CreatePickup';
import UpdatePickup from './components/UpdatePickup';
import DeletePickup from './components/DeletePickup';

import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';

import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 300 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -300 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function App() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  const [currentView, setCurrentView] = useState('signIn'); // Default view

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        setCurrentView('adminDashboard');
      } else if (user.role === 'Scheduler') {
        setCurrentView('schedulerDashboard');
      } else if (user.role === 'Worker') {
        setCurrentView('workerDashboard');
      }
    } else {
      setCurrentView('signIn');
    }
  }, [user]);

  const handleCreatePickup = () => {
    setCurrentView('createPickup');
  };

  const handleUpdatePickup = () => {
    setCurrentView('updatePickup');
  };

  const handleDeletePickup = () => {
    // This would typically open a dialog or navigate to a delete specific page
    console.log('Delete Pickup button clicked');
  };

  const handleBackToSchedulerDashboard = () => {
    setCurrentView('schedulerDashboard');
  };

  const handlePickupSuccess = () => {
    setCurrentView('schedulerDashboard');
    // Optionally, show a success message on the dashboard
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-muted-foreground">Loading...</h2>
        </motion.div>
      </div>
    );
  }

  let content;
  let pageKey = currentView; // Key for AnimatePresence

  if (!user) {
    content = <SignIn />;
    pageKey = 'signIn';
  } else if (user.role === 'Admin') {
    content = <AdminDashboard />;
    pageKey = 'adminDashboard';
  } else if (user.role === 'Scheduler') {
    switch (currentView) {
      case 'createPickup':
        content = <CreatePickup onBack={handleBackToSchedulerDashboard} onSuccess={handlePickupSuccess} />;
        break;
      case 'updatePickup':
        content = <UpdatePickup onBack={handleBackToSchedulerDashboard} onSuccess={handlePickupSuccess} />;
        break;
      case 'deletePickup':
        content = <DeletePickup onBack={handleBackToSchedulerDashboard} onSuccess={handlePickupSuccess} />;
        break;
      case 'schedulerDashboard':
      default:
        content = (
          <Dashboard
            onCreatePickup={handleCreatePickup}
            onUpdatePickup={handleUpdatePickup}
            onDeletePickup={handleDeletePickup}
          />
        );
        break;
    }
  } else if (user.role === 'Worker') {
    content = <WorkerDashboard />;
    pageKey = 'workerDashboard';
  }

  return (
    <div className={theme}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;


