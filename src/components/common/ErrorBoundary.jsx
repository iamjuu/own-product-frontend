import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl bg-white border border-rose-100 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#181829]">Something went wrong in this section</h3>
            <p className="text-xs text-[#8a87a6] mt-1">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-2xl bg-[#6339f4] hover:bg-[#5225e6] text-white text-xs font-bold flex items-center space-x-2 mx-auto shadow-md shadow-[#6339f4]/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Section</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
