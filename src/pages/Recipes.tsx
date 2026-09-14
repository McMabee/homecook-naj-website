import { useState, useEffect } from 'react'
import type { Recipe } from '../types'
import { useContent } from '../store/content'
import GoldDiamond from '../components/GoldDiamond'

export default function Recipes() {
  const { recipes, status } = useContent()
  const [active, setActive] = useState<Recipe | null>(null)
  const [category, setCategory] = useState('All')
  const loading = status === 'loading'

  const filtered =
    category === 'All' ? recipes : recipes.filter((r) => r.category === category)

  const usedCategories = ['All', ...Array.from(new Set(recipes.map((r) => r.category)))]

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-charcoal">
          <img
            src="https://images.unsplash.com/photo-1777897269443-7c5a5bd7c44a?w=1920&h=700&fit=crop&auto=format"
            alt="Gourmet plated salad"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/50 to-obsidian" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-gold tracking-[0.45em] text-xs uppercase mb-8">From My Kitchen</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream italic leading-tight mb-8">
            Simple <br />Recipes
          </h1>
          <div className="max-w-xs mx-auto mb-8">
            <GoldDiamond />
          </div>
          <p className="text-cream-muted text-lg font-light leading-relaxed">
            A curated collection of approachable recipes, each one designed to bring a little more joy to your table.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-6 py-8 border-b border-gold/10">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {usedCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-200 ${
                category === c
                  ? 'bg-gold text-obsidian'
                  : 'border border-cream/10 text-cream-muted hover:border-gold hover:text-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <RecipeGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl italic text-cream-muted">No recipes yet in this category.</p>
              <p className="text-cream-muted/50 text-sm mt-3">Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
              {filtered.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setActive(recipe)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recipe modal */}
      {active && <RecipeModal recipe={active} onClose={() => setActive(null)} />}
    </main>
  )
}

/* ── Loading placeholder ─────────────────────────────────────────── */

function RecipeGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10" aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-charcoal animate-pulse" aria-hidden="true">
          <div className="h-56 bg-obsidian/60" />
          <div className="p-8 space-y-4">
            <div className="h-5 w-2/3 bg-obsidian/60" />
            <div className="h-3 w-full bg-obsidian/60" />
            <div className="h-3 w-5/6 bg-obsidian/60" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Recipe card ─────────────────────────────────────────────────── */

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? 'text-emerald-400'
      : recipe.difficulty === 'Medium'
      ? 'text-gold'
      : 'text-red-400'

  return (
    <button
      className="group bg-charcoal hover:bg-obsidian transition-colors duration-400 text-left w-full overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden bg-charcoal">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
        <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-obsidian/70 text-gold border border-gold/20 px-3 py-1 backdrop-blur-sm">
          {recipe.category}
        </span>
      </div>
      <div className="p-8">
        <h3 className="font-display text-xl text-cream group-hover:text-gold transition-colors duration-300 mb-3 leading-snug">
          {recipe.title}
        </h3>
        <p className="text-cream-muted text-sm leading-relaxed line-clamp-2 mb-6">{recipe.description}</p>
        <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-cream-muted/60 border-t border-cream/5 pt-5">
          <span>{recipe.prepTime} prep</span>
          <span className="text-gold/30">·</span>
          <span>{recipe.cookTime} cook</span>
          <span className="text-gold/30">·</span>
          <span className={difficultyColor}>{recipe.difficulty}</span>
        </div>
      </div>
    </button>
  )
}

/* ── Recipe modal ────────────────────────────────────────────────── */

function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-charcoal border border-gold/15 max-w-3xl w-full">
        <div className="relative h-72 overflow-hidden bg-charcoal">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 border border-cream/20 text-cream-muted hover:text-gold hover:border-gold transition-colors flex items-center justify-center text-sm"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="absolute bottom-6 left-8 right-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2 block">{recipe.category}</span>
            <h2 className="font-display text-3xl md:text-4xl italic text-cream leading-tight">{recipe.title}</h2>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <p className="text-cream-muted leading-relaxed mb-8">{recipe.description}</p>
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold text-xs tracking-[0.25em] uppercase border-b border-gold/40 pb-1 mb-8 hover:border-gold transition-colors"
            >
              Watch the reel on Instagram <span aria-hidden>→</span>
            </a>
          )}

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-4 border-y border-gold/10 py-6 mb-8">
            {[
              { label: 'Prep', value: recipe.prepTime },
              { label: 'Cook', value: recipe.cookTime },
              { label: 'Serves', value: `${recipe.servings}` },
              { label: 'Level', value: recipe.difficulty },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gold/60 mb-1">{label}</p>
                <p className="text-cream text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Ingredients */}
            <div>
              <h3 className="font-display text-xl italic text-gold mb-5">Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-cream-muted text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-1.5" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="font-display text-xl italic text-gold mb-5">Method</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 text-cream-muted text-sm leading-relaxed">
                    <span className="font-display text-gold/40 text-lg leading-none shrink-0">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
