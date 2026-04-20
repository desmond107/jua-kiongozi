import api from './axios'

export const getBlogs = async (page = 1, pageSize = 9) => {
  const { data } = await api.get('/blogs', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      populate: '*',
      sort: 'publishedAt:desc',
      'filters[published][$eq]': true,
    },
  })
  return data
}

export const getBlogBySlug = async (slug) => {
  const { data } = await api.get('/blogs', {
    params: {
      'filters[slug][$eq]': slug,
      populate: '*',
    },
  })
  return data?.data?.[0] || null
}

export const createBlog = async (blogData) => {
  const { data } = await api.post('/blogs', { data: blogData })
  return data
}

export const updateBlog = async (id, blogData) => {
  const { data } = await api.put(`/blogs/${id}`, { data: blogData })
  return data
}

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/${id}`)
  return data
}

export const getAllBlogsAdmin = async () => {
  const { data } = await api.get('/blogs', {
    params: {
      populate: '*',
      sort: 'createdAt:desc',
      'pagination[pageSize]': 100,
    },
  })
  return data
}
