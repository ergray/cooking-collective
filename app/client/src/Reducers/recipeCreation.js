// const defaultState = {
//     "0": {
//         name: "",
//         quantity: 0
//     }
// }

function recipeCreation(state = {}, action){
    switch(action.type){
        case "NEW_RECIPE":
            return action.object
        default:
            return state
    }
}

export default recipeCreation