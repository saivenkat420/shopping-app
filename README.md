# Shopping App

## Introduction

The **Shopping App** is a modern e-commerce web application built with React. Users can browse products, add items to their cart, and manage their shopping experience. The app uses **Neon PostgreSQL** for authentication and fetches product data from CCBP APIs via a secure backend proxy.

---

## What the App Can Do

- **Home Page**:
  - Displays prime deals and a full product catalog.
  - Search by name, filter by category and rating, sort by price.
  - Responsive filters sidebar (mobile-friendly).

- **Product Details Page**:
  - Full product information, reviews, and specifications.
  - Add products to cart with quantity selection.
  - Similar products section.
  - Back button for easy navigation.

- **Shopping Cart**:
  - View selected products.
  - Update quantities or remove items.
  - Cart summary with total.

- **User Authentication**:
  - Sign up (username, phone, email, password).
  - Sign in (email, password).
  - JWT stored in cookies; protected routes for products and cart.

- **Performance**:
  - Skeleton loading for products list and product details.
  - Server-side caching (Neon) for CCBP token and API responses.
  - Browser cache headers for faster repeat loads.
  - Prefetch product details on hover for instant navigation.

- **Error Handling**:
  - Error views with retry options when the API fails.

---

## How the Project is Organized

```
shopping-app/
├── api/                      # Vercel serverless API routes
│   ├── auth/                 # Signup, login (Neon)
│   ├── lib/                  # CCBP client, API cache helpers
│   ├── products/             # Products list proxy
│   ├── prime-deals/          # Prime deals proxy
│   └── product-details.js    # Product details proxy
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── AllProductsSection/   # Products grid, filters, skeletons
│   │   ├── ProductCard/          # Product preview (with prefetch)
│   │   ├── ProductCardSkeleton/  # Product list loading skeleton
│   │   ├── ProductItemDetails/   # Product detail page
│   │   ├── ProductDetailsSkeleton/ # Product detail loading skeleton
│   │   ├── PrimeDealsSection/    # Prime deals carousel
│   │   ├── FiltersGroup/         # Category, rating, search filters
│   │   ├── Header/               # Nav, cart icon
│   │   ├── Cart/                 # Cart dropdown, CartListView
│   │   ├── LoginForm/            # Sign in form
│   │   ├── SignUpForm/           # Registration form
│   │   ├── ProtectedRoute/       # Auth guard
│   │   └── ...
│   ├── context/
│   │   └── CartContext.js        # Cart state (Context API)
│   ├── utils/
│   │   └── productsCache.js      # Frontend cache for products
│   ├── App.js
│   └── index.js
├── .env                       # DATABASE_URL, JWT_SECRET
├── vercel.json                # API rewrites
└── package.json
```

---

## How to Install

1. Clone the project:
   ```sh
   git clone https://github.com/your-username/shopping-app.git
   cd shopping-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root.
   - Add:
     ```
     DATABASE_URL=postgresql://...   # Neon connection string
     JWT_SECRET=your-secret-key     # Strong random string
     ```

4. Run the app:
   - **Full-stack** (frontend + API with auth):
     ```sh
     npm run dev:full
     ```
   - **Frontend only**: `npm start` (auth API will 404; use `dev:full` for signup/login)

---

## How to Use

1. **Sign up** at `/signup` or **sign in** at `/login`.
2. **Browse products** on the home page; use filters and search.
3. **Click a product** to view details; hover to prefetch for faster loading.
4. **Add to cart** from the product details page.
5. **View cart** via the header icon; adjust quantities or remove items.

---

## API Information

### Authentication (Neon)
- **Sign Up**: `POST /api/auth/signup` — Body: `{ username, phone, email, password }`
- **Sign In**: `POST /api/auth/login` — Body: `{ email, password }`
- Users stored in Neon PostgreSQL; JWT returned in cookies.

### Product Data (CCBP Proxy)
Product data is fetched from CCBP APIs via a backend proxy. Proxy credentials (raja/raja@2021) are used server-side only and are never exposed to the frontend.

- **Products**: `GET /api/products?sort_by=&category=&title_search=&rating=`
- **Product Details**: `GET /api/products/:id`
- **Prime Deals**: `GET /api/prime-deals`

All product endpoints require a valid JWT cookie (user must be signed in).

### Caching
- **CCBP token**: Stored in Neon (`ccbp_token` table) to avoid re-login on cold starts.
- **API responses**: Cached in Neon (`api_cache` table) — 5 min for products/prime deals, 10 min for product details.
- **Browser**: `Cache-Control` headers for 2–5 min client-side caching.

---

## Vercel Deployment

1. Connect the repo to Vercel.
2. Set environment variables:
   - `DATABASE_URL` — Neon connection string
   - `JWT_SECRET` — Strong random string for JWT signing
3. Deploy; the `api/` folder is used as serverless functions.

---

## Tech Stack

- **React 18** — UI
- **React Router 5** — Routing
- **Context API** — Cart state
- **Neon PostgreSQL** — User auth, CCBP token cache, API response cache
- **Vercel** — Hosting and serverless API
- **CCBP APIs** — Product data (via proxy)
- **react-icons** — Icons
- **react-loader-spinner** — Loading (PrimeDealsSection)

---

## Future Ideas

- User reviews and ratings
- Wishlist
- Order history
- Improved mobile UI
