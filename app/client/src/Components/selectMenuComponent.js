import React from 'react'
import FormInput from './forminput.js'

class SelectMenuComponent extends React.Component{

    renderItem(item){
        return <option key={item.id} value={item.id} label={item.name}></option>;
    }    

    render(){
        console.log(this.props)
        return (
            <div>
                <form onSubmit={this.props.onSubmit}>
                    <select onChange={this.props.onChange}> 
                        {this.props.items.map(this.renderItem)} 
                    </select>
                    <FormInput 
                        name="quantity" 
                        type="number" 
                        onChange={e => this.props.onChange(e)} 
                        value={this.props.quantity}  
                    />
                    <FormInput 
                        type="submit" 
                        description="Add Item"
                    />                    
                </form>
            </div>
        )
    }
}

export default SelectMenuComponent
