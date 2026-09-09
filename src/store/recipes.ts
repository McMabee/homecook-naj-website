import type { Recipe } from '../types'
import { readJSON, writeJSON } from './storage'

const KEY = 'chef_recipes'

const day = (iso: string) => new Date(iso).getTime()

/**
 * Recipes Naj has published on Instagram, transcribed from her captions.
 * Ingredient lists are hers. Where a caption gave ingredients but no written
 * method, the steps follow her reel and standard technique; the comment above
 * each recipe says which. Photos are the reel cover frames, cropped to a 3:2
 * still and stored in public/recipes/.
 */
const SEED: Recipe[] = [
  // Ingredients from the caption; method written to match the reel.
  {
    id: 'romano-bean-stew',
    title: 'Fresh Romano Bean Stew',
    description:
      'A bright, plant-based stew of Romano beans and sweet mini tomatoes that is ready in 20 minutes. Serve it with some crusty bread and enjoy.',
    category: 'Mains',
    prepTime: '5 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'Easy',
    imageUrl: '/recipes/romano-bean-stew.jpg',
    sourceUrl: 'https://www.instagram.com/reel/DdEvKhqRHF1/',
    ingredients: [
      '½ bag frozen cut Romano beans',
      '2 garlic cloves, minced',
      '1 small onion, diced',
      '1 container Sundrops multi-coloured mini tomatoes',
      '½ container Savorries sweet strawberry tomatoes',
      '1 tsp dried basil, or a handful of fresh',
      '½ cup vegetable or chicken stock',
      'Salt and pepper to taste',
      'Crusty bread, to serve',
    ],
    instructions: [
      'Warm a little olive oil in a pot over medium heat and soften the onion and garlic for a few minutes.',
      'Add both kinds of tomatoes and cook until they start to burst and release their juices.',
      'Stir in the Romano beans, stock, basil, salt, and pepper. Cover and simmer for about 15 minutes, until the beans are tender.',
      'Taste for seasoning and serve hot with crusty bread.',
    ],
    createdAt: day('2026-09-09'),
  },
  // Ingredients from the caption; method written to match the reel.
  {
    id: 'salmon-bites-cauliflower-rice',
    title: 'Salmon Bites with Cauliflower Rice',
    description:
      'Paprika-spiced salmon bites over a quick cauliflower fried rice. An easy, healthy, satisfying weeknight meal. Swap in the protein of your choice.',
    category: 'Mains',
    prepTime: '15 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'Easy',
    imageUrl: '/recipes/salmon-bites-cauliflower-rice.jpg',
    sourceUrl: 'https://www.instagram.com/reel/Dc3lC15x5T7/',
    ingredients: [
      '1 lb skinless salmon fillets, diced into 1-inch cubes',
      'Avocado oil',
      '1 tbsp sweet paprika',
      '1 tsp garlic powder',
      '1 tsp onion powder',
      '1 tsp lemon pepper',
      '1 tsp dried oregano',
      '1 tsp salt',
      '⅛ tsp black pepper',
      'Chopped parsley and black sesame seeds, to garnish',
      'For the rice: 1 bag frozen cauliflower rice',
      '½ bag prepared coleslaw mix',
      '1 to 2 tbsp soy sauce',
      'Avocado oil, plus a little sesame oil for flavour',
      'Salt and pepper to taste',
      'Optional: 1 egg, scrambled into the rice',
    ],
    instructions: [
      'Toss the salmon cubes with a drizzle of avocado oil, the paprika, garlic powder, onion powder, lemon pepper, oregano, salt, and pepper.',
      'Sear the salmon in a hot pan for 2 to 3 minutes per side, until golden and just cooked through. Set aside.',
      'In the same pan, heat a little avocado oil with a splash of sesame oil. Add the cauliflower rice and coleslaw mix and stir-fry until tender. Season with soy sauce, salt, and pepper. If you like, push the rice to one side, scramble in an egg, then mix it through.',
      'Pile the salmon over the rice and finish with chopped parsley and black sesame seeds.',
    ],
    createdAt: day('2026-09-04'),
  },
  // Ingredients and method from the caption.
  {
    id: 'gyro-style-chicken',
    title: 'Chicken on the Spit, Gyro Style',
    description:
      'The best chicken gyros, cooked on a spit in the oven. Thighs are marinated in yogurt, lemon, garlic, and a warm spice blend, then roasted until golden and sliced thin. These are the spice combinations Naj loves, not the traditional ones.',
    category: 'Mains',
    prepTime: '15 min',
    cookTime: '1 hr 15 min',
    servings: 4,
    difficulty: 'Medium',
    imageUrl: '/recipes/gyro-style-chicken.jpg',
    sourceUrl: 'https://www.instagram.com/reel/Dc38pgax1S5/',
    ingredients: [
      '1 lb boneless chicken thighs (double the spices if you double the chicken)',
      '1 tsp salt',
      'Juice of ½ lemon',
      '1 tsp black pepper',
      '1 tsp oregano',
      '1 tsp cumin',
      '1 tsp coriander powder',
      '1 tsp paprika',
      '1 tsp onion powder',
      '1 tsp allspice',
      '4 to 5 garlic cloves, minced',
      '2 tsp olive oil',
      '2 tbsp yogurt',
      'To serve: pita, tzatziki, red onion, tomatoes, and lettuce',
    ],
    instructions: [
      'Mix the chicken thighs with the salt, lemon juice, all the spices, garlic, olive oil, and yogurt until every piece is well coated.',
      'Stack the thighs onto a vertical skewer or spit set in a baking dish, pressing them down as you go.',
      'Cook at 400°F (200°C) for about 1 hour to 1 hour 30 minutes, until the chicken is cooked through, golden brown, and the internal temperature reaches 165°F.',
      'Slice on an angle and pile into pita with your favourite toppings. Naj likes tzatziki, red onions, tomatoes, and lettuce.',
    ],
    createdAt: day('2026-09-04'),
  },
  // Ingredients and method from the caption.
  {
    id: 'pesto-chicken-thighs',
    title: 'One-Pan Chicken Thighs with Basil and Sun-dried Tomato Pesto',
    description:
      'An easy weeknight one-pan chicken thigh dinner. Everything is seasoned to taste, mixed well, and baked until browned and bubbling.',
    category: 'Mains',
    prepTime: '10 min',
    cookTime: '45 min',
    servings: 4,
    difficulty: 'Easy',
    imageUrl: '/recipes/pesto-chicken-thighs.jpg',
    sourceUrl: 'https://www.instagram.com/reel/DcwkmTDI18G/',
    ingredients: [
      '8 bone-in, skin-on chicken thighs',
      'Salt and pepper',
      'Olive oil',
      'Garlic powder',
      'Oregano',
      'Lemon juice',
      '1 tsp sun-dried tomato pesto',
      '1 tsp basil pesto',
    ],
    instructions: [
      'Season the chicken thighs to taste with salt, pepper, olive oil, garlic powder, oregano, and lemon juice.',
      'Add a teaspoon each of sun-dried tomato pesto and basil pesto and mix well so every thigh is coated.',
      'Arrange in a single layer in a baking dish and bake at 400°F (200°C) for about 45 minutes, until fully cooked and browned.',
    ],
    createdAt: day('2026-09-01'),
  },
  // Ingredients from the caption; method written to match the reel.
  {
    id: 'chicken-bean-taco-rolls',
    title: 'Chicken and Bean Taco Rolls',
    description:
      "Crispy baked taco rolls filled with rotisserie chicken, two cheeses, and Bush's Black Bean Fiesta simmered in a mild chipotle sauce. Perfect for an easy meal or as a game-day appetizer. Makes about 14 rolls.",
    category: 'Sharing',
    prepTime: '20 min',
    cookTime: '20 min',
    servings: 7,
    difficulty: 'Easy',
    imageUrl: '/recipes/chicken-bean-taco-rolls.jpg',
    sourceUrl: 'https://www.instagram.com/reel/CoC_qHIAL0u/',
    ingredients: [
      '1 rotisserie chicken, shredded',
      '14 small flour tortillas',
      "1 can Bush's Black Bean Fiesta in chipotle sauce",
      '½ block cream cheese, softened',
      '1 cup shredded cheese',
      '¾ tsp cumin',
      '¾ tsp fajita spice',
      '¾ tsp smoked paprika',
      '½ onion, diced',
      '2 garlic cloves, minced',
      'To serve: shredded lettuce, pico de gallo, sour cream, and hot sauce',
    ],
    instructions: [
      'Preheat the oven to 400°F (200°C). Soften the onion and garlic in a little oil.',
      'In a large bowl, mix the shredded chicken, beans with their sauce, cream cheese, shredded cheese, cumin, fajita spice, smoked paprika, and the cooked onion and garlic.',
      'Spoon the filling along one edge of each tortilla and roll up tightly. Place seam-side down on a lined baking sheet and brush lightly with oil.',
      'Bake for 15 to 20 minutes, until golden and crisp. Top with lettuce, pico de gallo, a drizzle of sour cream, and hot sauce.',
    ],
    createdAt: day('2023-01-30'),
  },
  // Ingredients from the caption; method written to match the reel.
  {
    id: 'black-bean-chili-cheese-dip',
    title: 'Black Bean Chili Cheese Dip',
    description:
      "The perfect game-day appetizer, made easier with one whole can of Bush's Black Chili Beans slow-simmered in a mild chili sauce. Layer, bake, and serve bubbling with tortilla chips.",
    category: 'Sharing',
    prepTime: '5 min',
    cookTime: '20 min',
    servings: 8,
    difficulty: 'Easy',
    imageUrl: '/recipes/black-bean-chili-cheese-dip.jpg',
    sourceUrl: 'https://www.instagram.com/reel/Cnw6sMVouzk/',
    ingredients: [
      '1 block (250 g) cream cheese, at room temperature',
      '1 tsp chili powder',
      '1 tsp garlic powder',
      "1 can Bush's Black Chili Beans, not drained (the beans are cooked in a traditional chili sauce)",
      'Shredded cheese, for the top',
      'Green onions, sliced, for the top',
      'Tortilla chips, to serve',
    ],
    instructions: [
      'Preheat the oven to 350°F (180°C). Beat the cream cheese with the chili powder and garlic powder and spread it over the bottom of a baking dish.',
      'Pour the whole can of chili beans, sauce and all, over the cream cheese and spread evenly.',
      'Top with a generous layer of shredded cheese and bake for about 20 minutes, until hot and bubbling.',
      'Scatter with green onions and serve warm with tortilla chips.',
    ],
    createdAt: day('2023-01-23'),
  },
  // Ingredients and method from the caption.
  {
    id: 'air-fried-maple-dijon-salmon',
    title: 'Air Fried Maple Dijon Salmon',
    description:
      'A delicious and healthy easy meal that is perfect for weekdays and meal prep. Salmon fillets seasoned with Old Bay, topped with Dijon and maple syrup, and air fried in about 10 minutes.',
    category: 'Mains',
    prepTime: '5 min',
    cookTime: '12 min',
    servings: 4,
    difficulty: 'Easy',
    imageUrl: '/recipes/air-fried-maple-dijon-salmon.jpg',
    sourceUrl: 'https://www.instagram.com/reel/Cm1i-7woF2f/',
    ingredients: [
      '4 salmon fillets',
      'Salt',
      'Pepper',
      'Old Bay seasoning',
      'Dijon mustard',
      'Maple syrup',
    ],
    instructions: [
      'Season the salmon on all sides with salt, pepper, and Old Bay seasoning.',
      'Top each fillet with Dijon mustard and a drizzle of maple syrup.',
      'Air fry at 400°F for 10 to 12 minutes. Timing may vary depending on the thickness of the fillets.',
    ],
    createdAt: day('2022-12-31'),
  },
  // Ingredients from the caption; method written to match the reel.
  {
    id: 'game-day-chili',
    title: 'Game Day Chili',
    description:
      "Naj's Grey Cup chili, made even better with Bush's Chili Beans. The beans come slow-simmered and seasoned, giving the pot that cooked-all-day flavour in a fraction of the time. Perfect for feeding a crowd.",
    category: 'Mains',
    prepTime: '15 min',
    cookTime: '1 hr',
    servings: 8,
    difficulty: 'Easy',
    imageUrl: '/recipes/game-day-chili.jpg',
    sourceUrl: 'https://www.instagram.com/reel/CkoEZRZgTd8/',
    ingredients: [
      '1 lb ground beef',
      "1 can Bush's Mild Black Chili Beans (add the whole can, no rinsing)",
      "1 can Bush's Spicy Red Kidney Chili Beans",
      '2 cans diced tomatoes',
      '1 can tomato sauce or purée',
      '½ to 1 cup water, if needed',
      '½ medium white onion, diced',
      '3 garlic cloves, minced',
      '2 celery stalks, chopped',
      '1 yellow or green pepper, diced',
      '1 to 2 tbsp chili powder',
      '1 tbsp ground cumin',
      '1 tsp salt',
      '1 tsp ancho lime seasoning',
      '1 tsp smoked paprika',
      '1 tsp ground black pepper',
      '1 tsp garlic powder',
      '1 tbsp maple syrup or brown sugar',
      'To serve: shredded cheese, sour cream, and sliced green onions',
    ],
    instructions: [
      'Brown the ground beef in a large pot over medium-high heat, breaking it up as it cooks.',
      'Add the onion, celery, pepper, and garlic and cook until softened, about 5 minutes.',
      'Stir in the chili powder, cumin, salt, ancho lime seasoning, smoked paprika, black pepper, and garlic powder and cook for a minute until fragrant.',
      'Add the diced tomatoes, tomato sauce, both cans of chili beans with their sauce, and the maple syrup. Loosen with water if it looks too thick.',
      'Simmer gently, uncovered, for 45 minutes to 1 hour, stirring now and then. Serve topped with cheese, sour cream, and green onions.',
    ],
    createdAt: day('2022-11-06'),
  },
  // Ingredients and method from the caption.
  {
    id: 'roasted-garlic-spread',
    title: 'Roasted Garlic Spread',
    description:
      'Two bulbs of garlic roasted in foil until sweet and soft, then mashed with olive oil, salt, and pepper. Spread it on bread or crackers, add it to your next meal, or stir it into mashed potatoes.',
    category: 'Sauces & Basics',
    prepTime: '5 min',
    cookTime: '30 min',
    servings: 6,
    difficulty: 'Easy',
    imageUrl: '/recipes/roasted-garlic-spread.jpg',
    sourceUrl: 'https://www.instagram.com/reel/CkWbZ-QA0yq/',
    ingredients: ['2 bulbs garlic', 'Olive oil', 'Salt and pepper', 'Bread or crackers, to serve'],
    instructions: [
      'Set the garlic bulbs on a piece of foil, sprinkle with olive oil, salt, and pepper, and wrap them up tightly.',
      'Roast in the oven at 400°F (200°C) for approximately 30 minutes, until the cloves are soft.',
      'Squeeze the roasted cloves out of their skins into a bowl. Add salt and pepper to taste and a little olive oil, then mash it up.',
      'Use as desired on breads or crackers, in your next meal, or even in your mashed potatoes.',
    ],
    createdAt: day('2022-10-30'),
  },
  // Ingredients and method from the caption.
  {
    id: 'bbq-back-ribs',
    title: 'Oven BBQ Back Ribs',
    description:
      'The most flavourful, tender ribs you will have. A dry rub of oregano, Cajun seasoning, and Garlic Plus, a slow steam in foil, and a final brush of barbecue sauce under the broiler.',
    category: 'Mains',
    prepTime: '10 min',
    cookTime: '2 hr 5 min',
    servings: 4,
    difficulty: 'Easy',
    imageUrl: '/recipes/bbq-back-ribs.jpg',
    sourceUrl: 'https://www.instagram.com/reel/CkGfArXAUm-/',
    ingredients: [
      '2 racks pork back ribs',
      'Oregano',
      'Cajun seasoning',
      'Garlic Plus seasoning',
      'Olive oil',
      'Your favourite barbecue sauce',
    ],
    instructions: [
      'Season the ribs liberally with oregano, Cajun seasoning, and Garlic Plus, then rub it into the meat with olive oil.',
      'Wrap the ribs tightly in foil to make a steaming packet.',
      'Cook in the oven at 350°F (180°C) for about two hours, until tender.',
      'Unwrap, brush with your favourite barbecue sauce, and place under the broiler for five minutes. Enjoy.',
    ],
    createdAt: day('2022-10-24'),
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
