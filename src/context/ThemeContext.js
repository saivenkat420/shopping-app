import React, {Component} from 'react'
import Cookies from 'js-cookie'

const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export class ThemeProvider extends Component {
  state = {
    theme: 'light',
  }

  componentDidMount() {
    try {
      const saved = Cookies.get('theme')
      const theme = saved === 'dark' ? 'dark' : 'light'
      this.setState({theme})
      this.applyTheme(theme)
    } catch (error) {
      console.error('Error loading theme:', error)
      this.applyTheme('light')
    }
  }

  applyTheme = theme => {
    try {
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme)
      }
      Cookies.set('theme', theme, {expires: 365})
    } catch (error) {
      console.error('Error applying theme:', error)
    }
  }

  toggleTheme = () => {
    this.setState(prevState => {
      const newTheme = prevState.theme === 'light' ? 'dark' : 'light'
      this.applyTheme(newTheme)
      return {theme: newTheme}
    })
  }

  render() {
    const {theme} = this.state
    const {children} = this.props
    return (
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme: this.toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    )
  }
}

export default ThemeContext
