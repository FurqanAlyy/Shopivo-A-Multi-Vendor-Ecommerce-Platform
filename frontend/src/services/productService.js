import api from './api'

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', {
    params
  })
  return response.data
}

export const getProduct = async id => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getMyProducts = async () => {
  const response = await api.get('/products/seller/my-products')
  return response.data
}

export const updateProductStock = async (id, stock) => {
  const response = await api.patch(`/products/seller/${id}/stock`, {
    stock
  })
  return response.data
}

export const deleteProduct = async id => {
  const response = await api.delete(`/products/seller/${id}`)
  return response.data
}

export const createProduct = async productData => {
  const response = await api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}