import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StoryDetail from './pages/StoryDetail'
import StoryViewPage from './pages/StoryViewPage'
import Profile from './pages/Profile'
import FontDemo from './pages/FontDemo'
import StoriesPage from './pages/StoriesPage'
import WritePageClean from './pages/WritePageClean'
import ImportPage from './pages/ImportPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/write" element={<WritePageClean />} />
            <Route path="/stories/import" element={<ImportPage />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/stories/:id/edit" element={<WritePageClean />} />
            <Route path="/story/:id" element={<StoryViewPage />} />
            <Route path="/write/:id" element={<WritePageClean />} />
            <Route path="/write" element={<WritePageClean />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/font-demo" element={<FontDemo />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
