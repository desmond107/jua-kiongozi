import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AdCarousel from './components/AdCarousel'
import Home from './pages/Home'
import Candidates from './pages/Candidates'
import CandidateDetail from './pages/CandidateDetail'
import Analytics from './pages/Analytics'
import Counties from './pages/Counties'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'

const ADMIN_ROUTES = ['/x-admin', '/x-admin/*']
const isAdminPath = (path) => path.startsWith('/x-admin')

function Layout({ children }) {
  const location = useLocation()
  const admin = isAdminPath(location.pathname)

  return (
    <>
      {!admin && <Navbar />}
      <main>{children}</main>
      {!admin && <Footer />}
      <AuthModal />
      <AdCarousel />
    </>
  )
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:slug" element={<CandidateDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/counties" element={<Counties />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/x-admin" element={<Admin />} />
        <Route path="/x-admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-urban-bg flex flex-col items-center justify-center text-center px-4 pt-16">
      <div className="text-8xl font-display font-black text-kenya-red/20 mb-4">404</div>
      <h1 className="text-3xl font-display font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#141414',
                color: '#fff',
                border: '1px solid #1f2937',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#BE0027', secondary: '#fff' } },
            }}
          />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
