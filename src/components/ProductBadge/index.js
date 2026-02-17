import './index.css'

const ProductBadge = ({type, label}) => {
  if (!type || !label) return null

  return <span className={`product-badge product-badge-${type}`}>{label}</span>
}

export default ProductBadge
