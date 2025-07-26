import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomeRedirect from './components/WelcomeRedirect'
import EnhancedNavBar from './components/EnhancedNavBar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import NotificationCenter from './components/NotificationCenter'
import ToastNotification from './components/ToastNotification'
import HomePage from './pages/HomePage'
import TrendingPage from './pages/TrendingPage'
import BookmarksPage from './pages/BookmarksPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)

  const handleSearchResults = (results, query) => {
    setSearchQuery(query)
  }

  const handleNewsSubmitted = (newArticle) => {
    // Handle news submission - can add logic to refresh feeds
    console.log('News submitted:', newArticle)
  }

  const handleMenuClick = () => {
    console.log('Menu click handler called, current sidebar state:', sidebarOpen)
    setSidebarOpen(true)
    console.log('Sidebar state set to true')
  }

  const handleSidebarClose = () => {
    console.log('Closing sidebar')
    setSidebarOpen(false)
  }

  const handleNotificationClick = () => {
    setNotificationCenterOpen(true)
  }

  const handleNotificationCenterClose = () => {
    setNotificationCenterOpen(false)
  }

  // Debug: Log sidebar state changes
  console.log('App render - sidebarOpen:', sidebarOpen)

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<WelcomeRedirect />} />
            
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <EnhancedNavBar 
                    onMenuClick={handleMenuClick}
                    onSearchResults={handleSearchResults}
                    onNewsSubmitted={handleNewsSubmitted}
                    onNotificationClick={handleNotificationClick}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
                  <main className="pt-16">
                    <HomePage searchQuery={searchQuery} />
                  </main>
                  <Footer />
                  <NotificationCenter 
                    isOpen={notificationCenterOpen} 
                    onClose={handleNotificationCenterClose} 
                  />
                  <ToastNotification />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/trending" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <EnhancedNavBar 
                    onMenuClick={handleMenuClick}
                    onSearchResults={handleSearchResults}
                    onNewsSubmitted={handleNewsSubmitted}
                    onNotificationClick={handleNotificationClick}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
                  <main className="pt-16">
                    <TrendingPage />
                  </main>
                  <Footer />
                  <NotificationCenter 
                    isOpen={notificationCenterOpen} 
                    onClose={handleNotificationCenterClose} 
                  />
                  <ToastNotification />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <EnhancedNavBar 
                    onMenuClick={handleMenuClick}
                    onSearchResults={handleSearchResults}
                    onNewsSubmitted={handleNewsSubmitted}
                    onNotificationClick={handleNotificationClick}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
                  <main className="pt-16">
                    <BookmarksPage />
                  </main>
                  <Footer />
                  <NotificationCenter 
                    isOpen={notificationCenterOpen} 
                    onClose={handleNotificationCenterClose} 
                  />
                  <ToastNotification />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <EnhancedNavBar 
                    onMenuClick={handleMenuClick}
                    onSearchResults={handleSearchResults}
                    onNewsSubmitted={handleNewsSubmitted}
                    onNotificationClick={handleNotificationClick}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
                  <main className="pt-16">
                    <ProfilePage />
                  </main>
                  <Footer />
                  <NotificationCenter 
                    isOpen={notificationCenterOpen} 
                    onClose={handleNotificationCenterClose} 
                  />
                  <ToastNotification />
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
