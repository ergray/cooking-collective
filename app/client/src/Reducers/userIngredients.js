function userIngredientState(state = [], action){
    switch(action.type){
        case "INITIALIZE_USER_INGREDIENTS":
            
            var updatedIngredients = []
            
            updatedIngredients = action.array[0].map(function(ingredient){
                return ingredient
            })

            return updatedIngredients
        case "UPDATE_USER_INGREDIENTS":
            console.log(action.array)
            return action.array
        default:
            return state
    }
}

const defaultIngredient = {
    name: "",
    quantity: ''
}

function newUserIngredient(state = defaultIngredient, action){
    switch(action.type){
        case "UPDATE_NEW_INGREDIENT":
        console.log('updated ingredient: ', action.object)
            return action.object
        default:
            return state
    }
}

export { userIngredientState, newUserIngredient }