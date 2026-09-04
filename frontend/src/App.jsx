import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/products/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import PaymentCancel from './pages/payment/PaymentCancel'
import SellerApplication from './pages/seller/SellerApplication'
import SellerDashboard from './pages/seller/SellerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import MyProducts from './pages/seller/MyProducts'
import AddProduct from './pages/seller/AddProduct'
import EditProduct from './pages/seller/EditProduct'
import SellerOrders from './pages/seller/SellerOrders'
import SellerOrderDetails from './pages/seller/SellerOrderDetails'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route element={<ProtectedRoute roles={['buyer', 'seller']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        <Route element={<ProtectedRoute roles={['buyer']} />}>
          <Route
            path="/seller/apply"
            element={<SellerApplication />}
          />
        </Route>

        <Route element={<ProtectedRoute roles={['seller']} />}>
          <Route
            path="/seller/dashboard"
            element={<SellerDashboard />}
          />
          <Route
            path="/seller/products"
            element={<MyProducts />}
          />

          <Route
            path="/seller/products/new"
            element={<AddProduct />}
           />
             <Route path="/seller/products/:id/edit" element={<EditProduct />} />

              <Route
    path="/seller/orders"
    element={<SellerOrders />}
  />

  <Route
    path="/seller/orders/:id"
    element={<SellerOrderDetails />}
  />

        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App