import axios from 'axios'

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jk_token')
      localStorage.removeItem('jk_user')
    }
    return Promise.reject(error)
  }
)

export default api
export { API_URL }
