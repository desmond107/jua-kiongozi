import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Save, Loader2, Search, User } from 'lucide-react'
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../../api/candidates'
import { PRESIDENTIAL_CANDIDATES } from '../../utils/candidatesData'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', slug: '', nickname: '', position: 'Presidential Candidate', party: '',
  partyShortname: '', constituency: '', county: '', currentPosition: '', email: '',
  image: '', status: 'announced', manifesto: '', biography: '',
}

export default function CandidateManager() {
  const [candidates, setCandidates] = useState(PRESIDENTIAL_CANDIDATES)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const filtered = candidates.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.party.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (candidate) => {
    setForm({ ...EMPTY_FORM, ...candidate })
    setEditingId(candidate.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        await updateCandidate(editingId, form)
        setCandidates((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)))
        toast.success('Candidate updated successfully')
      } else {
        const newId = Date.now()
        const newCandidate = { ...form, id: newId }
        await createCandidate(form)
        setCandidates((prev) => [...prev, newCandidate])
        toast.success('Candidate added successfully')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
    } catch {
      if (editingId) {
        setCandidates((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)))
        toast.success('Candidate updated')
      } else {
        const newCandidate = { ...form, id: Date.now() }
        setCandidates((prev) => [...prev, newCandidate])
        toast.success('Candidate added')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCandidate(id)
    } catch {}
    setCandidates((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
    toast.success('Candidate removed')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="input-field pl-10 w-72"
          />
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-urban-border">
              {['Photo', 'Name', 'Party', 'Position', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-urban-border/50 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-urban-surface">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=BE0027&color=fff`
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-gray-500 text-xs">{c.constituency}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="badge-cyan">{c.partyShortname || c.party?.slice(0, 12)}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{c.position}</td>
                <td className="px-4 py-3">
                  <span className={c.status === 'announced' ? 'badge-red' : 'badge-gold'}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 rounded-lg bg-urban-surface hover:bg-urban-accent/10 text-gray-400 hover:text-urban-accent transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {deleteConfirm === c.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2 py-1 text-xs bg-kenya-red hover:bg-red-700 text-white rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-xs bg-urban-surface text-gray-400 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(c.id)}
                        className="p-1.5 rounded-lg bg-urban-surface hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                {editingId ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Full Name', 'name', 'text'],
                  ['Slug', 'slug', 'text'],
                  ['Nickname', 'nickname', 'text'],
                  ['Party', 'party', 'text'],
                  ['Party Shortname', 'partyShortname', 'text'],
                  ['Constituency', 'constituency', 'text'],
                  ['County', 'county', 'text'],
                  ['Email', 'email', 'email'],
                  ['Image URL', 'image', 'url'],
                  ['Current Position', 'currentPosition', 'text'],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={set(key)}
                      className="input-field text-sm"
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Status</label>
                <select value={form.status} onChange={set('status')} className="input-field text-sm">
                  <option value="announced">Announced</option>
                  <option value="exploring">Exploring</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Biography</label>
                <textarea value={form.biography} onChange={set('biography')} rows={3} className="input-field text-sm resize-none" />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Manifesto</label>
                <textarea value={form.manifesto} onChange={set('manifesto')} rows={3} className="input-field text-sm resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Update Candidate' : 'Add Candidate'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
