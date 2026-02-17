import {Component} from 'react'
import {BsArrowUp} from 'react-icons/bs'

import './index.css'

class BackToTop extends Component {
  state = {
    isVisible: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const isVisible = window.pageYOffset > 300
    this.setState({isVisible})
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  render() {
    const {isVisible} = this.state
    if (!isVisible) return null

    return (
      <button
        type="button"
        className="back-to-top"
        onClick={this.scrollToTop}
        aria-label="Back to top"
      >
        <BsArrowUp className="back-to-top-icon" />
      </button>
    )
  }
}

export default BackToTop
