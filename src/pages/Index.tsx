
import { useState } from "react";
import { useRecipes } from "../hooks/useRecipes";
import Navbar from "../components/Navbar";
import SearchFilters from "../components/SearchFilters";
import RecipeCard from "../components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
  const {
    recipes,
    favorites,
    loading,
    error,
    selectedDiets,
    selectedCuisines,
    searchQuery,
    toggleFavorite,
    updateFilter,
    clearFilters,
  } = useRecipes();

  // Filter recipes to show only favorites if the favorites tab is selected
  const displayedRecipes = showFavorites
    ? recipes.filter((recipe) => favorites.includes(recipe.id))
    : recipes;

  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        showFavorites={showFavorites} 
        toggleFavorites={toggleFavoritesView} 
      />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">
          {showFavorites ? "Your Favorite Recipes" : "Discover Delicious Recipes"}
        </h1>

        <SearchFilters
          selectedDiets={selectedDiets}
          selectedCuisines={selectedCuisines}
          searchQuery={searchQuery}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center py-12 fade-in">
            <h3 className="text-xl font-medium mb-2">No recipes found</h3>
            <p className="text-gray-500">
              {showFavorites
                ? "You haven't added any recipes to your favorites yet."
                : "Try adjusting your filters to find recipes."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {displayedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        <div className="container">
          <p>MealVerse Recipe Explorer © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
