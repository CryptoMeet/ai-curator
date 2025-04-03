'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleTryAgain = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto my-8 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Something went wrong</h2>
          <details className="mt-4">
            <summary className="cursor-pointer text-red-600 hover:text-red-700">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-red-100 rounded text-sm text-red-900 overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={this.handleTryAgain}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
