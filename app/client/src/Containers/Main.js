import React from 'react'
import { SignInConnect } from './app'

class Main extends React.Component{

    render(){
        return (
        <div className="App">
            <div className="App-header">
                <h2>The Cooking Collective</h2>
            </div>
            <p className="App-intro">
                Sign in with your account or create a new one!
            </p>
                <SignInConnect />
        </div>
        );
    }               
}

export default Main