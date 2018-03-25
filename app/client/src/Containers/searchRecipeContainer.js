import React from 'react'
import { SearchBoxConnect } from './app'
import FormInput from '../Components/forminput'
import { ButtonComponent } from '../Components/functionalButton'

class SearchRecipe extends React.Component{
    constructor(){
        super()
        this.state = {
            numberOfRows: 1
        }
    }

    handleClick(e){
        e.preventDefault()
        var rowState = Object.assign({}, this.state)
        switch(e.target.name){
            case 'add':
                rowState.numberOfRows += 1
                this.setState(rowState)
                break
            default:
                break
        }    
    }

    handleChange(e){
        console.log(e.value)
    }

    render(){
        const ingredientRows = []

        for (var i = 0; i < this.state.numberOfRows; i++){
            console.log(ingredientRows)
            // ingredientRows.push(<div>goodbye</div>)
            ingredientRows.push(<div key={i}>
                                <SearchBoxConnect placeholder={['Ingredient Name', 'Amount']} 
                                                  title="Ingredient" 
                                                  key={i} 
                                                  id={i} 
                                                  value={['ted']}
                                                  quantity={false}
                                                  onChange={[(e) => this.handleChange(e)]}
                                                  name="searchRecipeList" 
                                />
                                <ButtonComponent name="remove" 
                                                 onClick={(e) => this.handleClick(e)} 
                                                 description="Remove"
                                />
                            </div>)
        }

        return (
            <div>
                <h2>Search Recipes:</h2>
                <br/>Search By Name:<FormInput />
                <br/> And / Or
                <br/>Search By Ingredient:
                    <ButtonComponent name="add" 
                                     onClick={(e) => this.handleClick(e)} 
                                     description="Add Search Criteria" 
                    />
                    {ingredientRows}
            </div>
        )
    }
}

export { SearchRecipe }