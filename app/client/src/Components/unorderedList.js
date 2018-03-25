import React from 'react'

class SimpleList extends React.Component{

    renderItem(item){
        return <li key={item.id}>{item.name}
                    <div>
                        Quantity:<input type="number" 
                                        onChange={(e) => this.props.onChange(e)} 
                                        name="recipequantity" 
                                        key={item.id}>
                                </input>
                    </div>
               </li>
    }

    render(){
        return (
            <ul>{this.props.list.map(this.renderItem, this)}</ul>
        )
    }
}

export default SimpleList