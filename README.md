# Shopivo — Multi-Vendor E-Commerce Platform

Shopivo is a full-stack **multi-vendor e-commerce platform** built with the MERN stack. It allows buyers to browse products, manage their cart, place orders using **Cash on Delivery (COD)**, and track their orders.

Sellers can apply to become vendors, manage their products and inventory, and process orders containing their products.

Administrators can manage users, sellers, products, categories, and orders through a dedicated admin dashboard.

The project is designed as a **portfolio and learning project** focused on implementing the core workflow of a real-world multi-vendor marketplace.

---

## Features

### Buyer Features

* User registration and login
* JWT-based authentication
* Protected routes
* User profile management
* Browse products
* Product search
* Category filtering
* Seller filtering
* Price filtering
* Product sorting
* Pagination
* Product details
* Add products to cart
* Update cart quantities
* Remove products from cart
* Stock validation
* Multi-vendor cart
* Checkout
* Cash on Delivery
* Order placement
* Order history
* Order details
* Order status tracking

### Seller Features

* Seller application
* Seller approval workflow
* Seller dashboard
* Seller profile
* Product creation
* Multiple product image uploads
* Cloudinary image storage
* Product editing
* Product deactivation
* Stock management
* Product ownership validation
* Seller product listing
* Seller-specific order management
* Seller-specific order details
* Order status updates

### Admin Features

* Admin authentication
* Admin dashboard
* Platform statistics
* Total users
* Total sellers
* Total products
* Total orders
* Total revenue
* User management
* Seller management
* Seller approval/rejection
* Seller suspension
* Product management
* Category management
* Order management
* Order details
* Order status management

### Security Features

* JWT authentication
* Role-based authorization
* Password hashing with bcrypt
* Protected API routes
* Request validation
* Helmet security headers
* CORS configuration
* API rate limiting
* Environment variables
* Centralized error handling
* 404 handling

---

# Tech Stack

## Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Context API
* Axios
* ESLint

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Express Validator
* Cloudinary
* Multer
* Helmet
* CORS
* Morgan
* Express Rate Limit
* dotenv

## Deployment

The application can be deployed using:

* Vercel for the frontend
* Render / Railway / similar Node.js hosting for the backend
* MongoDB Atlas for the database
* Cloudinary for product images

---

# Project Architecture

Shopivo follows a standard full-stack architecture:

```text
                    ┌──────────────────────┐
                    │       Buyer          │
                    │                      │
                    │ Browse / Cart /      │
                    │ Checkout / Orders    │
                    └──────────┬───────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│                                                     │
│ Pages → Components → Services → API Requests       │
└────────────────────────┬────────────────────────────┘
                         │
                         │ HTTP / REST API
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Express Backend                    │
│                                                     │
│ Routes → Middleware → Controllers → Models         │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
                 ┌─────────────────┐
                 │     MongoDB     │
                 │                 │
                 │ Users           │
                 │ Sellers         │
                 │ Products        │
                 │ Categories      │
                 │ Carts           │
                 │ Orders          │
                 └─────────────────┘
                         │
                         ▼
                 ┌─────────────────┐
                 │   Cloudinary    │
                 │                 │
                 │ Product Images  │
                 └─────────────────┘
```

---

# Project Structure

```text
```
└── 📁Shopivo
    └── 📁backend
        └── 📁config
            ├── cloudinary.js
            ├── db.js
            ├── stripe.js
        └── 📁controllers
            ├── adminController.js
            ├── authController.js
            ├── cartController.js
            ├── categoryController.js
            ├── orderController.js
            ├── paymentController.js
            ├── productController.js
            ├── sellerController.js
            ├── userController.js
        └── 📁images
            ├── backpacks.jpg
            ├── computerMice.jpg
            ├── headphones.jpg
            ├── keyboard.jpg
            ├── laptop.jpg
            ├── mouse.jpg
        └── 📁middleware
            ├── authMiddleware.js
            ├── errorMiddleware.js
            ├── notFoundMiddleware.js
            ├── roleMiddleware.js
            ├── uploadMiddleware.js
            ├── validateMiddleware.js
        └── 📁models
            ├── Cart.js
            ├── Category.js
            ├── Order.js
            ├── Payment.js
            ├── Product.js
            ├── Seller.js
            ├── User.js
        └── 📁routes
            ├── adminRoutes.js
            ├── authRoutes.js
            ├── cartRoutes.js
            ├── categoryRoutes.js
            ├── orderRoutes.js
            ├── paymentRoutes.js
            ├── productRoutes.js
            ├── sellerRoutes.js
            ├── userRoutes.js
        └── 📁services
        └── 📁utils
            ├── generateToken.js
            ├── seedAdmin.js
            ├── uploadToCloudinary.js
        └── 📁validators
            ├── authValidator.js
            ├── cartValidator.js
            ├── categoryValidator.js
            ├── orderValidator.js
            ├── productValidator.js
            ├── reviewValidator.js
            ├── sellerValidator.js
        ├── .env
        ├── .env.example
        ├── .gitignore
        ├── package-lock.json
        ├── package.json
        ├── README.md
        ├── seed.js
        ├── server.js
    └── 📁frontend
        └── 📁public
            ├── favicon.svg
        └── 📁src
            └── 📁assets
                ├── hero.png
                ├── react.svg
                ├── vite.svg
            └── 📁components
                └── 📁home
                    ├── BecomeSeller.jsx
                    ├── Categories.jsx
                    ├── Footer.jsx
                    ├── Hero.jsx
                    ├── MarketplaceBanner.jsx
                    ├── Navbar.jsx
                    ├── NewArrivals.jsx
                    ├── ProductCard.jsx
                    ├── PromotionBar.jsx
                    ├── TrendingProducts.jsx
                └── 📁ui
                    ├── Icon.jsx
                ├── ProtectedRoute.jsx
            └── 📁context
                ├── AuthContext.jsx
            └── 📁pages
                └── 📁admin
                    ├── AdminDashboard.jsx
                    ├── AdminOrderDetails.jsx
                    ├── AdminOrders.jsx
                    ├── AdminProducts.jsx
                    ├── AdminSellers.jsx
                    ├── AdminUsers.jsx
                └── 📁auth
                    ├── Login.jsx
                    ├── Signup.jsx
                └── 📁payment
                    ├── PaymentCancel.jsx
                    ├── PaymentSuccess.jsx
                └── 📁products
                    ├── ProductDetails.jsx
                └── 📁seller
                    ├── AddProduct.jsx
                    ├── EditProduct.jsx
                    ├── MyProducts.jsx
                    ├── SellerApplication.jsx
                    ├── SellerDashboard.jsx
                    ├── SellerOrderDetails.jsx
                    ├── SellerOrders.jsx
                ├── Cart.jsx
                ├── Checkout.jsx
                ├── Home.jsx
                ├── OrderDetails.jsx
                ├── Orders.jsx
                ├── Products.jsx
                ├── Profile.jsx
            └── 📁services
                ├── adminService.js
                ├── api.js
                ├── authService.js
                ├── cartService.js
                ├── categoryService.js
                ├── orderService.js
                ├── paymentService.js
                ├── productService.js
                ├── sellerService.js
                ├── userService.js
            ├── App.jsx
            ├── index.css
            ├── main.jsx
        ├── .env
        ├── .env.example
        ├── .gitignore
        ├── .oxlintrc.json
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── README.md
        ├── vercel.json
        ├── vite.config.js
    └── README.md

---

# User Roles

Shopivo has three primary roles.

| Role   | Access                                    |
| ------ | ----------------------------------------- |
| Buyer  | Shopping, cart, checkout, orders, profile |
| Seller | Products, inventory, seller orders        |
| Admin  | Complete platform management              |

Seller-specific functionality requires the seller account to be **approved**.

---

# Authentication

Shopivo uses JWT-based authentication.

The authentication flow is:

```text
Register
   │
   ▼
Login
   │
   ▼
JWT Token
   │
   ▼
Frontend Authentication State
   │
   ▼
Protected API Request
   │
   ▼
authMiddleware
   │
   ▼
User Identification
   │
   ▼
roleMiddleware
   │
   ▼
Protected Controller
```

Protected API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Buyer Workflow

A typical buyer workflow is:

```text
Register / Login
       │
       ▼
Browse Products
       │
       ▼
View Product
       │
       ▼
Add to Cart
       │
       ▼
Update Cart
       │
       ▼
Checkout
       │
       ▼
Cash on Delivery
       │
       ▼
Create Order
       │
       ▼
Order Confirmation
       │
       ▼
Track Order
```

---

# Seller Workflow

Seller onboarding follows:

```text
Buyer Account
      │
      ▼
Seller Application
      │
      ▼
Pending
      │
      ▼
Admin Review
      │
      ├───────────────┐
      ▼               ▼
  Approved         Rejected
      │
      ▼
Seller Dashboard
      │
      ├── Add Product
      ├── Edit Product
      ├── Manage Stock
      └── Manage Orders
```

Only approved sellers can create and manage marketplace products.

---

# Multi-Vendor Order Architecture

Shopivo supports purchasing products from multiple sellers in a single checkout.

For example:

```text
Buyer
  │
  └── Order
       │
       ├── Seller A
       │    ├── Product 1
       │    └── Product 2
       │
       └── Seller B
            ├── Product 3
            └── Product 4
```

The backend maintains the parent order while separating seller-specific order information.

This allows:

* One checkout for the buyer
* Multiple sellers in one order
* Seller-specific order access
* Seller-specific order management
* Seller order isolation

---

# API Overview

The backend API is organized into the following resources:

```text
/api
│
├── /auth
├── /users
├── /sellers
├── /categories
├── /products
├── /cart
├── /orders
└── /admin
```

---

## Authentication API

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## User API

```http
GET   /api/users/profile
PATCH /api/users/profile
```

Authentication required.

---

## Seller API

```http
POST /api/sellers
GET  /api/sellers/me
```

Additional seller endpoints are protected using authentication and role-based authorization.

---

## Category API

```http
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

The exact authorization requirements depend on the operation.

---

## Product API

### Get Products

```http
GET /api/products
```

Supported query parameters:

```text
search
category
seller
minPrice
maxPrice
sort
page
limit
```

Example:

```http
GET /api/products?search=phone&minPrice=100&maxPrice=1000&page=1&limit=12
```

### Get Product

```http
GET /api/products/:id
```

### Get Seller Products

```http
GET /api/products/seller/my-products
```

Requires an approved seller account.

### Create Product

```http
POST /api/products
```

Uses:

```text
multipart/form-data
```

Supported fields include:

```text
name
description
category
price
discount
stock
sku
variants
specifications
images
```

### Update Product

```http
PATCH /api/products/seller/:id
```

Requires seller authentication and product ownership.

### Update Stock

```http
PATCH /api/products/seller/:id/stock
```

### Deactivate Product

```http
DELETE /api/products/seller/:id
```

Seller deletion deactivates the product rather than permanently removing it.

---

# Cart API

```http
GET    /api/cart
POST   /api/cart
PATCH  /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart
```

Cart operations validate:

* Product availability
* Product status
* Stock quantity
* Buyer authentication

---

# Order API

### Create Order

```http
POST /api/orders
```

Requires buyer authentication.

### Get My Orders

```http
GET /api/orders/my
```

### Get Order

```http
GET /api/orders/:id
```

Additional seller order endpoints are available for approved sellers.

---

# Admin API

All admin endpoints require:

```text
Authentication
+
admin role
```

### Dashboard

```http
GET /api/admin/dashboard
```

Returns platform statistics such as:

* Total users
* Total sellers
* Total products
* Total orders
* Total revenue

### Users

```http
GET /api/admin/users
```

### Sellers

```http
GET   /api/admin/sellers
PATCH /api/admin/sellers/:id/status
```

Supported seller statuses:

```text
pending
approved
rejected
suspended
```

### Products

```http
GET    /api/admin/products
DELETE /api/admin/products/:id
```

### Orders

```http
GET   /api/admin/orders
GET   /api/admin/orders/:id
PATCH /api/admin/orders/:id/status
```

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
NODE_ENV=development
PORT=5000

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
You can access .env.example for all values
Never commit `.env` to GitHub.


---

## Frontend

Create:

```text
frontend/.env
```

Your frontend environment file should contain the backend API URL used by the frontend.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, replace it with your deployed backend URL.

You can access .env.example for all values

---

# MongoDB Setup

Shopivo uses MongoDB for persistent data.

You can use either:

* Local MongoDB
* MongoDB Atlas

Example MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopivo
```

Make sure your MongoDB deployment allows connections from your backend server.

---

# Cloudinary Setup

Shopivo uses Cloudinary to store product images.

Create a Cloudinary account and obtain:

```text
Cloud Name
API Key
API Secret
```

Add them to:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Product images are stored in:

```text
shopivo/products
```

Only image URLs are stored in MongoDB.

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>

cd Shopivo
```

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Update the values inside `.env`.

Start the backend in development:

```bash
npm run dev
```

If no development script is configured:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

Health check:

```http
GET /
```

Expected response:

```json
{
  "success": true,
  "message": "Multi-vendor e-commerce API is running"
}
```

---

# Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Set the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# Running the Full Application

You need both frontend and backend running.

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Then open the frontend URL provided by Vite.

---

# Error Handling

The backend uses centralized error handling.

Controllers pass errors to:

```text
errorMiddleware
```

Typical error response:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Common HTTP status codes:

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 409  | Conflict     |
| 500  | Server Error |

---

## Security

Shopivo implements several backend security measures.

### Helmet

Adds security-related HTTP headers.

### CORS

The backend is configured to accept requests from the configured frontend URL.

```env
CLIENT_URL=http://localhost:5173
```

### Password Hashing

Passwords are hashed using bcrypt before being stored.

### JWT Authentication

Protected resources require valid authentication.

### Role-Based Authorization

Sensitive operations verify the user's role.

### Input Validation

Request data is validated before reaching controllers.

### Rate Limiting

API requests are rate-limited to reduce excessive requests.

### Environment Variables

Sensitive credentials are stored outside the source code.

---

# Frontend Architecture

The frontend is organized around pages, reusable components, application context, and API services.

```text
React Application
       │
       ├── Pages
       │
       ├── Components
       │
       ├── Context
       │
       └── Services
              │
              ▼
          Backend API
```

### Pages

Pages represent application screens such as:

```text
Home
Products
Product Details
Cart
Checkout
Orders
Order Details
Profile
Login
Signup
```

Seller pages:

```text
Seller Dashboard
Seller Application
My Products
Add Product
Edit Product
Seller Orders
Seller Order Details
```

Admin pages:

```text
Admin Dashboard
Admin Users
Admin Sellers
Admin Products
Admin Orders
Admin Order Details
```

### Components

Reusable UI components are organized separately from pages.

Examples:

```text
Navbar
Footer
Hero
ProductCard
Categories
NewArrivals
TrendingProducts
MarketplaceBanner
BecomeSeller
ProtectedRoute
```

### Services

API communication is separated into service modules:

```text
authService.js
userService.js
sellerService.js
productService.js
categoryService.js
cartService.js
orderService.js
adminService.js
```

This keeps API logic separate from UI components.

---

# Deployment

## Frontend

The frontend can be deployed to Vercel.

Before deployment, configure the production API URL in the frontend environment variables.

Example:

```env
VITE_API_URL=https://your-backend-url.com/api
```

The project includes:

```text
vercel.json
```

for SPA routing support.

The rewrite configuration allows React Router routes to resolve correctly when users directly visit application URLs.

---

## Backend

The Express backend can be deployed to services such as:

* Render
* Railway
* Google Cloud Run
* Other Node.js-compatible hosting platforms

Configure the production environment variables on the hosting platform.

Example:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.com

MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not commit production secrets to GitHub.

---

# Production Checklist

Before deploying Shopivo:

```text
[ ] Set production CLIENT_URL
[ ] Set production VITE_API_URL
[ ] Configure MongoDB Atlas
[ ] Configure Cloudinary
[ ] Configure JWT secret
[ ] Add environment variables to hosting platforms
[ ] Verify CORS configuration
[ ] Verify API routes
[ ] Verify frontend routing
[ ] Test authentication
[ ] Test seller approval
[ ] Test product creation
[ ] Test image uploads
[ ] Test cart
[ ] Test checkout
[ ] Test COD orders
[ ] Test inventory deduction
[ ] Test seller orders
[ ] Test admin dashboard
[ ] Test production deployment
```

---

# Future Improvements

Possible future improvements include:

* Automated backend testing
* Frontend testing
* Swagger / OpenAPI documentation
* Advanced product variants
* Shipping API integration
* Seller payout system
* Email notifications
* Order cancellation and refund handling
* Advanced seller analytics
* Real-time notifications
* CI/CD pipeline
* Improved production monitoring
* Redis caching
* Background job processing

---

# License

This project is created for **educational and portfolio purposes**.

---

# Author

**Furqan Ali**

Full-Stack Developer

Built with:

```text
React
Node.js
Express
MongoDB
Tailwind CSS
Cloudinary
```
