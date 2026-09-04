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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/payment/success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment/cancel"
          element={<PaymentCancel />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App