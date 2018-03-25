import React from 'react'

class TextComponent extends React.Component{
    render(){
        return (
            <div>
                {this.props.name}: <textarea onChange={this.props.onChange} 
                                             rows={this.props.rows} 
                                             name={this.props.name} 
                                             type="text">
                                    </textarea>
            </div>
        )
    }
}

export default TextComponent