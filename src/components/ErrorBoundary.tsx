import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Sonraki render için state güncellenmesi
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Hata loglaması buradan yapılabilir
    console.error('Error Boundary yakaladı:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Özel fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Varsayılan hata mesajı
      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-800 text-white">
          <h2 className="text-2xl font-bold mb-4">Bir şeyler yanlış gitti</h2>
          <p className="text-gray-300 mb-6">
            {this.state.error?.message || 'Beklenmeyen bir hata oluştu.'}
          </p>
          <Button onClick={this.resetErrorBoundary}>Tekrar Dene</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 