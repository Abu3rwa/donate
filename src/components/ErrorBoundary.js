import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here
    // console.error(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center bg-red-50 dark:bg-red-900 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-200 mb-2">
            حدث خطأ غير متوقع
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            {this.state.error?.message || "يرجى المحاولة مرة أخرى لاحقاً."}
          </p>
          <button className="btn-primary" onClick={this.handleRetry}>
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
