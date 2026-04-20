import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_POSTS = {
  'kenya-2027-what-to-expect': {
    title: 'Kenya 2027: What Every Voter Needs to Know',
    author: 'JuaKiongozi Editorial',
    date: '2024-02-01',
    readTime: '8 min read',
    category: 'Election Guide',
    image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=1200&q=80',
    content: `
# Kenya 2027: A Complete Voter's Guide

The 2027 General Election is approaching, and for millions of Kenyans, this is a pivotal moment in our nation's democratic journey. Whether you're a first-time voter or a seasoned participant in Kenya's democracy, this guide provides everything you need.

## What Positions Are on the Ballot?

Every Kenyan voter will cast **six votes** on election day:

1. **President & Deputy President** — National executive leadership
2. **Governor & Deputy Governor** — County executive leadership
3. **Senator** — Upper house of Parliament
4. **Member of National Assembly** — Lower house representing constituencies
5. **Women Representative** — County representative to National Assembly
6. **Member of County Assembly (MCA)** — Local ward representation

## The Presidential Race

The 2027 presidential race is shaping up to be one of the most competitive in Kenya's history. Key contenders include incumbent President William Ruto (UDA), former Deputy President Rigathi Gachagua, Wiper's Kalonzo Musyoka, former Interior CS Fred Matiangi, activist Boniface Mwangi, former Chief Justice David Maraga, ODM Secretary General Edwin Sifuna, Iron Lady Martha Karua, and Roots Party's Prof. George Wajackoyah.

## How to Register to Vote

The Independent Electoral and Boundaries Commission (IEBC) oversees voter registration. You can register at any IEBC registration center in your constituency.

**Requirements:**
- Original National ID card or valid passport
- Be a Kenyan citizen aged 18 years or above
- Register in the constituency where you ordinarily reside

## Election Day Guide

- Bring your National ID or voter's card
- Polls open at **6:00 AM** and close at **5:00 PM**
- Vote at your registered polling station
- Results are announced within 7 days

## Why Your Vote Matters

Kenya's 2027 election comes at a critical juncture — high youth unemployment, rising cost of living, and questions about governance quality demand that every citizen participates. Your vote is your most powerful tool to demand accountability.

**Register. Vote. Shape Kenya.**
    `,
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = MOCK_POSTS[slug] || {
    title: 'Article Not Found',
    author: 'JuaKiongozi',
    date: new Date().toISOString().split('T')[0],
    readTime: '1 min read',
    category: 'News',
    image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=1200&q=80',
    content: 'This article could not be found. Please check the URL or return to the blog.',
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>
      if (line.startsWith('- ')) return <li key={i} className="text-gray-400 ml-4 mb-1">{line.slice(2)}</li>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-bold my-2">{line.slice(2, -2)}</p>
      if (line === '') return <div key={i} className="h-3" />
      return <p key={i} className="text-gray-400 leading-relaxed mb-2">{line}</p>
    })
  }

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-urban-bg via-urban-bg/60 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-gold">{post.category}</span>
            <span className="badge text-gray-500 bg-white/5 border-white/10">
              <Clock className="w-3 h-3 mr-1" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-urban-border">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-kenya-red flex items-center justify-center text-xs font-bold text-white">
                  JK
                </div>
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="prose prose-invert max-w-none">
            {renderContent(post.content)}
          </div>

          {/* CTA */}
          <div className="mt-12 card p-6 text-center border-kenya-red/20 bg-kenya-red/5">
            <h3 className="font-bold text-white text-xl mb-2">Know Your Candidates</h3>
            <p className="text-gray-400 text-sm mb-4">
              Use Jua Kiongozi to research candidates, vote, and track the 2027 race in real-time.
            </p>
            <Link to="/candidates" className="btn-primary inline-flex">
              Explore Candidates →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
