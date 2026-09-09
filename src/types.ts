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
  createdAt: number
}

export type Page = 'home' | 'recipes' | 'contact' | 'admin'

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
