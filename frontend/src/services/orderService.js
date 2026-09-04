import api from './api'

export const checkoutOrder = async orderData => {
  const response = await api.post(
    '/orders/checkout',
    orderData
  )

  return response.data
}

export const getMyOrders = async () => {
  const response = await api.get('/orders/my')
  return response.data
}

export const getMyOrder = async id => {
  const response = await api.get(`/orders/my/${id}`)
  return response.data
}