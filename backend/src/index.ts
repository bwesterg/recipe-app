import express from 'express';
import cors from 'cors';
import "dotenv/config";
import * as RecipeAPI from './recipe-api';
import {PrismaClient} from '@prisma/client';

const app = express();
const prismaClient = new PrismaClient();

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

app.post("/api/recipes/favorite", async (req, res)=>{
    const recipeId = req.body.recipeId;

    try {
        const favoriteRecipe = await prismaClient.favoriteRecipes.create({
            data: {
                recipeId: recipeId
            }
        });
        return res.status(201).json(favoriteRecipe)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "something went wrong"})
    }
});

app.get("/api/recipes/favorite", async (req, res) => {
    try {
        const recipes = await prismaClient.favoriteRecipes.findMany();
        const recipeIds = recipes.map((recipe)=> recipe.recipeId.toString());

        const favorites = await RecipeAPI.getFavoriteRecipesByIDs(recipeIds);

        return res.json(favorites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "something went wrong"})
    }
})

app.delete('/api/recipes/favorite', async (req, res)=> {
    const recipeId = req.body.recipeId

    try {
        await prismaClient.favoriteRecipes.delete({
            where: {
                recipeId: recipeId
            }
        })
        return res.status(204).send()
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "something went wrong"})
    }
})

app.listen(5000, () => {
    console.log("server running on localhost:5000");
});