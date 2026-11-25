import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-8 max-w-[1320px] px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-sm border border-[#ff7a1f]/35 bg-[#111111] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#ffb020]" />
              <div>
                <p className="font-mono text-xs tracking-[0.18em] text-[#ff8a1f] uppercase">
                  {this.props.sectionName ?? "Section"} Notice
                </p>
                <p className="mt-1 text-sm text-[#f5f2eb]/80">
                  Something went wrong while rendering this module. You can retry without reloading the page.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.14em] text-[#f5f2eb] uppercase transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
