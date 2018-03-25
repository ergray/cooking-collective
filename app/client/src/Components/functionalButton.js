import React from 'react'

class ButtonComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            styles: {
                default: {
                    color: 'red'
                },
                mobileTop: {
                    width: '20%',
                    height: '5em',
                    border: 'solid black',
                    borderWidth: '5px 5px 0px 5px',
                    backgroundColor: this.props.backgroundColor
                }
            }
        }
    }

    componentWillReceiveProps(nextProps){
        const nextState = Object.assign({}, this.state)
        nextState.styles.mobileTop.backgroundColor = nextProps.backgroundColor
        this.setState(nextState)
    }

    render(){
        return (
            <button style={(this.state.styles[this.props.style]) || this.state.styles.default} name={this.props.name} onClick={(e) => this.props.onClick(e)}>{this.props.description}</button>
        )
    }
}


export { ButtonComponent }