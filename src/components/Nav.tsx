import { useState, useEffect } from 'react'
import type { Page } from '../types'

interface NavProps {
  page: Page
  setPage: (p: Page) => void
}

export default function Nav({ page, setPage }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (page !== 'home') {
      setPage('home')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const go = (p: Page) => {
    setMenuOpen(false)
    setPage(p)
  }

  if (page === 'admin') return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-obsidian/97 backdrop-blur-sm border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => go('home')}
          className="font-display italic text-lg md:text-xl text-gold tracking-wide hover:text-gold-light transition-colors"
        >
          Home Cooking with Naj
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('about')}
            className="text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase"
          >
            Services
          </button>
          <button
            onClick={() => go('recipes')}
            className={`text-xs tracking-[0.2em] uppercase transition-colors ${
              page === 'recipes' ? 'text-gold' : 'text-cream-muted hover:text-gold'
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => go('contact')}
            className={`border text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all duration-300 ${
              page === 'contact'
                ? 'border-gold bg-gold text-obsidian'
                : 'border-gold text-gold hover:bg-gold hover:text-obsidian'
            }`}
          >
            Book Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-obsidian/97 border-t border-gold/10 px-6 py-8 flex flex-col gap-6">
          <button onClick={() => scrollTo('about')} className="text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.3em] uppercase text-left">About</button>
          <button onClick={() => scrollTo('services')} className="text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.3em] uppercase text-left">Services</button>
          <button onClick={() => go('recipes')} className="text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.3em] uppercase text-left">Recipes</button>
          <button onClick={() => go('contact')} className="border border-gold text-gold text-xs tracking-[0.3em] uppercase px-6 py-3 text-left hover:bg-gold hover:text-obsidian transition-all duration-300">Book Now</button>
        </div>
      )}
    </nav>
  )
}
