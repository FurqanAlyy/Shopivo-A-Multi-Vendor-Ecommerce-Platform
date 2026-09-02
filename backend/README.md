# Shopivo Backend

Backend API for **Shopivo**, a multi-vendor e-commerce platform built with Node.js, Express, MongoDB, and JWT authentication.

The backend provides APIs for buyers, sellers, and administrators, including authentication, seller management, products, categories, cart management, multi-vendor checkout, order management, Stripe payments, and product image uploads through Cloudinary.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Express Validator
* Stripe
* Cloudinary
* Multer
* Helmet
* CORS
* Morgan
* Express Rate Limit
* dotenv

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based authorization
* Buyer, seller, and admin roles
* Authenticated user profile
* Password hashing with bcrypt

### Seller Management

* Seller registration
* Seller approval workflow
* Seller status management
* Approved seller verification
* Seller-specific product ownership
* Seller-specific order access

### Categories

* Create categories
* View categories
* Update categories
* Delete/deactivate categories
* Active/inactive category management

### Products

* Create products
* Update products
* Deactivate products
* Seller product management
* Product ownership validation
* Category validation
* SKU uniqueness
* Automatic slug generation
* Product search
* Category filtering
* Seller filtering
* Price filtering
* Sorting
* Pagination
* Product stock management
* Multiple product images
* Cloudinary image uploads

### Cart

* Add products to cart
* Update cart quantities
* Remove products from cart
* View current cart
* Stock validation
* Multi-vendor cart support

### Orders

* Multi-vendor checkout
* Automatic inventory deduction
* Multi-seller order creation
* Buyer order history
* Seller order management
* Seller order isolation
* Order status lifecycle
* Parent order status aggregation

### Payments

* Stripe Checkout integration
* Stripe test-mode payments
* Payment records
* Stripe Checkout session tracking
* Payment status tracking
* Stripe Payment Intent tracking
* Stripe webhook handling
* Automatic order payment status updates

### Admin

* Dashboard statistics
* Total users
* Total sellers
* Total products
* Total orders
* Total revenue from paid orders
* View all users
* View all sellers
* Update seller status
* View all products
* Delete products
* View all orders
* View individual orders
* Update order status

### Security

* Helmet security headers
* CORS configuration
* JWT authentication
* Role-based authorization
* Request validation
* Rate limiting
* Environment variables for secrets
* Centralized error handling
* 404 handling

---

# Project Structure

```text
backend/
│
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   └── stripe.js
│
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── sellerController.js
│   └── userController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── notFoundMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── validateMiddleware.js
│
├── models/
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Product.js
│   ├── Seller.js
│   └── User.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   ├── sellerRoutes.js
│   └── userRoutes.js
│
├── utils/
│   └── uploadToCloudinary.js
│
├── validators/
│   ├── authValidator.js
│   ├── categoryValidator.js
│   ├── productValidator.js
│   └── ...
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd Shopivo/backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
NODE_ENV=development
PORT=5000

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Never commit `.env` to GitHub.

---

# MongoDB Setup

Shopivo uses MongoDB for persistent application data.

You can use either a local MongoDB instance or MongoDB Atlas.

Set your connection string in:

```env
MONGO_URI=your_mongodb_connection_string
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopivo
```

---

# Cloudinary Setup

Shopivo uses Cloudinary to store product images.

Create a Cloudinary account and obtain:

* Cloud Name
* API Key
* API Secret

Add them to `.env`:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Product images are uploaded to:

```text
shopivo/products
```

The resulting secure image URLs are stored in the product document in MongoDB.

The backend accepts up to **5 images per product**, with a maximum size of **5 MB per image**.

---

# Stripe Setup

Shopivo uses Stripe Checkout for payment processing.

The current implementation uses Stripe **test mode** for development and portfolio demonstration.

Add your Stripe test credentials:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe CLI

Install the Stripe CLI and authenticate it with your Stripe account.

Forward Stripe events to the local backend:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Stripe CLI will provide a webhook signing secret. Add it to:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Test Card

Use Stripe's test card:

```text
Card number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any valid ZIP
```

---

# Running the Server

## Development

```bash
npm run dev
```

If the project does not have a development script, use:

```bash
node server.js
```

The API will run on:

```text
http://localhost:5000
```

Health check:

```http
GET /
```

Example response:

```json
{
  "success": true,
  "message": "Multi-vendor e-commerce API is running"
}
```

---

# API Documentation

Base URL:

```text
http://localhost:5000/api
```

---

## Authentication

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

### Get Current User

```http
GET /auth/me
```

Requires authentication.

```text
Authorization: Bearer <token>
```

---

# Users

```http
GET /users/profile
PATCH /users/profile
```

Authentication required.

---

# Sellers

### Register Seller

```http
POST /sellers
```

Requires buyer/user authentication.

### Get Seller Profile

```http
GET /sellers/me
```

Requires seller authentication.

### Seller Management

Seller-related endpoints are protected using authentication and role-based authorization.

---

# Categories

Category endpoints support category management and active/inactive category handling.

Typical endpoints:

```http
GET    /categories
GET    /categories/:id
POST   /categories
PATCH  /categories/:id
DELETE  /categories/:id
```

Protected endpoints require the appropriate authorization.

---

# Products

## Get Products

```http
GET /products
```

Supports:

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
GET /products?search=phone&minPrice=100&maxPrice=1000&page=1&limit=12
```

## Get Product

```http
GET /products/:id
```

## Get Seller Products

```http
GET /products/seller/my-products
```

Requires an approved seller account.

## Create Product

```http
POST /products
```

Requires seller authentication.

Product creation uses `multipart/form-data`.

Example fields:

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

The `images` field accepts up to 5 image files.

## Update Product

```http
PATCH /products/seller/:id
```

Requires seller authentication and ownership of the product.

New images can be uploaded using:

```text
images
```

If no new images are provided, the existing product images remain unchanged.

## Update Stock

```http
PATCH /products/seller/:id/stock
```

Requires seller authentication.

## Deactivate Product

```http
DELETE /products/seller/:id
```

Products are deactivated rather than permanently removed by sellers.

---

# Cart

Cart endpoints allow authenticated buyers to manage their shopping cart.

Typical operations:

```http
GET    /cart
POST   /cart
PATCH  /cart/:productId
DELETE /cart/:productId
DELETE /cart
```

Cart operations validate product availability and stock.

---

# Orders

## Create Order

```http
POST /orders
```

Requires buyer authentication.

The checkout process supports products belonging to multiple sellers.

The backend creates seller-specific order groups while maintaining the parent order.

## Get My Orders

```http
GET /orders/my
```

Requires buyer authentication.

## Get Order

```http
GET /orders/:id
```

Requires appropriate authorization.

## Seller Orders

Seller order endpoints return only orders containing products belonging to the authenticated seller.

## Order Status

Supported order statuses:

```text
pending
confirmed
processing
shipped
delivered
cancelled
```

---

# Payments

## Create Stripe Checkout Session

```http
POST /payments/create-checkout-session/:orderId
```

Requires buyer authentication.

The endpoint creates a Stripe Checkout session for an unpaid Stripe order.

Response includes:

```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

## Stripe Webhook

```http
POST /payments/webhook
```

This endpoint receives Stripe webhook events.

The webhook verifies the Stripe signature before processing events.

Currently handled events include:

```text
checkout.session.completed
checkout.session.expired
```

After a successful payment:

```text
Payment.status → paid
Order.paymentStatus → paid
Order.status → confirmed
Order.paidAt → current date
```

---

# Admin

All admin endpoints require:

```text
Authentication
+
admin role
```

## Dashboard

```http
GET /admin/dashboard
```

Returns:

* Total users
* Total sellers
* Total products
* Total orders
* Total revenue

## Users

```http
GET /admin/users
```

## Sellers

```http
GET /admin/sellers
PATCH /admin/sellers/:id/status
```

Supported seller statuses:

```text
pending
approved
rejected
suspended
```

## Products

```http
GET /admin/products
DELETE /admin/products/:id
```

## Orders

```http
GET   /admin/orders
GET   /admin/orders/:id
PATCH /admin/orders/:id/status
```

---

# Authentication Flow

Shopivo uses JWT-based authentication.

The general flow is:

```text
User Registration
       ↓
User Login
       ↓
JWT Token
       ↓
Authorization Header
       ↓
authMiddleware
       ↓
User Identification
       ↓
roleMiddleware
       ↓
Protected Controller
```

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Role-Based Access

Shopivo has three primary roles:

| Role   | Access                              |
| ------ | ----------------------------------- |
| Buyer  | Shopping, cart, checkout, orders    |
| Seller | Product and seller order management |
| Admin  | Platform management                 |

Seller-specific operations additionally require an **approved seller account**.

---

# Order Architecture

Shopivo supports multi-vendor orders.

Example:

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

This allows a buyer to purchase products from multiple sellers in a single checkout.

The backend separates seller-specific order data while maintaining the parent order.

---

# Inventory Management

Inventory is updated during the checkout process.

The backend:

1. Validates product availability
2. Checks requested quantities
3. Deducts inventory
4. Creates the order
5. Creates seller-specific order groups

This prevents orders from being created with unavailable stock.

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

Common status codes:

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

# Security

The backend includes several security measures:

### Helmet

Adds security-related HTTP headers.

### CORS

Configured using the frontend URL:

```env
CLIENT_URL=http://localhost:5173
```

### Rate Limiting

API requests are rate-limited to help prevent excessive requests.

### Password Hashing

Passwords are hashed before being stored.

### JWT Authentication

Protected resources require a valid JWT.

### Role Authorization

Sensitive routes verify the user's role.

### Input Validation

Request data is validated before reaching controllers.

### Environment Variables

Sensitive credentials such as:

* MongoDB credentials
* JWT secret
* Stripe keys
* Cloudinary credentials

are stored in environment variables.

---

# Environment Variables

The backend requires:

```env
NODE_ENV=development
PORT=5000

CLIENT_URL=http://localhost:5173

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

# Testing

The backend can be tested using Postman or another API client.

Recommended testing order:

```text
1. Register user
2. Login
3. Test authenticated user
4. Register seller
5. Approve seller
6. Create category
7. Create product
8. Upload product images
9. Test product search/filtering
10. Add product to cart
11. Update cart
12. Create order
13. Verify inventory deduction
14. Create Stripe checkout session
15. Complete Stripe test payment
16. Verify Stripe webhook
17. Verify payment status
18. Verify order status
19. Test seller orders
20. Test admin endpoints
```

---

# Development Notes

Shopivo is currently designed as a **portfolio and learning project** demonstrating a complete multi-vendor e-commerce backend.

The implementation intentionally focuses on the core e-commerce workflow instead of adding unnecessary features.

The project does not currently include:

* Product reviews
* Wishlist
* Coupons
* Advanced seller payouts
* Seller analytics
* In-app chat
* Notifications
* Advanced inventory variants
* Complex shipping integrations

---

# Future Improvements

Possible future improvements include:

* Automated testing
* API documentation with Swagger/OpenAPI
* Advanced product variants
* Shipping integration
* Seller payout system
* Email notifications
* Order cancellation and refund handling
* Advanced analytics
* Production deployment
* CI/CD pipeline

These features are outside the current core scope.

---

# License

This project is created for educational and portfolio purposes.
