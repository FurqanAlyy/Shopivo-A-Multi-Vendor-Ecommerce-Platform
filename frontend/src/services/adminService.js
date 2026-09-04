import api from './api'

export const getAdminDashboardStats = async () => {
  const response = await api.get('/admin/dashboard')
  return response.data
}

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

export const getAdminSellers = async () => {
  const response = await api.get('/admin/sellers')
  return response.data
}

export const updateSellerStatus = async (id, status) => {
  const response = await api.patch(
    `/admin/sellers/${id}/status`,
    { status }
  )
  return response.data
}

export const getAdminProducts = async () => {
  const response = await api.get('/admin/products')
  return response.data
}

export const deleteAdminProduct = async id => {
  const response = await api.delete(`/admin/products/${id}`)
  return response.data
}

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders')
  return response.data
}

export const getAdminOrder = async id => {
  const response = await api.get(`/admin/orders/${id}`)
  return response.data
}

export const updateAdminOrderStatus = async (id, status) => {
  const response = await api.patch(
    `/admin/orders/${id}/status`,
    { status }
  )
  return response.data
}