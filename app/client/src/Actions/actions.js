export function updateIngredientDatalist(object){
    return {type: "CHANGE_DATALIST", object}
}

export function updateIngredientObject(object){
    return {type: "UPDATE_NEW_INGREDIENT", object}
}

export function visibilityFilter(component){
    return {type: "VISIBILITY_FILTER", component}
}

export function updateUserState(object){
    return {type: "UPDATE_USER", object}
}

export function clearUserState(object){
    return {type: "CLEAR", object}
}

export function updateRecipes(array){
    return {type: "UPDATE_RECIPES", array}
}

export function initializeUserIngredients(array){
    return {type: "INITIALIZE_USER_INGREDIENTS", array}
}

export function updateUserIngredients(array){
    return {type: "UPDATE_USER_INGREDIENTS", array}
}

export function updateIngredientList(array){
    return {type: "PULL_LIST", array}
}

export function updateRecipeCreation(object){
    return {type: "NEW_RECIPE", object}
}

export function updateRecipePage(object){
    return {type: "UPDATE_RECIPE_PAGE", object}
}


