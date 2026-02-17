import './index.css'

const ProductDetailsSkeleton = () => (
  <div className="product-details-skeleton" data-testid="loader">
    <div className="skeleton-back-btn" />
    <div className="skeleton-breadcrumb" />

    <div className="product-details-skeleton-layout">
      <div className="skeleton-image" />
      <div className="skeleton-info-card">
        <div className="skeleton-title" />
        <div className="skeleton-brand" />
        <div className="skeleton-price" />
        <div className="skeleton-rating-row">
          <div className="skeleton-rating" />
          <div className="skeleton-reviews" />
        </div>
        <div className="skeleton-desc" />
        <div className="skeleton-desc short" />
        <div className="skeleton-meta">
          <div className="skeleton-meta-row" />
          <div className="skeleton-meta-row" />
        </div>
        <div className="skeleton-quantity">
          <div className="skeleton-quantity-label" />
          <div className="skeleton-quantity-controls" />
        </div>
        <div className="skeleton-add-btn" />
      </div>
    </div>

    <div className="skeleton-similar-section">
      <div className="skeleton-similar-title" />
      <div className="skeleton-similar-cards">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-similar-card" />
        ))}
      </div>
    </div>
  </div>
)

export default ProductDetailsSkeleton
