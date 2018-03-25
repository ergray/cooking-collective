function userState(state = {}, action){
    switch(action.type){
        case "UPDATE_USER":
            console.log(action.object)
            var updatedUser = {}
            for (var prop in action.object.user[0]){
                if (action.object.user[0].hasOwnProperty(prop)){
                    updatedUser[prop] = action.object.user[0][prop]
                }
            }
            return updatedUser
        case "CLEAR":
            return {}
        default:
            return state
    }
}

export default userState