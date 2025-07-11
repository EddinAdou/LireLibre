import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StoryDetail from './pages/StoryDetail'
import WriteStory from './pages/WriteStory'
import Profile from './pages/Profile'
import FontDemo from './pages/FontDemo'
import StoriesPage from './pages/StoriesPage'
import WritePage from './pages/WritePage'
import ImportPage from './pages/ImportPage'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/write" element={<WritePage />} />
          <Route path="/stories/import" element={<ImportPage />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/stories/:id/edit" element={<WritePage />} />
          <Route path="/write" element={<WriteStory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/font-demo" element={<FontDemo />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
