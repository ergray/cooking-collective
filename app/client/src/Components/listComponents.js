import React from 'react'

class ListWithQuantity extends React.Component{

    renderItem(item){
        return (<li key={item.id}>
                    {Math.round(item.quantity*10000)/10000} {item.measurement} of {item.name}
                </li>)
    }
    render(){
        return (
            <ul>
                {this.props.list.map(this.renderItem)}
            </ul>
        )
    }
}

export default ListWithQuantity
    