import './index.css'

const ProductCardSkeleton = () => (
  <li className="product-item product-skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-title" />
    <div className="skeleton-brand" />
    <div className="skeleton-details">
      <div className="skeleton-price" />
      <div className="skeleton-rating" />
    </div>
  </li>
)

export default ProductCardSkeleton
