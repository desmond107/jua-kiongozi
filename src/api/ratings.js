import api from './axios'

export const rateCandidate = async (candidateId, score) => {
  const { data } = await api.post('/ratings', {
    data: { candidate: candidateId, score },
  })
  return data
}

export const getCandidateRatings = async (candidateId) => {
  const { data } = await api.get('/ratings', {
    params: {
      'filters[candidate][id][$eq]': candidateId,
      populate: ['user'],
    },
  })
  return data
}

export const getRatingSummary = async (candidateId) => {
  const { data } = await api.get(`/ratings/summary/${candidateId}`)
  return data
}
