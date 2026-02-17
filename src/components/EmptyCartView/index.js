import {Link} from 'react-router-dom'
import {FiShoppingBag} from 'react-icons/fi'

import './index.css'

const EmptyCartView = () => (
  <div className="cart-empty-view-container">
    <div className="cart-empty-icon-wrapper">
      <FiShoppingBag className="cart-empty-icon" />
    </div>
    <h1 className="cart-empty-heading">Your Shopping Cart is Empty</h1>
    <p className="cart-empty-description">
      Looks like you haven&apos;t added anything to your cart yet. Start
      shopping to fill it up!
    </p>
    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Start Shopping
      </button>
    </Link>
  </div>
)

export default EmptyCartView
