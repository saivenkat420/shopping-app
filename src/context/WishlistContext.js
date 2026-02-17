import React, {Component} from 'react'
import Cookies from 'js-cookie'

const WishlistContext = React.createContext({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
})

export class WishlistProvider extends Component {
  state = {
    wishlist: [],
  }

  componentDidMount() {
    const wishlist = this.loadWishlist()
    if (wishlist.length > 0) {
      this.setState({wishlist})
    }
  }

  loadWishlist = () => {
    try {
      const saved = Cookies.get('wishlist')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading wishlist:', error)
      return []
    }
  }

  saveWishlist = wishlist => {
    Cookies.set('wishlist', JSON.stringify(wishlist), {expires: 365})
  }

  addToWishlist = product => {
    this.setState(
      prevState => {
        const {wishlist} = prevState
        if (wishlist.find(item => item.id === product.id)) {
          return prevState
        }
        const newWishlist = [...wishlist, product]
        this.saveWishlist(newWishlist)
        return {wishlist: newWishlist}
      },
      () => {
        const {onAdd} = this.props
        if (onAdd) {
          onAdd()
        }
      },
    )
  }

  removeFromWishlist = productId => {
    this.setState(prevState => {
      const {wishlist} = prevState
      const newWishlist = wishlist.filter(item => item.id !== productId)
      this.saveWishlist(newWishlist)
      return {wishlist: newWishlist}
    })
  }

  isInWishlist = productId => {
    const {wishlist} = this.state
    return wishlist.some(item => item.id === productId)
  }

  toggleWishlist = product => {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id)
    } else {
      this.addToWishlist(product)
    }
  }

  render() {
    const {wishlist} = this.state
    const {children} = this.props
    return (
      <WishlistContext.Provider
        value={{
          wishlist,
          addToWishlist: this.addToWishlist,
          removeFromWishlist: this.removeFromWishlist,
          isInWishlist: this.isInWishlist,
          toggleWishlist: this.toggleWishlist,
        }}
      >
        {children}
      </WishlistContext.Provider>
    )
  }
}

export default WishlistContext
