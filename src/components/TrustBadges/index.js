import {FiShield, FiTruck, FiRefreshCw, FiCreditCard} from 'react-icons/fi'

import './index.css'

const TrustBadges = () => (
  <section className="trust-badges">
    <div className="trust-badge">
      <FiShield className="trust-icon" />
      <div className="trust-content">
        <h4 className="trust-title">Secure Payment</h4>
        <p className="trust-desc">100% secure transactions</p>
      </div>
    </div>
    <div className="trust-badge">
      <FiTruck className="trust-icon" />
      <div className="trust-content">
        <h4 className="trust-title">Free Shipping</h4>
        <p className="trust-desc">On orders over Rs 500</p>
      </div>
    </div>
    <div className="trust-badge">
      <FiRefreshCw className="trust-icon" />
      <div className="trust-content">
        <h4 className="trust-title">Easy Returns</h4>
        <p className="trust-desc">30-day return policy</p>
      </div>
    </div>
    <div className="trust-badge">
      <FiCreditCard className="trust-icon" />
      <div className="trust-content">
        <h4 className="trust-title">Best Prices</h4>
        <p className="trust-desc">Price match guarantee</p>
      </div>
    </div>
  </section>
)

export default TrustBadges
