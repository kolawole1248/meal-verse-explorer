
import { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ingredient } from '../types/recipe';
import { X, Plus } from "lucide-react";

interface RecipeFormProps {
  onClose: () => void;
}

const RecipeForm = ({ onClose }: RecipeFormProps) => {
  const { addRecipe } = useRecipes();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [servings, setServings] = useState(4);
  const [readyInMinutes, setReadyInMinutes] = useState(30);
  const [summary, setSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: 1, unit: '' }
  ]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleToggleDiet = (diet: string) => {
    if (diets.includes(diet)) {
      setDiets(diets.filter((d) => d !== diet));
    } else {
      setDiets([...diets, diet]);
    }
  };

  const handleToggleCuisine = (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter((c) => c !== cuisine));
    } else {
      setCuisines([...cuisines, cuisine]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !summary || ingredients.some(i => !i.name)) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Create new recipe
    const newRecipe = {
      title,
      image,
      servings,
      readyInMinutes,
      summary,
      instructions,
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
      cuisines,
      diets
    };
    
    addRecipe(newRecipe);
    onClose();
  };

  const dietOptions = [
    "vegetarian", "vegan", "gluten-free", "dairy-free",
    "keto", "paleo", "low-carb", "high-protein"
  ];

  const cuisineOptions = [
    "italian", "mexican", "american", "indian", "chinese", 
    "japanese", "thai", "mediterranean", "french", "greek"
  ];

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold mb-6">Add New Recipe</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title *</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/recipe-image.jpg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input 
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="readyInMinutes">Prep Time (minutes)</Label>
              <Input 
                id="readyInMinutes"
                type="number"
                min="1"
                value={readyInMinutes}
                onChange={(e) => setReadyInMinutes(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Summary *</Label>
            <Textarea 
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of the recipe"
              rows={3}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Ingredients *</Label>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-grow">
                  <Label htmlFor={`amount-${index}`} className="text-xs">Amount</Label>
                  <Input 
                    id={`amount-${index}`}
                    type="number"
                    min="0"
                    step="0.25"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
                    className="mb-2"
                  />
                </div>
                
                <div className="flex-grow">
                  <Label htmlFor={`unit-${index}`} className="text-xs">Unit</Label>
                  <Input 
                    id={`unit-${index}`}
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    placeholder="cup, tbsp"
                    className="mb-2"
                  />
                </div>
                
                <div className="flex-grow-[2]">
                  <Label htmlFor={`name-${index}`} className="text-xs">Ingredient</Label>
                  <Input 
                    id={`name-${index}`}
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    placeholder="e.g., flour"
                    className="mb-2"
                    required
                  />
                </div>
                
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveIngredient(index)}
                  className="mb-2"
                  disabled={ingredients.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-1"
              onClick={handleAddIngredient}
            >
              <Plus className="h-4 w-4" /> Add Ingredient
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea 
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Preheat oven to 350°F. 2. Mix ingredients in a bowl."
            rows={5}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 gap-2">
              {dietOptions.map((diet) => (
                <div 
                  key={diet}
                  className={`checkbox-recipe ${diets.includes(diet) ? 'border-primary bg-primary/10' : ''}`}
                  onClick={() => handleToggleDiet(diet)}
                  data-state={diets.includes(diet) ? "checked" : "unchecked"}
                >
                  <div className="capitalize">{diet}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Cuisine Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {cuisineOptions.map((cuisine) => (
                <div 
                  key={cuisine}
                  className={`checkbox-recipe ${cuisines.includes(cuisine) ? 'border-primary bg-primary/10' : ''}`}
                  onClick={() => handleToggleCuisine(cuisine)}
                  data-state={cuisines.includes(cuisine) ? "checked" : "unchecked"}
                >
                  <div className="capitalize">{cuisine}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Recipe</Button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
