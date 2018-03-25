import React from 'react'
import { Link } from 'react-router'

class UserHeadingComponent extends React.Component{
    constructor(){
        super()
        this.state = {
            style: {
                height: '10px'
            }
        }
    }
    render(){
        return (
            <h1>Welcome {this.props.name}</h1>
        )
    }
}

class UserIngredientComponent extends React.Component{
    constructor(){
        super()
        this.state = {
            measurements: ['oz', 'lb', 'g']
        }
    }

    renderItem(item){
       return (<li id={item.id} 
                   key={item.id}>
                        {item.name}
                        <input id={item.id} 
                               type="number" 
                               name={item.name} 
                               onChange={this.props.onChange[0]} 
                               value={Math.round(item.quantity*10000/10000)}>
                        </input>

                  {/*Select value for Measurements*/}
                  <select value={item.measurement} 
                          onChange={this.props.onChange[1]}>
                            {this.state.measurements.map(function(measurement){
                                return (<option id={item.id} value={measurement}>{measurement}</option>)
                            })}
                  </select>
               </li>)
    }

    render(props){
        return (
            <div>
                <ul>{this.props.listMap.map(this.renderItem, this)}</ul>
            </div>
        )
    }
}

class UserRecipeComponent extends React.Component{
    renderItem(item){
        console.log(this.props.userState.id)
        item.name = item.name.replace(/'+/, '\'')
        return <li key={item.id}>
                    <Link to={{pathname: '/recipe/'+item.name}}>{item.name}</Link>
               </li>
    }

    render(){
        return (
            <div>
                <ul>{this.props.recipes.map(this.renderItem, this)}</ul>
            </div>
        )        
    }
}

class UserHomeComponent extends React.Component{

    render(){
        return (
        <div></div>
        )    
    }
}

export { UserHeadingComponent, UserIngredientComponent, UserHomeComponent, UserRecipeComponent }