import Sidebar from './sidebar.jsx'
import Topbar from './topbar.jsx'

export default function Layout({
  activePage,
  onNavigate,
  onNavigateAuth,
  isAuthenticated,
  onLogout,
  userName,
  children,
}) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          activePage={activePage}
          onNavigate={onNavigate}
          onNavigateAuth={onNavigateAuth}
          isAuthenticated={isAuthenticated}
          userName={userName}
        />
        <main style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--bg-base)',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}