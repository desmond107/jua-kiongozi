import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Calendar, User, ArrowRight, Tag, Search } from 'lucide-react'

const MOCK_BLOGS = [
  {
    id: 1,
    slug: 'kenya-2027-what-to-expect',
    title: 'Kenya 2027: What Every Voter Needs to Know',
    excerpt: 'A comprehensive guide to the upcoming general election — positions, processes, and what your vote means for Kenya\'s future.',
    category: 'Election Guide',
    author: 'JuaKiongozi Editorial',
    date: '2024-02-01',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600&q=80',
    featured: true,
  },
  {
    id: 2,
    slug: 'bottom-up-economy-explained',
    title: 'The Bottom-Up Economy: What It Means for Ordinary Kenyans',
    excerpt: 'Breaking down the Hustler Fund, affordable housing programme, and UHC — what has been achieved and what remains.',
    category: 'Policy',
    author: 'Policy Desk',
    date: '2024-01-28',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1573496546038-82f9c39f6365?w=600&q=80',
    featured: false,
  },
  {
    id: 3,
    slug: 'genz-impact-2027',
    title: 'Gen Z in Kenya: Will the Youth Decide the 2027 Election?',
    excerpt: 'With 30 million young Kenyans eligible to vote, Gen Z holds unprecedented power to reshape the political landscape.',
    category: 'Youth',
    author: 'Youth Desk',
    date: '2024-01-22',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1607792013280-0b0d43c1a313?w=600&q=80',
    featured: false,
  },
  {
    id: 4,
    slug: 'devolution-kenya-impact',
    title: 'Devolution in Kenya: A Decade of Impact',
    excerpt: 'Ten years after the 2010 Constitution, we assess whether devolution has delivered on its promise to bring government closer to the people.',
    category: 'Analysis',
    author: 'Research Desk',
    date: '2024-01-18',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&q=80',
    featured: false,
  },
  {
    id: 5,
    slug: 'women-leadership-kenya',
    title: 'Women in Power: Kenya\'s Fight for Gender Parity in Politics',
    excerpt: 'Despite constitutional provisions, women remain underrepresented in Kenya\'s political arena. What needs to change?',
    category: 'Opinion',
    author: 'Gender Desk',
    date: '2024-01-15',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1573495612077-9e10f2fd4e0e?w=600&q=80',
    featured: false,
  },
  {
    id: 6,
    slug: 'how-to-register-vote-kenya',
    title: 'How to Register and Vote in Kenya\'s 2027 Election',
    excerpt: 'Step-by-step guide to IEBC voter registration, polling day procedures, and your rights as a Kenyan voter.',
    category: 'Election Guide',
    author: 'JuaKiongozi Editorial',
    date: '2024-01-10',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    featured: false,
  },
]

const CATEGORIES = ['All', 'Election Guide', 'Policy', 'Youth', 'Analysis', 'Opinion', 'Counties', 'News']

export default function Blog() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = MOCK_BLOGS.filter((b) => {
    const matchCat = category === 'All' || b.category === category
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const [featured, ...rest] = filtered.filter((b) => b.featured).concat(filtered.filter((b) => !b.featured))

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-urban-gold/10 to-transparent border-b border-urban-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge-gold mb-4">📰 News & Insights</div>
            <h1 className="section-title mb-3">Political Blog</h1>
            <p className="section-subtitle">
              In-depth analysis, election guides, policy breakdowns, and opinion pieces on Kenya's 2027 political landscape.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  category === cat ? 'bg-urban-gold text-black' : 'bg-urban-surface border border-urban-border text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link to={`/blog/${featured.slug}`} className="block group">
              <div className="card-hover overflow-hidden md:flex h-72">
                <div className="md:w-1/2 h-full overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-gold">{featured.category}</span>
                    <span className="text-xs text-gray-500">{featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white group-hover:text-kenya-red transition-colors mb-3 line-clamp-2">
                    {featured.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {featured.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.date}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featured ? rest : filtered).map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/blog/${blog.slug}`} className="block card-hover group h-full">
                <div className="h-44 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600&q=80' }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-cyan text-xs">{blog.category}</span>
                    <span className="text-xs text-gray-600">{blog.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-kenya-red transition-colors mb-2 line-clamp-2 text-base">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No articles found for your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
