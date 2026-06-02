import { useState, useEffect, useRef, useCallback } from 'react'
import Layout from './components/layout.jsx'
import Dashboard from './pages/dashboard.jsx'
import CompanyReview from './pages/companyReview.jsx'
import Compensation from './pages/compensation.jsx'
import Companies from './pages/companies.jsx'
import MyProfile from './pages/myprofile.jsx'
import AuthRouter, { AUTH_PAGES } from './auth/AuthRouter.jsx'
import { readAuthenticated, clearAuthTokens } from './auth/authStorage.js'
import { getMyProfile } from './service/myprofile.js'

function getAuthPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, '')
  return AUTH_PAGES.includes(page) ? page : null
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [hasReviewed, setHasReviewed] = useState(false)
  const [authPage, setAuthPage] = useState(getAuthPageFromHash)
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthenticated)
  const [userName, setUserName] = useState('')
  const pendingActionRef = useRef(null)

  const handleReviewComplete = useCallback((companyId) => {
    setHasReviewed(true)
    if (companyId) localStorage.setItem('review_company_id', companyId)
    setActivePage('compensation')
  }, [])

  

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
  setIsAuthenticated(true)
  window.location.hash = ''
  setAuthPage(null)
  const pending = pendingActionRef.current
  pendingActionRef.current = null
  pending?.()
}

const handleLogout = useCallback(() => {
  clearAuthTokens()
  setIsAuthenticated(false)
  pendingActionRef.current = null
  setActivePage('dashboard')
}, [])

useEffect(() => {
  if (isAuthenticated) {
    getMyProfile()
      .then((res) => {
        const data = res?.data || {};
        setUserName(data.full_name || data.username || 'User');
      })
      .catch(() => setUserName('User'));
  } else {
    setUserName('');
  }
}, [isAuthenticated]);

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
      return <CompanyReview requireAuth={requireAuth} onReviewComplete={handleReviewComplete} onNavigate={handleNavigate} />
    case 'compensation':
      return <Compensation requireAuth={requireAuth} hasReviewed={hasReviewed} onNavigate={handleNavigate} />
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
    onLogout={handleLogout}
    userName={userName}
  >
    {renderPage()}
  </Layout>
)
}

export default App
