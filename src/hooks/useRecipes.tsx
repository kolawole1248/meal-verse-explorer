
import { useState, useEffect } from 'react';
import { Recipe, RecipesState, RecipeFilter } from '../types/recipe';
import { useToast } from "@/components/ui/use-toast";

// This is a placeholder API key. In a real environment, this would be stored securely.
const API_KEY = "YOUR_EDAMAM_API_KEY";

export const useRecipes = () => {
  const { toast } = useToast();
  const [state, setState] = useState<RecipesState>({
    recipes: [],
    filteredRecipes: [],
    favorites: [],
    loading: true,
    error: null,
    selectedDiets: [],
    selectedCuisines: [],
    searchQuery: '',
  });

  // Load recipes from localStorage or fallback to sample data
  useEffect(() => {
    const loadRecipes = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        // Try to load recipes from localStorage first
        const savedRecipes = localStorage.getItem('recipes');
        const savedFavorites = localStorage.getItem('favorites');
        
        let recipes: Recipe[] = [];
        
        if (savedRecipes) {
          recipes = JSON.parse(savedRecipes);
        } else {
          // If no saved recipes, load from our sample data
          recipes = sampleRecipes;
          // In a real app, you would fetch from the API here
          // const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=YOUR_APP_ID&app_key=${API_KEY}&diet=balanced`);
          // const data = await response.json();
          // recipes = transformApiData(data);
        }
        
        const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        
        setState({
          ...state,
          recipes,
          filteredRecipes: recipes,
          favorites,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading recipes:', error);
        setState({
          ...state,
          error: 'Failed to load recipes. Please try again later.',
          loading: false,
        });
        
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadRecipes();
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (!state.loading && state.recipes.length > 0) {
      localStorage.setItem('recipes', JSON.stringify(state.recipes));
    }
  }, [state.recipes]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  }, [state.favorites]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (!state.loading) {
      applyFilters();
    }
  }, [state.selectedDiets, state.selectedCuisines, state.searchQuery]);

  const applyFilters = () => {
    let filtered = state.recipes;

    // Apply diet filters
    if (state.selectedDiets.length > 0) {
      filtered = filtered.filter((recipe) => 
        recipe.diets?.some(diet => state.selectedDiets.includes(diet.toLowerCase()))
      );
    }

    // Apply cuisine filters
    if (state.selectedCuisines.length > 0) {
      filtered = filtered.filter((recipe) => 
        recipe.cuisines?.some(cuisine => state.selectedCuisines.includes(cuisine.toLowerCase()))
      );
    }

    // Apply search query filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter((recipe) => 
        recipe.title.toLowerCase().includes(query) || 
        recipe.summary.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }

    setState({ ...state, filteredRecipes: filtered });
  };

  const toggleFavorite = (recipeId: string) => {
    // Update favorites array
    let newFavorites = [...state.favorites];
    const isFavorite = newFavorites.includes(recipeId);
    
    if (isFavorite) {
      newFavorites = newFavorites.filter(id => id !== recipeId);
      toast({
        title: "Removed from favorites",
        description: "Recipe removed from your favorites",
      });
    } else {
      newFavorites.push(recipeId);
      toast({
        title: "Added to favorites",
        description: "Recipe added to your favorites",
      });
    }
    
    // Update recipes to reflect favorite status
    const updatedRecipes = state.recipes.map(recipe => {
      if (recipe.id === recipeId) {
        return { ...recipe, favorite: !isFavorite };
      }
      return recipe;
    });
    
    setState({
      ...state,
      favorites: newFavorites,
      recipes: updatedRecipes,
      filteredRecipes: state.filteredRecipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, favorite: !isFavorite } : recipe
      ),
    });
  };

  const addRecipe = (newRecipe: Omit<Recipe, 'id' | 'favorite'>) => {
    const recipeWithId: Recipe = {
      ...newRecipe,
      id: `user-${Date.now()}`,
      favorite: false,
      userSubmitted: true,
    };
    
    setState({
      ...state,
      recipes: [...state.recipes, recipeWithId],
      filteredRecipes: [...state.filteredRecipes, recipeWithId],
    });
    
    toast({
      title: "Recipe Added",
      description: "Your recipe has been added successfully!",
    });
    
    return recipeWithId;
  };

  const updateFilter = (filter: RecipeFilter) => {
    const { type, value, selected } = filter;
    
    if (type === 'diet') {
      setState({
        ...state,
        selectedDiets: selected 
          ? [...state.selectedDiets, value]
          : state.selectedDiets.filter(diet => diet !== value)
      });
    } else if (type === 'cuisine') {
      setState({
        ...state,
        selectedCuisines: selected 
          ? [...state.selectedCuisines, value] 
          : state.selectedCuisines.filter(cuisine => cuisine !== value)
      });
    } else if (type === 'query') {
      setState({ ...state, searchQuery: value });
    }
  };

  const clearFilters = () => {
    setState({
      ...state,
      selectedDiets: [],
      selectedCuisines: [],
      searchQuery: '',
      filteredRecipes: state.recipes,
    });
  };

  return {
    recipes: state.filteredRecipes,
    allRecipes: state.recipes,
    favorites: state.favorites,
    loading: state.loading,
    error: state.error,
    selectedDiets: state.selectedDiets,
    selectedCuisines: state.selectedCuisines,
    searchQuery: state.searchQuery,
    toggleFavorite,
    addRecipe,
    updateFilter,
    clearFilters,
  };
};

// Sample data to use when no localStorage data is available
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Vegetable Curry",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500",
    servings: 4,
    readyInMinutes: 45,
    summary: "A flavorful vegetable curry with coconut milk and aromatic spices.",
    cuisines: ["indian", "asian"],
    diets: ["vegetarian", "vegan"],
    dishTypes: ["main course", "dinner"],
    instructions: "1. Heat oil in a pot. 2. Add onions and sauté until translucent. 3. Add spices and cook until fragrant. 4. Add vegetables and coconut milk. 5. Simmer until vegetables are tender.",
    ingredients: [
      { name: "coconut oil", amount: 2, unit: "tbsp" },
      { name: "onion", amount: 1, unit: "large" },
      { name: "curry powder", amount: 2, unit: "tbsp" },
      { name: "mixed vegetables", amount: 4, unit: "cups" },
      { name: "coconut milk", amount: 1, unit: "can" }
    ],
    favorite: false
  },
  {
    id: "2",
    title: "Grilled Chicken Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
    servings: 2,
    readyInMinutes: 30,
    summary: "A healthy grilled chicken salad with mixed greens and a light vinaigrette.",
    cuisines: ["american", "mediterranean"],
    diets: ["high-protein", "low-carb"],
    dishTypes: ["salad", "lunch"],
    instructions: "1. Season chicken breasts with salt and pepper. 2. Grill until cooked through. 3. Slice chicken. 4. Toss with mixed greens and vegetables. 5. Drizzle with vinaigrette.",
    ingredients: [
      { name: "chicken breasts", amount: 2, unit: "pieces" },
      { name: "mixed greens", amount: 4, unit: "cups" },
      { name: "cherry tomatoes", amount: 1, unit: "cup" },
      { name: "cucumber", amount: 1, unit: "medium" },
      { name: "olive oil vinaigrette", amount: 3, unit: "tbsp" }
    ],
    favorite: false
  },
  {
    id: "3",
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500",
    servings: 24,
    readyInMinutes: 40,
    summary: "Classic homemade chocolate chip cookies that are soft in the center and crispy around the edges.",
    cuisines: ["american"],
    diets: ["vegetarian"],
    dishTypes: ["dessert", "snack"],
    instructions: "1. Preheat oven to 350°F. 2. Cream butter and sugars. 3. Add eggs and vanilla. 4. Mix in dry ingredients. 5. Fold in chocolate chips. 6. Drop spoonfuls onto baking sheet. 7. Bake for 10-12 minutes.",
    ingredients: [
      { name: "butter", amount: 1, unit: "cup" },
      { name: "brown sugar", amount: 1, unit: "cup" },
      { name: "granulated sugar", amount: 0.5, unit: "cup" },
      { name: "eggs", amount: 2, unit: "large" },
      { name: "vanilla extract", amount: 2, unit: "tsp" },
      { name: "all-purpose flour", amount: 2.75, unit: "cups" },
      { name: "chocolate chips", amount: 2, unit: "cups" }
    ],
    favorite: false
  },
  {
    id: "4",
    title: "Spaghetti Bolognese",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?q=80&w=500",
    servings: 6,
    readyInMinutes: 60,
    summary: "A classic Italian pasta dish with a rich and flavorful meat sauce.",
    cuisines: ["italian", "mediterranean"],
    diets: [],
    dishTypes: ["main course", "dinner"],
    instructions: "1. Brown ground beef in a large pot. 2. Add onions, carrots, and celery and cook until softened. 3. Add garlic and cook until fragrant. 4. Add tomato paste, diced tomatoes, and seasonings. 5. Simmer for 30 minutes. 6. Cook spaghetti according to package directions. 7. Serve sauce over pasta with grated Parmesan.",
    ingredients: [
      { name: "ground beef", amount: 1, unit: "pound" },
      { name: "onion", amount: 1, unit: "medium" },
      { name: "carrots", amount: 2, unit: "medium" },
      { name: "celery", amount: 2, unit: "stalks" },
      { name: "garlic", amount: 3, unit: "cloves" },
      { name: "tomato paste", amount: 2, unit: "tbsp" },
      { name: "diced tomatoes", amount: 28, unit: "oz" },
      { name: "spaghetti", amount: 1, unit: "pound" }
    ],
    favorite: false
  },
  {
    id: "5",
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=500",
    servings: 1,
    readyInMinutes: 10,
    summary: "A simple and nutritious breakfast or snack with mashed avocado on toast.",
    cuisines: ["american", "california"],
    diets: ["vegetarian", "vegan"],
    dishTypes: ["breakfast", "snack"],
    instructions: "1. Toast bread until golden brown. 2. Mash avocado with a fork. 3. Mix in salt, pepper, and lemon juice. 4. Spread avocado mixture on toast. 5. Top with optional ingredients like red pepper flakes, microgreens, or a poached egg.",
    ingredients: [
      { name: "bread", amount: 2, unit: "slices" },
      { name: "avocado", amount: 1, unit: "ripe" },
      { name: "lemon juice", amount: 1, unit: "tsp" },
      { name: "salt", amount: 0.25, unit: "tsp" },
      { name: "black pepper", amount: 0.125, unit: "tsp" }
    ],
    favorite: false
  }
];
