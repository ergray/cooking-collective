import { createStore } from 'redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
import cookingCollective from '../Reducers/index'

const defaultState = {
    // ingredientsDatalist: [],
    ingredientsDatalist: {},
    userState: {},
    recipeState: [],
    userIngredientState: []
}

const store = createStore(cookingCollective, defaultState)

export const history = syncHistoryWithStore(browserHistory, store)

export default store


