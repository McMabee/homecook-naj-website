import type { Page } from '../types'
import { useSettings, instagramUrl } from '../store/settings'

interface FooterProps {
  setPage: (p: Page) => void
}

export default function Footer({ setPage }: FooterProps) {
  const settings = useSettings()

  const scrollTo = (id: string) => {
    setPage('home')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 120)
  }

  return (
    <footer className="bg-obsidian border-t border-gold/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <button
            onClick={() => setPage('home')}
            className="font-display italic text-2xl text-gold tracking-wide hover:text-gold-light transition-colors"
          >
            Home Cooking with Naj
          </button>
          <nav className="flex flex-wrap justify-center gap-8 text-xs tracking-[0.2em] uppercase">
            <button onClick={() => setPage('home')} className="text-cream-muted hover:text-gold transition-colors">Home</button>
            <button onClick={() => scrollTo('about')} className="text-cream-muted hover:text-gold transition-colors">About</button>
            <button onClick={() => scrollTo('services')} className="text-cream-muted hover:text-gold transition-colors">Services</button>
            <button onClick={() => setPage('recipes')} className="text-cream-muted hover:text-gold transition-colors">Recipes</button>
            <button onClick={() => setPage('contact')} className="text-cream-muted hover:text-gold transition-colors">Contact</button>
          </nav>
        </div>

        <div className="h-px bg-gold/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-muted">
          <div className="text-center md:text-left space-y-1">
            <p>© {new Date().getFullYear()} Home Cooking with Naj. All rights reserved.</p>
            <p className="text-cream-muted/60">Private chef serving Hamilton, Ancaster, Burlington &amp; Oakville, Ontario.</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={instagramUrl(settings.instagramHandle)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors tracking-widest uppercase"
            >
              Instagram
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors tracking-widest uppercase"
            >
              Facebook
            </a>
            {/* Hidden admin access */}
            <button
              onClick={() => setPage('admin')}
              className="text-cream/10 hover:text-cream/30 transition-colors text-[10px] tracking-widest"
              aria-label="Admin"
            >
              ·
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
