# WasteWise - Pickup Scheduler

A comprehensive React application for managing waste pickup scheduling with role-based access, dark/light mode, and professional UI design.

## 🚀 Features

- **Role-based Authentication**: Secure sign-in system with different user roles
- **Pickup Management**: Create, view, and delete pickup schedules
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Professional UI**: Modern design with animations and responsive layout
- **Real-time Validation**: Form validation with user-friendly error messages
- **Gamification Elements**: Interactive UI with hover effects and smooth transitions
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (package manager)
- **Git** (for version control)

## 🛠️ Installation & Setup

### Step 1: Clone or Navigate to the Project

If you have the project files:
```bash
cd pickup-scheduler
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start the Development Server

```bash
pnpm run dev --host
```

The application will be available at:
- **Local**: http://localhost:5173/
- **Network**: http://[your-ip]:5173/

## 🔐 Demo Credentials

Use these credentials to sign in to the application:

### Scheduler Users:
- **Employee ID**: `S001`
  - **Password**: `scheduler123`
  - **Name**: John Doe

- **Employee ID**: `S002`
  - **Password**: `admin123`
  - **Name**: Jane Smith

## 📱 How to Use the Application

### 1. Sign In
- Open the application in your browser
- Enter one of the demo credentials above
- Click "Sign In" to access the dashboard

### 2. Dashboard Overview
- View pickup statistics (Total Pickups, Active Routes, Today's Jobs, Efficiency)
- See current pickup status in the table
- Access Create and Delete pickup functions

### 3. Create Pickup
- Click "Create Pickup" button
- Fill in all required fields:
  - **Zone**: Select from available zones (Z001-Z005)
  - **Location**: Enter pickup location manually
  - **Time Slot**: Select start and end times (minimum 1 hour duration)
  - **Frequency**: Choose Daily, Weekly, or Monthly
  - **Vehicle**: Select from available vehicles (V001-V005)
  - **Workers**: Select two different workers (W001-W008)
- Click "Create" to schedule the pickup

### 4. Delete Pickup
- Click "Delete Pickup" button
- Select a pickup ID from the dropdown
- Review the pickup details
- Click "Delete" and confirm the action

### 5. Theme Toggle
- Click the moon/sun icon in the top-right corner to switch between dark and light modes
- Your preference will be saved automatically

## 🏗️ Project Structure

```
pickup-scheduler/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── SignIn.jsx     # Sign-in page
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── CreatePickup.jsx # Create pickup form
│   │   └── DeletePickup.jsx # Delete pickup interface
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── ThemeContext.jsx   # Theme management
│   │   └── PickupContext.jsx  # Pickup data management
│   ├── App.jsx            # Main application component
│   ├── App.css            # Global styles
│   └── main.jsx           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Green gradient (waste management theme)
- **Secondary**: Blue accents
- **Dark Mode**: Professional dark theme with proper contrast
- **Light Mode**: Clean, bright interface

### UI Elements
- **Animations**: Smooth page transitions and hover effects
- **Icons**: Lucide React icons for consistency
- **Typography**: Clear hierarchy with proper font weights
- **Cards**: Shadow effects and rounded corners
- **Buttons**: Hover states and loading indicators

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Tablet**: Adapted layouts for medium screens
- **Desktop**: Full-featured interface for large screens

## 🔧 Technical Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Package Manager**: pnpm

## 📝 Development Scripts

```bash
# Start development server
pnpm run dev

# Start development server with network access
pnpm run dev --host

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linting
pnpm run lint
```

## 🚀 Production Deployment

To build the application for production:

```bash
pnpm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔮 Future Enhancements

- **Backend Integration**: Connect to Spring Boot API
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: Filter pickups by date, zone, status
- **Reporting**: Generate pickup reports and analytics
- **Notifications**: Email/SMS notifications for pickup schedules
- **Map Integration**: Visual pickup route planning
- **Mobile App**: React Native version for mobile devices

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Dependencies not installing**:
   ```bash
   # Clear cache and reinstall
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

3. **Build errors**:
   ```bash
   # Check for TypeScript errors
   pnpm run lint
   ```

## 📞 Support

For any issues or questions:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Ensure all prerequisites are installed correctly
4. Verify you're using the correct demo credentials

## 📄 License

This project is for demonstration purposes. All rights reserved.

---

**Happy Scheduling! 🗑️♻️**

