import api from './axios'

export const castVote = async (candidateId, voteType) => {
  const { data } = await api.post('/votes', {
    data: { candidate: candidateId, voteType },
  })
  return data
}

export const getUserVote = async (candidateId) => {
  const { data } = await api.get('/votes', {
    params: {
      'filters[candidate][id][$eq]': candidateId,
      'filters[user][id][$eq]': 'me',
    },
  })
  return data?.data?.[0] || null
}

export const getVoteSummary = async (candidateId) => {
  const { data } = await api.get('/votes/summary', {
    params: { candidateId },
  })
  return data
}

export const getAllVotesAnalytics = async () => {
  const { data } = await api.get('/votes/analytics')
  return data
}
