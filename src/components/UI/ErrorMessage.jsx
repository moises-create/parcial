// src/components/UI/ErrorMessage.jsx
import React from "react";

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
    <p className="text-red-600 mb-2">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Reintentar
      </button>
    )}
  </div>
);

export default ErrorMessage;
