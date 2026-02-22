import React from "react";
import { Alert, Stack, Button } from "@mantine/core";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert
            icon={<AlertCircle size={16} />}
            color="red"
            title="Something went wrong"
            withCloseButton
            onClose={() => this.handleReset()}
          >
            <Stack gap="sm">
              <div>
                We encountered an error while loading your dashboard. Please try
                refreshing the page.
              </div>
              {process.env.NODE_ENV === "development" && (
                <details>
                  <summary className="cursor-pointer font-mono text-xs">
                    Error details
                  </summary>
                  <pre className="mt-2 overflow-auto bg-gray-100 p-2 text-xs">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              )}
              <Button
                size="sm"
                leftSection={<RefreshCw size={14} />}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Stack>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}
