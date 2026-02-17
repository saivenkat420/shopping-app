import {Component} from 'react'

class ErrorBoundary extends Component {
  state = {hasError: false, error: null}

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    const {hasError, error} = this.state
    const {children} = this.props
    if (hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 style={{color: '#ef4444', marginBottom: '1rem'}}>
            Something went wrong
          </h1>
          <p style={{color: '#64748b', marginBottom: '1rem'}}>
            {error?.toString() || 'An unexpected error occurred'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
