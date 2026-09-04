import api from './api'

export const applyAsSeller = async sellerData => {
  const response = await api.post('/sellers/apply', sellerData)
  return response.data
}

export const getMySellerApplication = async () => {
  const response = await api.get('/sellers/my-application')
  return response.data
}