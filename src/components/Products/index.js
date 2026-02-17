import AllProductsSection from '../AllProductsSection'
import PrimeDealsSection from '../PrimeDealsSection'

import Header from '../Header'

import './index.css'

const Products = () => (
  <>
    <Header />
    <div className="products-page">
      <div className="products-page-hero">
        <h1 className="products-page-title">Shop All Products</h1>
        <p className="products-page-subtitle">
          Discover our curated collection of fashion, electronics, and more
        </p>
      </div>
      <div className="product-sections">
        <PrimeDealsSection />
        <AllProductsSection />
      </div>
    </div>
  </>
)

export default Products
