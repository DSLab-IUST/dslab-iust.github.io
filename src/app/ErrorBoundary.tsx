import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** Last line of defence: a blank page is worse than a recovery prompt. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="container-narrow py-32 text-center">
        <h1 className="text-h2">Something went wrong</h1>
        <button
          type="button"
          className="btn btn-primary mt-8"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
