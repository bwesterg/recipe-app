import { useEffect, useState } from 'react';
import { RecipeSummary } from '../types';
import * as RecipeAPI from '../api';

interface Props {
    recipeId: string;
}


const RecipeModal = ({ recipeId }: Props) => {

    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

    useEffect(() => {
        // putting function within useEffect hook b/c async cannot be used at top level of useEffect
        const fetchRecipeSummary = async()=> {
            try {
                const summaryRecipe = await RecipeAPI.getRecipeSummary(recipeId);
                setRecipeSummary(summaryRecipe);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRecipeSummary();
    }, [recipeId]);

    if(!recipeSummary)
    {
        return <></>;
    }

    return(
        <>
            <div className="overlay"></div>  
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{recipeSummary?.id}</h2>
                        <span className="close-btn">&times;</span>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
                    {/* do not use dangerouslySetInnerHTML unless api source is trusted b/c malevolent code can be injected */}
                    {/* doing this because the summary contains bold and other style tags */}
                </div>
            </div>
        </>
    )
};

export default RecipeModal;