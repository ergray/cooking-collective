import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import searches from './searches'
// import ingredients from './searches'
import { ingredientsDatalist, ingredientsNotInInventory } from './datalist'
import userState from './user'
import recipeState from './recipes'
import { userIngredientState, newUserIngredient }from './userIngredients'
import recipeCreation from './recipeCreation'
import recipePage from './recipePage'

const cookingCollective = combineReducers({
    ingredientsDatalist,
    userState,
    recipeState,
    userIngredientState,
    ingredientsNotInInventory,
    recipeCreation,
    recipePage,
    newUserIngredient,
    routing: routerReducer
    // searches
    // ingredients
})

export default cookingCollective