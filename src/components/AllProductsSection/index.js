import {Component} from 'react'

import FiltersGroup from '../FiltersGroup'
import {getCachedProducts, setCachedProducts} from '../../utils/productsCache'
import ProductCard from '../ProductCard'
import ProductCardSkeleton from '../ProductCardSkeleton'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {name: 'Clothing', categoryId: '1'},
  {name: 'Electronics', categoryId: '2'},
  {name: 'Appliances', categoryId: '3'},
  {name: 'Grocery', categoryId: '4'},
  {name: 'Toys', categoryId: '5'},
]

const sortbyOptions = [
  {optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)'},
  {optionId: 'PRICE_LOW', displayText: 'Price (Low-High)'},
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    searchInput: '',
    activeRatingId: '',
    filtersOpen: false,
  }

  componentDidMount() {
    this.getProducts(false)
  }

  getProducts = async (showLoader = true) => {
    const {activeOptionId, activeCategoryId, searchInput, activeRatingId} =
      this.state
    const params = {
      activeOptionId,
      activeCategoryId,
      searchInput,
      activeRatingId,
    }

    const cached = getCachedProducts(params)
    if (cached) {
      this.setState({
        productsList: cached,
        apiStatus: apiStatusConstants.success,
      })
      if (!showLoader) return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `/api/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const response = await fetch(apiUrl, {
      credentials: 'include',
      method: 'GET',
    })
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      setCachedProducts(params, updatedData)
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="all-products-main">
      <ul className="products-grid">
        {Array.from({length: 8}, (_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </ul>
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <div className="products-error-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          alt="Error"
          className="products-failure-img"
        />
        <h2 className="product-failure-heading-text">
          Oops! Something Went Wrong
        </h2>
        <p className="products-failure-description">
          We are having some trouble processing your request. Please try again.
        </p>
      </div>
    </div>
  )

  renderProductsListView = () => {
    const {productsList, activeOptionId} = this.state
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-main">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-grid">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <div className="no-products-card">
          <div className="no-products-icon-wrapper">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="no-products-heading">No Products Found</h2>
          <p className="no-products-description">
            We couldn&apos;t find any products matching your search. Try
            adjusting your filters or search terms to discover more items.
          </p>
        </div>
      </div>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeSortby = activeOptionId =>
    this.setState({activeOptionId}, () => this.getProducts(true))
  clearFilters = () =>
    this.setState(
      {searchInput: '', activeCategoryId: '', activeRatingId: ''},
      () => this.getProducts(true),
    )
  changeRating = activeRatingId =>
    this.setState({activeRatingId}, () => this.getProducts(true))
  changeCategory = activeCategoryId =>
    this.setState({activeCategoryId}, () => this.getProducts(true))
  enterSearchInput = () => this.getProducts(true)
  changeSearchInput = searchInput => this.setState({searchInput})
  toggleFilters = () =>
    this.setState(prev => ({filtersOpen: !prev.filtersOpen}))

  render() {
    const {activeCategoryId, searchInput, activeRatingId, filtersOpen} =
      this.state

    return (
      <section className="all-products-section">
        {filtersOpen && (
          <div
            className="filters-overlay"
            onClick={this.toggleFilters}
            onKeyDown={e => e.key === 'Escape' && this.toggleFilters()}
            role="button"
            tabIndex={0}
            aria-label="Close filters"
          />
        )}
        <aside
          className={`filters-sidebar ${filtersOpen ? 'filters-open' : ''}`}
        >
          <div className="filters-sidebar-header">
            <h3 className="filters-sidebar-title">Filters</h3>
            <button
              type="button"
              className="filters-close-btn"
              onClick={this.toggleFilters}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>
          <FiltersGroup
            searchInput={searchInput}
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            changeSearchInput={this.changeSearchInput}
            enterSearchInput={this.enterSearchInput}
            activeCategoryId={activeCategoryId}
            activeRatingId={activeRatingId}
            changeCategory={this.changeCategory}
            changeRating={this.changeRating}
            clearFilters={this.clearFilters}
          />
        </aside>
        <div className="all-products-content">
          <button
            type="button"
            className="filters-toggle-btn"
            onClick={this.toggleFilters}
            aria-label="Toggle filters"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Filters
          </button>
          {this.renderAllProducts()}
        </div>
      </section>
    )
  }
}

export default AllProductsSection
