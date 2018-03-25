// function ingredientsDatalist(state = [], action){
function ingredientsDatalist(state = {}, action){    
    switch(action.type){
        case "CHANGE_DATALIST":
            return action.object
        default:
            return state
    }
}

function ingredientsNotInInventory(state = [], action){
    switch(action.type){
        case "PULL_LIST":
            return action.array
        default:
            return state
    }
}

export { ingredientsDatalist, ingredientsNotInInventory }