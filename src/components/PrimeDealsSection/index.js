import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = '/api/prime-deals'
    const response = await fetch(apiUrl, {
      credentials: 'include',
      method: 'GET',
    })
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        primeDeals: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderPrimeDealsListView = () => {
    const {primeDeals} = this.state
    return (
      <section className="primedeals-section">
        <div className="primedeals-header">
          <span className="primedeals-badge">Exclusive</span>
          <h2 className="primedeals-heading">Prime Deals</h2>
          <p className="primedeals-desc">Limited-time offers on top products</p>
        </div>
        <div className="primedeals-scroll">
          <ul className="primedeals-list">
            {primeDeals.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </section>
    )
  }

  renderPrimeDealsFailureView = () => (
    <section className="primedeals-section primedeals-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="Register for Prime to get exclusive deals"
        className="register-prime-img"
      />
    </section>
  )

  renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#6366f1" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
