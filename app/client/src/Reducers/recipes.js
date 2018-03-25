function recipeState(state = [], action){
    switch(action.type){
        case "UPDATE_RECIPES":
            
            var updatedRecipe = []
            
            updatedRecipe = action.array.map(function(recipe){
                return recipe
            })

            return updatedRecipe
            
        default:
            return state
    }
}

export default recipeState