import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import type { ContactService, Page } from './types'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Contact from './pages/Contact'
import Admin from './pages/admin/Admin'
import { ContentProvider } from './store/content'
import { useAuth } from './lib/auth'

export type { Page }

/**
 * Path reported to Vercel Web Analytics for each state-driven page. The URL
 * never changes in this app, so this is what makes each page show up as its
 * own entry in the dashboard. The admin is deliberately not tracked.
 */
const ANALYTICS_PATHS: Record<Page, string | null> = {
  home: '/',
  recipes: '/recipes',
  contact: '/contact',
  admin: null,
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [contactService, setContactService] = useState<ContactService | ''>('')
  const auth = useAuth()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  // Forget any preselected service once the visitor leaves Contact, so the
  // nav and footer "Book Now" buttons (which call setPage directly) start blank.
  useEffect(() => {
    if (page !== 'contact') setContactService('')
  }, [page])

  // A password-reset email links back to the site root; send the owner to the
  // admin so they can choose a new password.
  useEffect(() => {
    if (auth.recovery) setPage('admin')
  }, [auth.recovery])

  /** Opens the contact page, optionally with a service already selected. */
  const openContact = (service: ContactService | '' = '') => {
    setContactService(service)
    setPage('contact')
  }

  const showFooter = page !== 'admin'

  return (
    <ContentProvider>
      <div className="min-h-full bg-obsidian text-cream font-body">
        <Nav page={page} setPage={setPage} />
        {page === 'home' && <Home openContact={openContact} />}
        {page === 'recipes' && <Recipes />}
        {page === 'contact' && <Contact initialService={contactService} />}
        {page === 'admin' && <Admin auth={auth} onExit={() => setPage('home')} />}
        {showFooter && <Footer setPage={setPage} />}
        <Analytics
          route={ANALYTICS_PATHS[page]}
          path={ANALYTICS_PATHS[page]}
          mode={import.meta.env.DEV ? 'development' : 'production'}
        />
      </div>
    </ContentProvider>
  )
}
