
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RecipeForm from './RecipeForm';

interface NavbarProps {
  showFavorites: boolean;
  toggleFavorites: () => void;
}

const Navbar = ({ showFavorites, toggleFavorites }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-recipe-dark">
            <span className="text-recipe-bright">Meal</span>Verse
          </h1>
        </div>
        
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant={showFavorites ? "default" : "outline"}
            onClick={toggleFavorites}
          >
            {showFavorites ? "All Recipes" : "Favorites"}
          </Button>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Recipe</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <RecipeForm onClose={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
