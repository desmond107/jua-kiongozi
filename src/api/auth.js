import api from './axios'

export const loginWithGoogle = async (googleToken) => {
  const { data } = await api.get(
    `/auth/google/callback?access_token=${googleToken}`
  )
  return data
}

export const loginWithEmail = async (identifier, password) => {
  const { data } = await api.post('/auth/local', { identifier, password })
  return data
}

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/local/register', userData)
  return data
}

export const requestWhatsAppOTP = async (phone) => {
  const { data } = await api.post('/auth/whatsapp-otp/send', { phone })
  return data
}

export const verifyWhatsAppOTP = async (phone, otp) => {
  const { data } = await api.post('/auth/whatsapp-otp/verify', { phone, otp })
  return data
}

export const getMe = async () => {
  const { data } = await api.get('/users/me?populate=*')
  return data
}

export const updateProfile = async (userId, updates) => {
  const { data } = await api.put(`/users/${userId}`, updates)
  return data
}
