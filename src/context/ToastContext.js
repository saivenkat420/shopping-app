import React, {Component} from 'react'
import './ToastContext.css'

const ToastContext = React.createContext({
  showToast: () => {},
})

export class ToastProvider extends Component {
  state = {
    toasts: [],
  }

  showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    const toast = {id, message, type}
    this.setState(prevState => ({
      toasts: [...prevState.toasts, toast],
    }))

    setTimeout(() => {
      this.removeToast(id)
    }, duration)
  }

  removeToast = id => {
    this.setState(prevState => ({
      toasts: prevState.toasts.filter(toast => toast.id !== id),
    }))
  }

  render() {
    const {toasts} = this.state
    const {children} = this.props
    return (
      <ToastContext.Provider
        value={{
          showToast: this.showToast,
        }}
      >
        {children}
        <div className="toast-container">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              onClick={() => this.removeToast(toast.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  this.removeToast(toast.id)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close toast"
            >
              <span className="toast-message">{toast.message}</span>
              <button type="button" className="toast-close" aria-label="Close">
                ×
              </button>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    )
  }
}

export default ToastContext
