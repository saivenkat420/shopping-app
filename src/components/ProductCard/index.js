import {Link} from 'react-router-dom'

import {
  getCachedProductDetails,
  setCachedProductDetails,
} from '../../utils/productsCache'

import './index.css'

const ProductCard = props => {
  const {productData} = props
  const {title, brand, imageUrl, rating, price, id} = productData

  const prefetchDetails = () => {
    if (getCachedProductDetails(id)) return
    fetch(`/api/products/${id}`, {credentials: 'include'})
      .then(r => r.ok && r.json())
      .then(data => {
        if (!data) return
        const fmt = d => ({
          availability: d.availability,
          brand: d.brand,
          description: d.description,
          id: d.id,
          imageUrl: d.image_url,
          price: d.price,
          rating: d.rating,
          title: d.title,
          totalReviews: d.total_reviews,
        })
        setCachedProductDetails(id, {
          productData: fmt(data),
          similarProductsData: (data.similar_products || []).map(fmt),
        })
      })
      .catch(() => {})
  }

  return (
    <li className="product-item">
      <Link
        to={`/products/${id}`}
        className="link-item"
        onMouseEnter={prefetchDetails}
        onFocus={prefetchDetails}
      >
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
export default ProductCard
