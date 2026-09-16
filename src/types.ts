export interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  ingredients: string[]
  instructions: string[]
  imageUrl: string
  /** Link to the Instagram post the recipe was published in, if any. */
  sourceUrl?: string
  createdAt: number
}

export type Page = 'home' | 'recipes' | 'contact' | 'admin'

/** Values of the "Service of Interest" select on the contact form. */
export type ContactService =
  | 'private-dinner'
  | 'cooking-workshop'
  | 'grazing-table'
  | 'meal-prep-weekly'
  | 'meal-prep-freezer'
  | 'brand-partnership'
  | 'other'

export interface InstagramPost {
  id: string
  /** Absolute URL, a path under public/, or a data URL from the admin uploader. */
  imageUrl: string
  /** Link to the post on instagram.com. Empty means "link to the profile". */
  postUrl: string
  /** Short description; doubles as the image alt text. */
  caption: string
}

export interface SiteSettings {
  /** Instagram username without the @. */
  instagramHandle: string
  facebookUrl: string
}
