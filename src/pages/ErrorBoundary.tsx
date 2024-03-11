import { Component, ErrorInfo, ReactNode } from 'react'

export type FallbackFn = (error: Error) => ReactNode;
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: FallbackFn;
}

interface State {
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  static displayName = 'ErrorBoundary'

  readonly state = {} as State

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { name, message } = error
    const { componentStack } = errorInfo
    console.log([
      {
        timestamp: Date.now(),
        data: {
          error: { name, message, componentStack }
        }
      }
    ])
  }

  render() {
    const { children, fallback } = this.props
    const { error } = this.state

    if (error && fallback) {
      return fallback(error)
    } else if (error) {
      return <div>{error.message}</div>
    } else {
      return children
    }
  }
}
