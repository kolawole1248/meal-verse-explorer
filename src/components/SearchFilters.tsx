
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RecipeFilter } from '../types/recipe';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  selectedDiets: string[];
  selectedCuisines: string[];
  searchQuery: string;
  updateFilter: (filter: RecipeFilter) => void;
  clearFilters: () => void;
}

const SearchFilters = ({
  selectedDiets,
  selectedCuisines,
  searchQuery,
  updateFilter,
  clearFilters
}: SearchFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      type: 'query',
      value: localSearchQuery,
      selected: true
    });
  };

  const handleDietChange = (diet: string, checked: boolean) => {
    updateFilter({
      type: 'diet',
      value: diet,
      selected: checked
    });
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    updateFilter({
      type: 'cuisine',
      value: cuisine,
      selected: checked
    });
  };

  // Lists of common diets and cuisines
  const diets = [
    "vegetarian", "vegan", "gluten-free", "dairy-free",
    "keto", "paleo", "low-carb", "high-protein"
  ];

  const cuisines = [
    "italian", "mexican", "american", "indian", "chinese", 
    "japanese", "thai", "mediterranean", "french", "greek"
  ];

  const hasActiveFilters = selectedDiets.length > 0 || selectedCuisines.length > 0 || searchQuery !== '';

  return (
    <div className="w-full mb-6 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Diet</span>
              {selectedDiets.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                  {selectedDiets.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Dietary Preferences</h4>
              <div className="grid gap-3">
                {diets.map((diet) => (
                  <div key={diet} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`diet-${diet}`} 
                      checked={selectedDiets.includes(diet)}
                      onCheckedChange={(checked) => 
                        handleDietChange(diet, checked === true)
                      }
                    />
                    <Label htmlFor={`diet-${diet}`} className="capitalize">{diet}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Cuisine</span>
              {selectedCuisines.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                  {selectedCuisines.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Cuisines</h4>
              <div className="grid gap-3">
                {cuisines.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cuisine-${cuisine}`} 
                      checked={selectedCuisines.includes(cuisine)}
                      onCheckedChange={(checked) => 
                        handleCuisineChange(cuisine, checked === true)
                      }
                    />
                    <Label htmlFor={`cuisine-${cuisine}`} className="capitalize">{cuisine}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
