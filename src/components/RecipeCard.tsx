
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recipe } from '../types/recipe';
import { Heart, Clock, Users } from "lucide-react";
import RecipeModal from './RecipeModal';

interface RecipeCardProps {
  recipe: Recipe;
  toggleFavorite: (recipeId: string) => void;
}

const RecipeCard = ({ recipe, toggleFavorite }: RecipeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="recipe-card overflow-hidden h-full flex flex-col">
        <div className="relative h-48">
          <img 
            src={recipe.image || "https://via.placeholder.com/300x200?text=No+Image"} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
          >
            <Heart 
              className={`h-5 w-5 ${recipe.favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          {recipe.userSubmitted && (
            <Badge className="absolute bottom-2 left-2 bg-recipe-purple text-black">
              User Recipe
            </Badge>
          )}
        </div>
        
        <CardContent className="flex-grow pt-4">
          <h3 className="text-lg font-serif font-semibold line-clamp-2">{recipe.title}</h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">{recipe.summary}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.diets?.slice(0, 3).map((diet, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {diet}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{recipe.servings}</span>
          </div>
          
          {recipe.readyInMinutes && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
          )}
          
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            View Recipe
          </Button>
        </CardFooter>
      </Card>
      
      <RecipeModal 
        recipe={recipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
};

export default RecipeCard;
