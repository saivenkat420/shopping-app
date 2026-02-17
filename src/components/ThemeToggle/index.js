import {BsSun, BsMoon} from 'react-icons/bs'
import ThemeContext from '../../context/ThemeContext'

import './index.css'

const ThemeToggle = () => (
  <ThemeContext.Consumer>
    {value => {
      const {theme, toggleTheme} = value
      return (
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <BsMoon className="theme-icon" />
          ) : (
            <BsSun className="theme-icon" />
          )}
        </button>
      )
    }}
  </ThemeContext.Consumer>
)

export default ThemeToggle
