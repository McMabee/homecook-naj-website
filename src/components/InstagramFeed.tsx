import GoldDiamond from './GoldDiamond'
import { useContent } from '../store/content'
import { instagramUrl } from '../store/settings'

const MAX_TILES = 8

export default function InstagramFeed() {
  const { posts, settings, status } = useContent()
  const { instagramHandle } = settings
  const profileUrl = instagramUrl(instagramHandle)
  const loading = status === 'loading'
  const tiles = posts.slice(0, MAX_TILES)

  if (!loading && tiles.length === 0) return null

  return (
    <section id="instagram" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">On Instagram</p>
          <h2 className="font-display text-5xl md:text-6xl text-cream">
            Fresh from <em>the Kitchen</em>
          </h2>
          <div className="max-w-xs mx-auto mt-8">
            <GoldDiamond />
          </div>
          <p className="text-cream-muted text-lg font-light max-w-lg mx-auto leading-relaxed mt-8">
            A selection of recent family dinners, charcuterie boards, and private tables from Naj's kitchen.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10" aria-busy={loading || undefined}>
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-square bg-charcoal animate-pulse" aria-hidden="true" />
              ))
            : tiles.map((post) => (
                <a
                  key={post.id}
                  href={post.postUrl || profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden bg-charcoal"
                  aria-label={post.caption ? `${post.caption} (opens on Instagram)` : 'View on Instagram'}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {post.caption && <p className="text-cream text-xs leading-relaxed line-clamp-2">{post.caption}</p>}
                    <InstagramGlyph className="w-4 h-4 text-gold shrink-0" />
                  </div>
                </a>
              ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-gold text-gold px-8 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
          >
            <InstagramGlyph className="w-4 h-4" />
            Follow @{instagramHandle}
          </a>
        </div>
      </div>
    </section>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
