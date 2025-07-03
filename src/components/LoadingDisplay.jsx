import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingDisplay = ({ 
  message = "Loading...", 
  size = "default" // "small", "default", "large"
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-lg",
    large: "text-xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[200px] p-4"
    >
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto mb-4 text-green-600 dark:text-green-400`} />
        <p className={`${textSizeClasses[size]} text-muted-foreground`}>
          {message}
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingDisplay;

