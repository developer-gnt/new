import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, House } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('AppErrorBoundary caught an uncaught React error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/admin/dashboard';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconCircle}>
              <AlertCircle size={32} color="#DC2626" />
            </div>

            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.subtitle}>
              An unexpected error occurred while rendering this view. Your data is safe.
            </p>

            {this.state.error && (
              <div style={styles.errorBox}>
                <div style={styles.errorMessage}>{this.state.error.toString()}</div>
                {this.state.error.stack && (
                  <pre style={styles.errorStack}>{this.state.error.stack.split('\n').slice(0, 5).join('\n')}</pre>
                )}
              </div>
            )}

            <div style={styles.actions}>
              <button onClick={this.handleReload} style={styles.retryBtn}>
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
              <button onClick={this.handleGoHome} style={styles.homeBtn}>
                <House size={16} />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF7F0',
    padding: '24px',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    maxWidth: '560px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #DCE4EC',
    boxShadow: '0 8px 30px rgba(1, 31, 57, 0.08)',
    padding: '36px',
    textAlign: 'center',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#FDEEEF',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '24px',
    color: '#011F39',
    margin: '0 0 10px 0',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '14px',
    color: '#34516D',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FED7D7',
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'left',
    marginBottom: '24px',
    overflowX: 'auto',
  },
  errorMessage: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#9B2C2C',
    fontFamily: 'monospace',
    marginBottom: '6px',
  },
  errorStack: {
    fontSize: '11px',
    color: '#742A2A',
    fontFamily: 'monospace',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '12px',
    backgroundColor: '#FAD465',
    color: '#011F39',
    border: 'none',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
  },
  homeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '12px',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};

