import { useState, useEffect, useRef, useCallback } from 'react'
import Layout from './components/layout.jsx'
import Dashboard from './pages/dashboard.jsx'
import CompanyReview from './pages/companyReview.jsx'
import Compensation from './pages/compensation.jsx'
import Companies from './pages/companies.jsx'
import MyProfile from './pages/myprofile.jsx'
import AuthRouter, { AUTH_PAGES } from './auth/AuthRouter.jsx'
import { readAuthenticated, writeAuthenticated } from './auth/authStorage.js'

function getAuthPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, '')
  return AUTH_PAGES.includes(page) ? page : null
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [authPage, setAuthPage] = useState(getAuthPageFromHash)
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthenticated)
  const pendingActionRef = useRef(null)

  useEffect(() => {
    const onHashChange = () => setAuthPage(getAuthPageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigateAuth = useCallback((page) => {
    window.location.hash = `#/${page}`
    setAuthPage(page)
  }, [])

  const handleNavigate = useCallback((pageId) => {
    if (pageId === 'my-profile' && !readAuthenticated()) {
      pendingActionRef.current = () => setActivePage('my-profile')
      navigateAuth('login')
      return
    }
    setActivePage(pageId)
  }, [navigateAuth])

  const requireAuth = useCallback((action) => {
    if (readAuthenticated()) {
      action()
      return
    }
    pendingActionRef.current = action
    navigateAuth('login')
  }, [navigateAuth])

  const enterApp = () => {
    writeAuthenticated(true)
    setIsAuthenticated(true)
    window.location.hash = ''
    setAuthPage(null)
    const pending = pendingActionRef.current
    pendingActionRef.current = null
    pending?.()
  }

  const handleLogout = useCallback(() => {
    writeAuthenticated(false)
    setIsAuthenticated(false)
    pendingActionRef.current = null
    setActivePage('dashboard')
  }, [])

  if (authPage) {
    return (
      <AuthRouter
        page={authPage}
        onNavigate={navigateAuth}
        onAuthenticated={enterApp}
      />
    )
  }

  const renderPage = () => {
    if (activePage === 'my-profile' && !isAuthenticated) {
      return <Dashboard onNavigate={handleNavigate} />
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />
      case 'company-review':
        return <CompanyReview requireAuth={requireAuth} />
      case 'compensation':
        return <Compensation requireAuth={requireAuth} />
      case 'companies':
        return <Companies />
      case 'my-profile':
        return <MyProfile onLogout={handleLogout} />
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={handleNavigate}
      onNavigateAuth={navigateAuth}
      isAuthenticated={isAuthenticated}
    >
      {renderPage()}
    </Layout>
  )
}

export default App
