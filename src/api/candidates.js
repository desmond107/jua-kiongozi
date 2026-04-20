import api from './axios'

export const getCandidates = async (params = {}) => {
  const { data } = await api.get('/candidates', {
    params: {
      populate: '*',
      'pagination[pageSize]': 100,
      ...params,
    },
  })
  return data
}

export const getCandidateBySlug = async (slug) => {
  const { data } = await api.get('/candidates', {
    params: {
      'filters[slug][$eq]': slug,
      populate: '*',
    },
  })
  return data?.data?.[0] || null
}

export const getCandidateById = async (id) => {
  const { data } = await api.get(`/candidates/${id}?populate=*`)
  return data
}

export const createCandidate = async (candidateData) => {
  const { data } = await api.post('/candidates', { data: candidateData })
  return data
}

export const updateCandidate = async (id, candidateData) => {
  const { data } = await api.put(`/candidates/${id}`, { data: candidateData })
  return data
}

export const deleteCandidate = async (id) => {
  const { data } = await api.delete(`/candidates/${id}`)
  return data
}

export const uploadCandidateImage = async (file) => {
  const formData = new FormData()
  formData.append('files', file)
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
