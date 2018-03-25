const defaultState = {
    comments: [],
    ingredients: [],
    name: "",
    author: "",
    instructions: ""
}

function recipePage(state = defaultState, action){
    switch(action.type){
        case "UPDATE_RECIPE_PAGE":
            return action.object
        default:
            return state
    }
}

export default recipePage