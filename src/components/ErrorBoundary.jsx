import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-600">
          <h2 className="font-bold">Algo salió mal</h2>
          <p className="text-sm mt-2">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 rounded hover:bg-red-200 text-sm"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
