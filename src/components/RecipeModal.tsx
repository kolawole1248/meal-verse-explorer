
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Recipe } from '../types/recipe';
import { Heart, Clock, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  toggleFavorite: (recipeId: string) => void;
}

const RecipeModal = ({ recipe, isOpen, onClose, toggleFavorite }: RecipeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative h-64 md:h-80 w-full -mt-6 -mx-6 mb-2">
            <img 
              src={recipe.image || "https://via.placeholder.com/600x400?text=No+Image"} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <DialogTitle className="text-2xl md:text-3xl font-serif text-white">
                {recipe.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.readyInMinutes || "N/A"} min</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {recipe.diets?.map((diet, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {diet}
                </Badge>
              ))}
            </div>
          </div>
          
          <p className="text-gray-700">{recipe.summary}</p>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold font-serif mb-2">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-recipe-purple rounded-full flex items-center justify-center text-xs font-medium mr-2">
                    {index + 1}
                  </span>
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {recipe.instructions && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold font-serif mb-2">Instructions</h3>
                <div className="space-y-2 text-gray-700">
                  {recipe.instructions.split(/\d+\./).filter(Boolean).map((step, index) => (
                    <p key={index} className="flex">
                      <span className="w-6 h-6 bg-recipe-blue rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step.trim()}</span>
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex flex-row sm:flex-row sm:justify-between gap-2">
          <Button
            variant={recipe.favorite ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => toggleFavorite(recipe.id)}
          >
            <Heart className={recipe.favorite ? "fill-white" : ""} size={16} />
            {recipe.favorite ? "Favorited" : "Add to Favorites"}
          </Button>
          
          {recipe.sourceUrl && (
            <Button variant="outline" asChild>
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink size={16} />
                Original Recipe
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
