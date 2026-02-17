import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'
import WishlistContext from '../../context/WishlistContext'

import './index.css'

const WishlistButton = ({product, size = 20}) => (
  <WishlistContext.Consumer>
    {value => {
      const {isInWishlist, toggleWishlist} = value
      const inWishlist = isInWishlist(product.id)

      const handleClick = e => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(product)
      }

      return (
        <button
          type="button"
          className={`wishlist-btn ${inWishlist ? 'wishlist-active' : ''}`}
          onClick={handleClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? (
            <AiFillHeart size={size} />
          ) : (
            <AiOutlineHeart size={size} />
          )}
        </button>
      )
    }}
  </WishlistContext.Consumer>
)

export default WishlistButton
