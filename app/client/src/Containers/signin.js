import React from 'react'
import FormInput from '../Components/forminput'
import { ButtonComponent } from '../Components/functionalButton.js'
import axios from 'axios'
import { history } from '../Store/store'
import TextComponent from '../Components/textComponent'
axios.defaults.withCredentials = true

class SignIn extends React.Component{
    constructor(){
        super()
        this.state = {
            visibleComponents: {
                noInfoWarning: false,
                toggleMask: true,
                badPassword: false
            },
            email: '',
            password: '',
            // host: 'http://localhost:3001/'
            host: 'https://cooking-collective.herokuapp.com/'
        }
    }


    handleChange(e){
        e.preventDefault()
        if (this.state.visibleComponents.noInfoWarning === true){
            this.toggleVisible('noInfoWarning')
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick(e){
        e.preventDefault()
        this.toggleVisible('toggleMask')
    }

    toggleVisible(component){
        let newState = Object.assign({}, this.state)
        !newState.visibleComponents[component] ? newState.visibleComponents[component] = true : newState.visibleComponents[component] = false
        this.setState({newState})
    }

    handleSubmit(e){
        e.preventDefault()
        if (this.state.email === '' || this.state.password.length === 0){
            this.toggleVisible('noInfoWarning');
            return
        }

        axios.post(this.state.host + 'signin',
        {
            email: this.state.email,
            password: this.state.password
        })
        .then((response) => {
            response.data.redirectPath ? 
                console.log('redirect seen') 
                : this.props.updateUserState({
                    user: [{id: response.data.id}]
                })
        }).then(() => {
            this.props.userState.id === undefined ?
            (this.state.visibleComponents.badPassword === true ?
                null
            :this.toggleVisible('badPassword'))
            : history.push('/'+this.props.userState.id)
        })      
    }
    
    // handleTest(e){
    //     e.preventDefault()
    //     axios.get(this.state.host + 'sqltest')
    // }

    render(){
        return (
            <div>
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <FormInput type='text'  placeholder='email address' onChange={(e) => this.handleChange(e)} name='email'/>
                <FormInput type={this.state.visibleComponents.toggleMask === true ? 'password' : 'input'}  placeholder='password' onChange={(e) => this.handleChange(e)} name='password'/>
                <FormInput id='2' value='Sign In!' name="signin" description="Sign In!" type="submit"/><br/><br/>
                {this.state.visibleComponents.badPassword === false ? null : <div><span>Incorrect password, please re-enter.</span></div>}
                <ButtonComponent name='mask' description={this.state.visibleComponents.toggleMask === true ? 'Show Password' : 'Hide Password'} onClick={(e) => this.handleClick(e)}/>     
                {/*<ButtonComponent name='test' description='test' onClick={(e) => this.handleTest(e)}/>     */}                
                {this.state.visibleComponents.noInfoWarning === false ? null : <div><span>Sorry, please make sure both email and password are filled out</span></div>}
            </form>
            </div>
        )
    }
}

export default SignIn