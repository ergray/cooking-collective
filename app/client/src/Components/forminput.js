import React from 'react'

class FormInput extends React.Component{
    render(){
        return (
            <input type={this.props.type} 
                   placeholder={this.props.placeholder} 
                   value={this.props.value} 
                   onChange={this.props.onChange} 
                   name={this.props.name}
            />
        )
    }
}


export default FormInput