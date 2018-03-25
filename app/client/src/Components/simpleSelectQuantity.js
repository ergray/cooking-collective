import React from 'react'

class SelectIngredient extends React.Component {
    renderItem(item){
        return <option key={item.id} value={item.id} label={item.name}></option>;
    }

    render(){
        return (
            <select onChange={this.props.onChange}> 
                {this.props.items.map(this.renderItem)} 
            </select>
        )
    }
}

export default SelectIngredient