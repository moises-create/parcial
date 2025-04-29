// src/components/UI/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
  </div>
);

export default LoadingSpinner;