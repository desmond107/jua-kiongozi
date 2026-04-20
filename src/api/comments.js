import api from './axios'

export const getComments = async (candidateId, page = 1) => {
  const { data } = await api.get('/comments', {
    params: {
      'filters[candidate][id][$eq]': candidateId,
      'pagination[page]': page,
      'pagination[pageSize]': 10,
      populate: ['user'],
      sort: 'createdAt:desc',
    },
  })
  return data
}

export const postComment = async (candidateId, content) => {
  const { data } = await api.post('/comments', {
    data: { candidate: candidateId, content },
  })
  return data
}

export const likeComment = async (commentId) => {
  const { data } = await api.post(`/comments/${commentId}/like`)
  return data
}

export const dislikeComment = async (commentId) => {
  const { data } = await api.post(`/comments/${commentId}/dislike`)
  return data
}

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`)
  return data
}
