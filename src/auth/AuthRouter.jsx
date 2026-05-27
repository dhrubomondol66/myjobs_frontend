import Login from './login.jsx'
import Register from './register.jsx'
import ForgotPassword from './forgotPassword.jsx'
import ResetPassword from './resetPassword.jsx'

const PAGES = {
  login: Login,
  register: Register,
  'forgot-password': ForgotPassword,
  'reset-password': ResetPassword,
}

export default function AuthRouter({ page = 'login', onNavigate, onAuthenticated }) {
  const Page = PAGES[page] ?? Login

  return (
    <Page
      onNavigate={onNavigate}
      onAuthenticated={onAuthenticated}
    />
  )
}

export const AUTH_PAGES = Object.keys(PAGES)
