import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PickupProvider } from './contexts/PickupContext';
import { ZoneProvider } from './contexts/ZoneContext';
import { RouteProvider } from './contexts/RouteContext';
import { VehicleProvider } from './contexts/VehicleContext';
import { AssignmentProvider } from './contexts/AssignmentContext';
import { WorkerProvider } from './contexts/WorkerContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ZoneProvider>
          <RouteProvider>
            <VehicleProvider>
              <AssignmentProvider>
                <WorkerProvider>
                  <PickupProvider>
                    <App />
                  </PickupProvider>
                </WorkerProvider>
              </AssignmentProvider>
            </VehicleProvider>
          </RouteProvider>
        </ZoneProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)


