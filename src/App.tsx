import { useState, useEffect } from 'react'
import type { Page } from './types'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Contact from './pages/Contact'
import Admin from './pages/admin/Admin'

export type { Page }

export default function App() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const showFooter = page !== 'admin'

  return (
    <div className="min-h-full bg-obsidian text-cream font-body">
      <Nav page={page} setPage={setPage} />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'recipes' && <Recipes />}
      {page === 'contact' && <Contact />}
      {page === 'admin' && <Admin onExit={() => setPage('home')} />}
      {showFooter && <Footer setPage={setPage} />}
    </div>
  )
}
