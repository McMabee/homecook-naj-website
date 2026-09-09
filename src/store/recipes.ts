import type { Recipe } from '../types'
import { readJSON, writeJSON } from './storage'

const KEY = 'chef_recipes'

const SEED: Recipe[] = [
  {
    id: 'seed-1',
    title: 'Musakhan — Palestinian Roast Chicken',
    description:
      'The ultimate Palestinian comfort dish. Tender roasted chicken layered over flatbread soaked in sumac-spiced caramelised onions and topped with toasted pine nuts. Rich, fragrant, and deeply satisfying.',
    category: 'Mains',
    prepTime: '20 min',
    cookTime: '1 hr',
    servings: 4,
    difficulty: 'Medium',
    imageUrl:
      'https://images.unsplash.com/photo-1574966740793-953ad374e8fe?w=800&h=600&fit=crop&auto=format',
    ingredients: [
      '1 whole chicken, cut into pieces (or 6 bone-in thighs)',
      '4 large onions, thinly sliced',
      '4 tbsp sumac, divided',
      '1 tsp allspice',
      '½ tsp cinnamon',
      '½ cup olive oil',
      '4 taboon flatbreads or large pita',
      '½ cup toasted pine nuts',
      'Salt and pepper to taste',
      'Fresh parsley to garnish',
    ],
    instructions: [
      'Preheat oven to 200°C / 400°F. Season chicken with allspice, cinnamon, 2 tbsp sumac, salt, pepper, and a drizzle of olive oil.',
      'Roast chicken for 40–45 minutes until cooked through and golden.',
      'While chicken roasts, cook onions in olive oil over low heat for 25–30 minutes until deeply caramelised. Stir in remaining sumac.',
      'Lay flatbreads on a baking sheet. Spoon the sumac onions generously over each one. Place in the oven for 5 minutes to warm through.',
      'Top the flatbreads with roasted chicken, pine nuts, and fresh parsley. Serve immediately.',
    ],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'seed-2',
    title: 'Nonna-Style Sunday Pasta Sauce',
    description:
      'A slow-cooked tomato sauce the Italian way — unhurried, aromatic, and deeply flavourful. This is the sauce that fills the whole house with the smell of Sunday. Made to feed a family and freeze beautifully.',
    category: 'Sauces & Basics',
    prepTime: '15 min',
    cookTime: '2 hr',
    servings: 8,
    difficulty: 'Easy',
    imageUrl:
      'https://images.unsplash.com/photo-1700481932999-4bba65731015?w=800&h=600&fit=crop&auto=format',
    ingredients: [
      '2 × 800g cans whole San Marzano tomatoes',
      '6 cloves garlic, smashed',
      '1 medium onion, halved',
      '¼ cup extra virgin olive oil',
      '1 tbsp sugar (balances acidity)',
      'Large handful fresh basil',
      'Salt and pepper to taste',
      '500g pasta of your choice, to serve',
    ],
    instructions: [
      'Crush the tomatoes by hand into a wide, heavy-bottomed pot. Add the onion halves and smashed garlic.',
      'Pour in the olive oil and add sugar. Bring to a gentle simmer over medium heat.',
      'Reduce to the lowest possible heat and cook uncovered for 1.5–2 hours, stirring occasionally, until the sauce deepens in colour and concentrates.',
      'Remove the onion halves. Tear in the fresh basil and season generously with salt and pepper.',
      'Toss with your favourite pasta and finish with good parmesan. Freeze leftovers in portions for up to 3 months.',
    ],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'seed-3',
    title: 'The Perfect Grazing Board',
    description:
      'A showstopping spread that looks like it took hours but comes together in 20 minutes. Inspired by the Middle Eastern tradition of generous, abundant tablescapes — with a modern grazing board twist.',
    category: 'Sharing',
    prepTime: '20 min',
    cookTime: '0 min',
    servings: 8,
    difficulty: 'Easy',
    imageUrl:
      'https://images.unsplash.com/photo-1678572823447-45fc146df43c?w=800&h=600&fit=crop&auto=format',
    ingredients: [
      '200g aged cheddar or gouda',
      '150g brie or triple cream cheese',
      '100g halloumi, sliced and pan-fried until golden',
      '150g prosciutto or spiced beef',
      '1 cup marinated olives',
      'Fresh figs, grapes, or pomegranate seeds',
      'Honeycomb and whole grain mustard',
      'Crackers, crostini, and warm pita',
      'A handful of toasted almonds or walnuts',
      'Fresh herbs — rosemary, thyme, or mint',
    ],
    instructions: [
      'Choose a large board or platter as your canvas. Start by placing small bowls for the olives, honey, and mustard — these anchor the arrangement.',
      'Add your cheeses next, spaced across the board. Cut one wedge open to invite guests in.',
      'Layer the meats in relaxed folds between the cheeses. Add the golden halloumi slices.',
      'Fill the gaps with fruit, crackers, and nuts. Tuck in fresh herbs for colour and fragrance.',
      'Finish with a drizzle of honey and serve immediately, or cover and refrigerate up to 2 hours before serving.',
    ],
    createdAt: Date.now() - 86400000,
  },
]

export function getRecipes(): Recipe[] {
  return readJSON<Recipe[]>(KEY, SEED)
}

export function saveRecipe(recipe: Recipe): void {
  const all = [...getRecipes()]
  const idx = all.findIndex((r) => r.id === recipe.id)
  if (idx >= 0) {
    all[idx] = recipe
  } else {
    all.unshift(recipe)
  }
  writeJSON(KEY, all)
}

export function deleteRecipe(id: string): void {
  writeJSON(KEY, getRecipes().filter((r) => r.id !== id))
}
