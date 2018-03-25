const ingredients = (state = [], action) => {
    switch(action.type){
        case 'SEARCH_INGREDIENTS':
            return Object.assign({}, state, {
                datalist: action.datalist
            })
        case 'ADD_ROW':
            return state
        default: 
            return state
    }
}



export default ingredients