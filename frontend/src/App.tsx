import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StoryList from './pages/StoryList'
import StoryDetail from './pages/StoryDetail'
import WriteStory from './pages/WriteStory'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stories" element={<StoryList />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/write" element={<WriteStory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
