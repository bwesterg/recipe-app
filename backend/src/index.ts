import express from 'express';
import cors from 'cors';
import "dotenv/config";
import * as RecipeAPI from './recipe-api';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async (req, res) => {
    // res.json({message: "success!" });
    //GET http://localhost/api/recipes/search?searchTerm=burders&page=1
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await RecipeAPI.searchRecipes(searchTerm, page);
    
    return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
    const recipeId = req.params.recipeId; 
    const results = await RecipeAPI.getRecipeSummary(recipeId)
    return res.json(results);
})

app.listen(5000, () => {
    console.log("server running on localhost:5000");
});