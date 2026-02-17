import {Component} from 'react'
import {BsCartPlus} from 'react-icons/bs'
import CartContext from '../../context/CartContext'

import './index.css'

class StickyAddToCart extends Component {
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
    const scrollY = window.pageYOffset
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const isVisible =
      scrollY > 200 && scrollY < documentHeight - windowHeight - 100
    this.setState({isVisible})
  }

  render() {
    const {isVisible} = this.state
    const {productData, quantity, onAddToCart} = this.props

    if (!isVisible || !productData) return null

    return (
      <CartContext.Consumer>
        {() => (
          <div className="sticky-add-to-cart">
            <div className="sticky-product-info">
              <img
                src={productData.imageUrl}
                alt={productData.title}
                className="sticky-product-image"
              />
              <div className="sticky-product-details">
                <p className="sticky-product-title">{productData.title}</p>
                <p className="sticky-product-price">Rs {productData.price}/-</p>
              </div>
            </div>
            <button
              type="button"
              className="sticky-add-btn"
              onClick={onAddToCart}
            >
              <BsCartPlus className="sticky-add-icon" />
              Add to Cart ({quantity})
            </button>
          </div>
        )}
      </CartContext.Consumer>
    )
  }
}

export default StickyAddToCart
