import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary: getDerivedStateFromError called with error:', error);
    console.error('ErrorBoundary: Error message:', error.message);
    console.error('ErrorBoundary: Error stack:', error.stack);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary: componentDidCatch called');
    console.error('ErrorBoundary: Error:', error);
    console.error('ErrorBoundary: Error message:', error.message);
    console.error('ErrorBoundary: Error stack:', error.stack);
    console.error('ErrorBoundary: Error info:', errorInfo);
    console.error('ErrorBoundary: Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      console.error('ErrorBoundary: Rendering error fallback UI');
      console.error('ErrorBoundary: Error state:', this.state.error);
      
      return (
        <div className="error-boundary-container p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            An error occurred while rendering this component. Please refresh the page or try again later.
          </p>
          {this.state.error && (
            <details className="bg-red-100 p-3 rounded border">
              <summary className="cursor-pointer text-red-700 font-medium">Error Details</summary>
              <pre className="mt-2 text-sm text-red-600 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button 
            onClick={() => {
              console.log('ErrorBoundary: Reset button clicked');
              this.setState({ hasError: false, error: null });
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;