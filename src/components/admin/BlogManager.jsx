import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Save, Eye, EyeOff, Loader2, Tag } from 'lucide-react'
import { createBlog, updateBlog, deleteBlog } from '../../api/blogs'
import toast from 'react-hot-toast'

const MOCK_BLOGS = [
  { id: 1, title: 'Kenya 2027: The Road to Election', slug: 'kenya-2027-road-to-election', category: 'Analysis', published: true, author: 'Admin', createdAt: '2024-01-15' },
  { id: 2, title: 'Understanding the Bottom-Up Economy', slug: 'bottom-up-economy', category: 'Policy', published: true, author: 'Admin', createdAt: '2024-01-20' },
  { id: 3, title: 'Gen Z in Kenyan Politics: A New Era', slug: 'genz-kenyan-politics', category: 'Youth', published: false, author: 'Admin', createdAt: '2024-01-25' },
]

const EMPTY_FORM = {
  title: '', slug: '', content: '', excerpt: '', category: 'Analysis', coverImage: '', published: false,
}

const CATEGORIES = ['Analysis', 'Policy', 'Youth', 'Counties', 'Election Guide', 'Opinion', 'News']

export default function BlogManager() {
  const [blogs, setBlogs] = useState(MOCK_BLOGS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (k) => () => setForm((f) => ({ ...f, [k]: !f[k] }))

  const handleEdit = (blog) => {
    setForm({ ...EMPTY_FORM, ...blog })
    setEditingId(blog.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    try {
      if (editingId) {
        await updateBlog(editingId, { ...form, slug })
        setBlogs((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form, slug } : b)))
        toast.success('Blog updated!')
      } else {
        await createBlog({ ...form, slug })
        setBlogs((prev) => [...prev, { ...form, slug, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }])
        toast.success('Blog published!')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
    } catch {
      const updated = { ...form, slug, id: editingId || Date.now(), createdAt: new Date().toISOString().split('T')[0] }
      if (editingId) {
        setBlogs((prev) => prev.map((b) => (b.id === editingId ? updated : b)))
      } else {
        setBlogs((prev) => [...prev, updated])
      }
      toast.success(editingId ? 'Blog updated!' : 'Blog published!')
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try { await deleteBlog(id) } catch {}
    setBlogs((prev) => prev.filter((b) => b.id !== id))
    toast.success('Blog deleted')
  }

  const togglePublish = async (blog) => {
    try { await updateBlog(blog.id, { published: !blog.published }) } catch {}
    setBlogs((prev) => prev.map((b) => (b.id === blog.id ? { ...b, published: !b.published } : b)))
    toast.success(blog.published ? 'Blog unpublished' : 'Blog published!')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Blog Post
        </button>
      </div>

      <div className="space-y-3">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white text-sm truncate">{blog.title}</h3>
                <span className="badge-cyan shrink-0">{blog.category}</span>
                {blog.published ? (
                  <span className="badge-green shrink-0">Published</span>
                ) : (
                  <span className="badge text-gray-500 bg-gray-500/10 border-gray-500/20 shrink-0">Draft</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{blog.createdAt} · by {blog.author}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublish(blog)}
                className={`p-2 rounded-lg transition-all text-sm ${
                  blog.published
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    : 'bg-urban-surface text-gray-500 hover:text-white'
                }`}
                title={blog.published ? 'Unpublish' : 'Publish'}
              >
                {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleEdit(blog)}
                className="p-2 rounded-lg bg-urban-surface text-gray-400 hover:text-urban-accent transition-all"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="p-2 rounded-lg bg-urban-surface text-gray-400 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-urban-card border border-urban-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-urban-border">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Blog Post' : 'Create New Post'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title *</label>
                <input type="text" value={form.title} onChange={set('title')} required className="input-field" placeholder="Blog post title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Slug (auto-generated)</label>
                  <input type="text" value={form.slug} onChange={set('slug')} className="input-field text-sm" placeholder="url-slug" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select value={form.category} onChange={set('category')} className="input-field text-sm">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Cover Image URL</label>
                <input type="url" value={form.coverImage} onChange={set('coverImage')} className="input-field text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Excerpt</label>
                <textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className="input-field text-sm resize-none" placeholder="Short summary..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Content *</label>
                <textarea value={form.content} onChange={set('content')} required rows={8} className="input-field text-sm resize-none font-mono" placeholder="Write your blog post here (Markdown supported)..." />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggle('published')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    form.published
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-urban-surface border-urban-border text-gray-500'
                  }`}
                >
                  {form.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {form.published ? 'Publish' : 'Draft'}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
