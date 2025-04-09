
export interface Recipe {
  id: string;
  title: string;
  image: string;
  servings: number;
  readyInMinutes?: number;
  sourceUrl?: string;
  summary: string;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
  instructions?: string;
  ingredients: Ingredient[];
  favorite: boolean;
  userSubmitted?: boolean;
}

export interface Ingredient {
  id?: number;
  name: string;
  amount: number;
  unit: string;
}

export interface RecipesState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  favorites: string[];
  loading: boolean;
  error: string | null;
  selectedDiets: string[];
  selectedCuisines: string[];
  searchQuery: string;
}

export type RecipeFilter = {
  type: 'diet' | 'cuisine' | 'query';
  value: string;
  selected: boolean;
}
