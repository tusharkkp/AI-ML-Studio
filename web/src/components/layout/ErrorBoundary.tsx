import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertOctagon, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showTrace: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showTrace: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Keep in browser console for developers while keeping user experience clean
    if (typeof console !== 'undefined' && console.error) {
      console.error('ErrorBoundary captured error:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showTrace: false,
    });
    window.location.reload();
  };

  private toggleTrace = () => {
    this.setState((prev) => ({ showTrace: !prev.showTrace }));
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[60vh] flex items-center justify-center p-6 sm:p-12 font-sans"
        >
          <Card className="max-w-xl w-full p-8 rounded-2xl border border-orange-50/20 bg-neutral-950/90 backdrop-blur-xl shadow-none space-y-6 text-center">
            <div className="size-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertOctagon className="size-7" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="danger">Simulation Fault</Badge>
                <Badge variant="outline">Client State Isolated</Badge>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-foreground">
                Laboratory execution encountered an issue
              </h2>

              <p className="text-xs sm:text-sm text-neutral-400 font-montserrat leading-relaxed">
                An unexpected mathematical or rendering exception occurred. Your local learning
                progress is safe in{' '}
                <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
                  client browser storage
                </span>
                .
              </p>
            </div>

            {/* Error Message Box */}
            {this.state.error && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-left font-mono text-xs text-red-300 overflow-x-auto">
                <span className="text-[10px] text-red-400/80 uppercase tracking-wider block font-sans mb-1">
                  Exception:
                </span>
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="w-full sm:w-auto text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset and reload module</span>
              </Button>

              <a href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-xs flex items-center justify-center gap-2"
                >
                  <Home className="size-3.5" />
                  <span>Return home</span>
                </Button>
              </a>
            </div>

            {/* Collapsible Technical Stack Trace */}
            {this.state.errorInfo && (
              <div className="pt-4 border-t border-orange-50/10 text-left">
                <button
                  type="button"
                  onClick={this.toggleTrace}
                  className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors"
                >
                  <span>Technical call trace</span>
                  {this.state.showTrace ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>

                {this.state.showTrace && (
                  <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-orange-50/10 text-[10px] font-mono text-neutral-400 overflow-x-auto max-h-48 leading-relaxed">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
