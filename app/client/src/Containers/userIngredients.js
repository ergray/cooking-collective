import React from 'react'
import { UserIngredientComponent } from '../Components/userLayoutComponent'

class UserIngredientContainer extends React.Component{

    render(){
        return (
            <UserIngredientComponent onChange={this.props.onChange} 
                                     onClick={this.props.onClick} 
                                     listMap={this.props.listMap} 
                                     listValues={this.props.listValues}
            />
        )
    }
}

export default UserIngredientContainer