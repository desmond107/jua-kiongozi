import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ThumbsUp, ThumbsDown, Trash2, MessageCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getComments, postComment, likeComment, dislikeComment, deleteComment } from '../api/comments'
import toast from 'react-hot-toast'

const TimeAgo = ({ date }) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days > 0) return <>{days}d ago</>
  if (hrs > 0) return <>{hrs}h ago</>
  if (mins > 0) return <>{mins}m ago</>
  return <>Just now</>
}

export default function CommentSection({ candidateId }) {
  const { user, isAuthenticated, setShowAuthModal } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [candidateId])

  const fetchComments = async () => {
    setFetching(true)
    try {
      const data = await getComments(candidateId)
      setComments(data?.data || [])
    } catch {
      setComments([])
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setShowAuthModal(true)
      toast('Sign in to comment', { icon: '💬' })
      return
    }
    if (!text.trim()) return

    setLoading(true)
    try {
      await postComment(candidateId, text.trim())
      setText('')
      toast.success('Comment posted!')
      fetchComments()
    } catch {
      toast.error('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (commentId) => {
    if (!isAuthenticated) { setShowAuthModal(true); return }
    try {
      await likeComment(commentId)
      fetchComments()
    } catch {
      toast.error('Action failed')
    }
  }

  const handleDislike = async (commentId) => {
    if (!isAuthenticated) { setShowAuthModal(true); return }
    try {
      await dislikeComment(commentId)
      fetchComments()
    } catch {
      toast.error('Action failed')
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      toast.success('Comment deleted')
      fetchComments()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-urban-accent" />
        <h3 className="text-lg font-bold text-white">Comments</h3>
        <span className="badge-cyan">{comments.length}</span>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-kenya-red flex items-center justify-center text-white text-sm font-bold shrink-0">
          {isAuthenticated ? (user?.username?.[0] || 'U').toUpperCase() : '?'}
        </div>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isAuthenticated ? 'Share your thoughts...' : 'Sign in to comment...'}
            rows={2}
            maxLength={500}
            disabled={!isAuthenticated}
            className="input-field resize-none pr-12 text-sm"
            onFocus={() => { if (!isAuthenticated) { setShowAuthModal(true) } }}
          />
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-kenya-red hover:bg-red-700 disabled:opacity-30 flex items-center justify-center transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-kenya-red" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.map((comment, idx) => {
              const attrs = comment.attributes || comment
              const commentUser = attrs?.user?.data?.attributes || attrs?.user || {}
              const isOwner = user && commentUser?.id === user?.id
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-urban-surface border border-urban-border flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {(commentUser?.username || 'A')[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-urban-surface border border-urban-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">
                          {commentUser?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          <TimeAgo date={attrs?.createdAt || new Date()} />
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{attrs?.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 px-2">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-400 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{attrs?.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => handleDislike(comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{attrs?.dislikes || 0}</span>
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
