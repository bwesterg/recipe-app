import "./App.css";
import { FormEvent, useEffect, useRef, useState } from 'react';
import * as api from './api';
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";


type Tabs = "search" | 'favorites';


const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const favoriteRecipes = await api.getFavoriteRecipes()
        setFavoriteRecipes(favoriteRecipes);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavoriteRecipes();
  }, [])

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1)
      setRecipes(recipes.results);
      pageNumber.current = 1;
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <div>
      <div className="tabs">
        <h1 onClick={()=> setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={()=> setSelectedTab("favorites")}>Favorites</h1>
      </div>
      {selectedTab === "search" && (
        <>    
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input 
              type="text" 
              required 
              placeholder="Search for food or recipes"    
              value={searchTerm}
              onChange={(event)=> setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>

          {recipes.map((recipe)=> (
            <div>
              <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)}/>
            </div>
          ))}
          <button
            className="view-more-button"
            onClick={handleViewMoreClick}
          >
            View More
          </button>
        </>  
      )}

      {selectedTab === "favorites" && (
        <div>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard 
              recipe={recipe} 
              onClick={()=> setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* show recipe details if modal is selected */}
      {selectedRecipe ? (
        <RecipeModal 
          recipeId={selectedRecipe.id.toString()} 
          onClose={()=>setSelectedRecipe(undefined)}
        /> 
      ) : null}
      {/* setting RecipeModal to be null if setSelectedRecipe is 
      undefined - which happens when close button is 
      clicked - and if RecipeModal is null, it doesn't appear. */}
    </div>
  );
};

export default App;