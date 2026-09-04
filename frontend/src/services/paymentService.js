import api from './api'

export const createCheckoutSession = async orderId => {
  const response = await api.post(
    `/payments/create-checkout-session/${orderId}`
  )

  return response.data
}