import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

// Import all pages
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Submit } from '@/pages/Submit'
import { Community } from '@/pages/Community'
import { Explore } from '@/pages/Explore'
import { Peptides } from '@/pages/Peptides'
import { PeptideDetail } from '@/pages/PeptideDetail'
import { Profile } from '@/pages/Profile'
import { Privacy } from '@/pages/Privacy'
import { Research } from '@/pages/Research'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/peptides" element={<Peptides />} />
                <Route path="/peptides/:id" element={<PeptideDetail />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/community" element={<Community />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/submit" element={<Submit />} />
              </Route>

              {/* Protected routes */}
              <Route element={<Layout />}>
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/research" element={<ProtectedRoute><Research /></ProtectedRoute>} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App