import { useState, type FormEvent } from 'react'
import type { Recipe } from '../../types'
import { getRecipes, saveRecipe, deleteRecipe } from '../../store/recipes'
import {
  Field,
  ImageField,
  Notice,
  Section,
  errorMessage,
  inputClass,
  primaryButtonClass,
  ghostButtonClass,
  outlineButtonClass,
  dangerButtonClass,
} from './ui'

const CATEGORIES = ['Mains', 'Starters', 'Sharing', 'Sides', 'Desserts', 'Sauces & Basics']
const DIFFICULTIES = ['Easy', 'Medium', 'Advanced'] as const

type FormState = Omit<Recipe, 'id' | 'createdAt'>

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  category: 'Mains',
  prepTime: '',
  cookTime: '',
  servings: 4,
  difficulty: 'Easy',
  imageUrl: '',
  ingredients: [''],
  instructions: [''],
}

const selectArrow = (
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">▾</span>
)

export default function RecipesPanel() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes)
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<Recipe | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSaved(false)
    setError(null)
    setMode('form')
  }

  const openEdit = (r: Recipe) => {
    setEditing(r)
    setForm({
      title: r.title,
      description: r.description,
      category: r.category,
      prepTime: r.prepTime,
      cookTime: r.cookTime,
      servings: r.servings,
      difficulty: r.difficulty,
      imageUrl: r.imageUrl,
      ingredients: [...r.ingredients],
      instructions: [...r.instructions],
    })
    setSaved(false)
    setError(null)
    setMode('form')
  }

  const handleDelete = (id: string) => {
    try {
      deleteRecipe(id)
      setRecipes(getRecipes())
      setDeleteConfirm(null)
      setError(null)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const recipe: Recipe = {
      id: editing?.id ?? `r-${Date.now()}`,
      createdAt: editing?.createdAt ?? Date.now(),
      ...form,
      ingredients: form.ingredients.filter((s) => s.trim()),
      instructions: form.instructions.filter((s) => s.trim()),
    }
    try {
      saveRecipe(recipe)
      setRecipes(getRecipes())
      setSaved(true)
      setError(null)
      setTimeout(() => setMode('list'), 900)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const updateList = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev[field]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addListItem = (field: 'ingredients' | 'instructions') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeListItem = (field: 'ingredients' | 'instructions', index: number) => {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index)
      return { ...prev, [field]: arr.length ? arr : [''] }
    })
  }

  /* ── List ─────────────────────────────────────────────────────── */
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl italic text-cream">My Recipes</h2>
            <p className="text-cream-muted/60 text-sm mt-1">Shown on the Recipes page, newest first.</p>
          </div>
          <button onClick={openNew} className={primaryButtonClass}>
            + Add Recipe
          </button>
        </div>

        {error && <Notice tone="error">{error}</Notice>}

        {recipes.length === 0 ? (
          <div className="border border-gold/15 py-20 text-center">
            <p className="font-display text-2xl italic text-cream-muted">No recipes yet.</p>
            <button
              onClick={openNew}
              className="text-gold text-xs tracking-widest uppercase mt-4 border-b border-gold pb-0.5 hover:text-gold-light transition-colors"
            >
              Add your first recipe
            </button>
          </div>
        ) : (
          <div className="space-y-px bg-gold/10">
            {recipes.map((r) => (
              <div key={r.id} className="bg-charcoal flex items-center gap-4 p-5">
                <div className="w-16 h-16 shrink-0 overflow-hidden bg-obsidian">
                  {r.imageUrl && <img src={r.imageUrl} alt="" className="w-full h-full object-cover opacity-70" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg text-cream leading-tight truncate">{r.title}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cream-muted/50 mt-0.5">
                    {r.category} · {r.difficulty} · Serves {r.servings}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => openEdit(r)} className={outlineButtonClass}>
                    Edit
                  </button>
                  {deleteConfirm === r.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-xs tracking-widest uppercase text-red-400 border border-red-500/30 px-3 py-2 hover:bg-red-500/10 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-cream-muted border border-cream/10 px-3 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(r.id)} className={dangerButtonClass}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold tracking-[0.4em] text-xs uppercase mb-2">{editing ? 'Edit Recipe' : 'New Recipe'}</p>
          <h2 className="font-display text-3xl italic text-cream">{editing ? editing.title : 'Add a Recipe'}</h2>
        </div>
        <button
          type="button"
          onClick={() => setMode('list')}
          className="text-cream-muted hover:text-gold transition-colors text-xs tracking-widest uppercase"
        >
          ← Back to recipes
        </button>
      </div>

      <Section title="Details">
        <div className="space-y-5">
          <Field label="Recipe Title *">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Pan-Seared Salmon with Lemon Caper Butter"
              className={inputClass}
            />
          </Field>
          <Field label="Short Description *">
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A brief, appetising description of the dish..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category *">
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={`${inputClass} appearance-none pr-8`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-obsidian">
                      {c}
                    </option>
                  ))}
                </select>
                {selectArrow}
              </div>
            </Field>
            <Field label="Difficulty *">
              <div className="relative">
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as Recipe['difficulty'] })}
                  className={`${inputClass} appearance-none pr-8`}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d} className="bg-obsidian">
                      {d}
                    </option>
                  ))}
                </select>
                {selectArrow}
              </div>
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Prep Time *">
              <input
                required
                value={form.prepTime}
                onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                placeholder="e.g. 15 min"
                className={inputClass}
              />
            </Field>
            <Field label="Cook Time *">
              <input
                required
                value={form.cookTime}
                onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
                placeholder="e.g. 30 min"
                className={inputClass}
              />
            </Field>
            <Field label="Servings *">
              <input
                required
                type="number"
                min={1}
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>
          <ImageField value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
        </div>
      </Section>

      <Section title="Ingredients">
        <div className="space-y-3">
          {form.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={ing}
                onChange={(e) => updateList('ingredients', i, e.target.value)}
                placeholder={`Ingredient ${i + 1}`}
                aria-label={`Ingredient ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeListItem('ingredients', i)}
                aria-label={`Remove ingredient ${i + 1}`}
                className="px-3 border border-cream/10 text-cream-muted/40 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('ingredients')}
            className="text-gold text-xs tracking-[0.2em] uppercase border border-gold/20 px-4 py-2 hover:bg-gold/5 transition-colors"
          >
            + Add Ingredient
          </button>
        </div>
      </Section>

      <Section title="Method / Instructions">
        <div className="space-y-3">
          {form.instructions.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="font-display text-gold/30 text-lg leading-none mt-3 w-5 shrink-0">{i + 1}</span>
              <textarea
                value={step}
                onChange={(e) => updateList('instructions', i, e.target.value)}
                placeholder={`Step ${i + 1}`}
                aria-label={`Step ${i + 1}`}
                rows={2}
                className={`${inputClass} flex-1 resize-none`}
              />
              <button
                type="button"
                onClick={() => removeListItem('instructions', i)}
                aria-label={`Remove step ${i + 1}`}
                className="px-3 py-3 border border-cream/10 text-cream-muted/40 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem('instructions')}
            className="text-gold text-xs tracking-[0.2em] uppercase border border-gold/20 px-4 py-2 hover:bg-gold/5 transition-colors"
          >
            + Add Step
          </button>
        </div>
      </Section>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className={`flex-1 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-300 ${
            saved ? 'bg-emerald-600 text-white' : 'bg-gold text-obsidian hover:bg-gold-light'
          }`}
        >
          {saved ? '✓ Saved!' : editing ? 'Save Changes' : 'Publish Recipe'}
        </button>
        <button type="button" onClick={() => setMode('list')} className={ghostButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  )
}
