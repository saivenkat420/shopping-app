import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare, BsArrowLeft} from 'react-icons/bs'

import CartContext from '../../context/CartContext'
import ToastContext from '../../context/ToastContext'
import {
  getCachedProductDetails,
  setCachedProductDetails,
} from '../../utils/productsCache'

import Header from '../Header'
import ProductDetailsSkeleton from '../ProductDetailsSkeleton'
import SimilarProductItem from '../SimilarProductItem'
import StickyAddToCart from '../StickyAddToCart'
import WishlistButton from '../WishlistButton'
import ProductBadge from '../ProductBadge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.id !== match.params.id) {
      this.getProductData()
    }
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const cached = getCachedProductDetails(id)
    const hasCache = !!cached

    if (cached) {
      this.setState({
        productData: cached.productData,
        similarProductsData: cached.similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.inProgress})
    }

    const apiUrl = `/api/products/${id}`
    const response = await fetch(apiUrl, {
      credentials: 'include',
      method: 'GET',
    })
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      setCachedProductDetails(id, {
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
      })
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    } else if (!hasCache) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="product-details-loader" data-testid="loader">
      <ProductDetailsSkeleton />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error">
      <div className="product-details-error-card">
        <img
          alt="Product not found"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="error-view-image"
        />
        <h2 className="product-not-found-heading">Product Not Found</h2>
        <p className="product-not-found-desc">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link to="/products">
          <button type="button" className="product-details-cta">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )

  handleBack = () => {
    const {history} = this.props
    history.goBack()
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => (
    <CartContext.Consumer>
      {value => {
        const {productData, quantity, similarProductsData} = this.state
        const {
          availability,
          brand,
          description,
          imageUrl,
          price,
          rating,
          title,
          totalReviews,
        } = productData
        const {addCartItem} = value
        return (
          <ToastContext.Consumer>
            {toastValue => {
              const {showToast} = toastValue
              const onClickAddToCart = () => {
                addCartItem({...productData, quantity})
                showToast(
                  `${title} added to cart (${quantity})`,
                  'success',
                  3000,
                )
              }

              const getBadge = () => {
                if (availability === 'In Stock' && price < 1000)
                  return {type: 'sale', label: 'Sale'}
                if (rating >= 4.5)
                  return {type: 'bestseller', label: 'Best Seller'}
                return null
              }

              const badge = getBadge()

              return (
                <>
                  <div className="product-details-page">
                    <button
                      type="button"
                      className="back-button"
                      onClick={this.handleBack}
                      aria-label="Go back"
                    >
                      <BsArrowLeft className="back-button-icon" />
                      Back
                    </button>
                    <nav className="product-breadcrumb">
                      <Link to="/" className="breadcrumb-link">
                        Home
                      </Link>
                      <span className="breadcrumb-sep">/</span>
                      <Link to="/products" className="breadcrumb-link">
                        Products
                      </Link>
                      <span className="breadcrumb-sep">/</span>
                      <span className="breadcrumb-current">{title}</span>
                    </nav>

                    <div className="product-details-layout">
                      <div className="product-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="product-details-image"
                        />
                        {badge && (
                          <ProductBadge type={badge.type} label={badge.label} />
                        )}
                        {availability === 'In Stock' && (
                          <span className="product-badge product-badge-success">
                            In Stock
                          </span>
                        )}
                        <WishlistButton product={productData} size={24} />
                      </div>

                      <div className="product-info-card">
                        <h1 className="product-details-title">{title}</h1>
                        <p className="product-details-brand">by {brand}</p>
                        <div className="product-details-price">
                          Rs {price}/-
                        </div>
                        <div className="product-details-rating-row">
                          <div className="product-rating-badge">
                            <span className="product-rating-value">
                              {rating}
                            </span>
                            <img
                              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                              alt="star"
                              className="product-rating-star"
                            />
                          </div>
                          <span className="product-reviews">
                            {totalReviews} Reviews
                          </span>
                        </div>
                        <p className="product-details-desc">{description}</p>
                        <div className="product-meta">
                          <div className="product-meta-row">
                            <span className="product-meta-label">
                              Availability
                            </span>
                            <span className="product-meta-value">
                              {availability}
                            </span>
                          </div>
                          <div className="product-meta-row">
                            <span className="product-meta-label">Brand</span>
                            <span className="product-meta-value">{brand}</span>
                          </div>
                        </div>
                        <div className="product-quantity-section">
                          <span className="quantity-label">Quantity</span>
                          <div className="quantity-controls">
                            <button
                              type="button"
                              className="quantity-btn"
                              onClick={this.onDecrementQuantity}
                              data-testid="minus"
                              aria-label="Decrease quantity"
                            >
                              <BsDashSquare className="quantity-icon" />
                            </button>
                            <span
                              className="quantity-value"
                              data-testid="quantity"
                            >
                              {quantity}
                            </span>
                            <button
                              type="button"
                              className="quantity-btn"
                              onClick={this.onIncrementQuantity}
                              data-testid="plus"
                              aria-label="Increase quantity"
                            >
                              <BsPlusSquare className="quantity-icon" />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="product-add-to-cart"
                          onClick={onClickAddToCart}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {similarProductsData.length > 0 && (
                      <section className="similar-products-section">
                        <h2 className="similar-products-title">
                          You May Also Like
                        </h2>
                        <div className="similar-products-scroll">
                          <ul className="similar-products-list">
                            {similarProductsData.map(eachSimilarProduct => (
                              <SimilarProductItem
                                productDetails={eachSimilarProduct}
                                key={eachSimilarProduct.id}
                              />
                            ))}
                          </ul>
                        </div>
                      </section>
                    )}
                  </div>
                  <StickyAddToCart
                    productData={productData}
                    quantity={quantity}
                    onAddToCart={onClickAddToCart}
                  />
                </>
              )
            }}
          </ToastContext.Consumer>
        )
      }}
    </CartContext.Consumer>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-wrapper">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default withRouter(ProductItemDetails)
