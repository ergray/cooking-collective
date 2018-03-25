import React from 'react'
import { ButtonComponent } from '../Components/functionalButton'
// import SelectIngredient from '../Components/simpleSelectQuantity'
import { SearchBoxConnect } from './app.js'
import TextComponent from '../Components/textComponent'
import FormInput from '../Components/forminput'
import axios from 'axios'

class CreateRecipeContainer extends React.Component{
    constructor(){
        super()
        this.state = {
            currentId: 0,
            rows: [],
            visibleComponents: {
                ingredientWarning: false,
                nameWarning: false,
                instructionsWarning: false,
                quantityWarning: false

            },
            // host: 'http://localhost:3001/'
            host: 'https://cooking-collective.herokuapp.com/'
        }

    }

    searchForIngredient(value, id){
        axios.get(this.state.host+'guest/searchName/'+value)
        .then((response) => {
            var updatedList = Object.assign({}, this.props.ingredientsDatalist)
            updatedList[id] = response.data
            this.props.updateIngredientDatalist(updatedList)
        })
    }     

    handleChange(e){
        e.preventDefault()
        let varID = e.target.parentNode.id
        switch(e.target.name){
            case "searchRecipeList":
                if (e.target.value === ""){
                    this.props.updateIngredientDatalist({[e.target.id]: []})
                } else {
                    this.searchForIngredient(e.target.value, e.target.id)
                }
                
                this.updateIngredientValue(varID, "name", e.target.value)
                
                if (this.state.visibleComponents.ingredientWarning === true){
                    this.toggleVisible("ingredientWarning")
                }
                
                break
            case "instructions":
                this.changeRecipeText("instructions", e.target.value)
                if (this.state.visibleComponents.instructionsWarning === true){
                    this.toggleVisible("instructionsWarning")
                }
                break
            case "quantity":
                this.updateIngredientValue(e.target.parentNode.parentNode.id, "quantity", e.target.value)
                if (this.state.visibleComponents.quantityWarning === true){
                    this.toggleVisible("quantityWarning")
                }
               break
            case "name":
                this.changeRecipeText("name", e.target.value)
                if (this.state.visibleComponents.nameWarning === true){
                    this.toggleVisible("nameWarning")
                }
                break
            case "measurement":
                this.updateIngredientValue(e.target.parentNode.parentNode.id, "measurement", e.target.value)
                break
            default:
                break 
        }
    }


    updateIngredientValue(id, type, value){
        let recipeObject = Object.assign({}, this.props.recipeCreation)
        if (!recipeObject.ingredients){
            recipeObject.ingredients = {[id]: {[type]: value}}
        } else if (!recipeObject.ingredients[id]){
            recipeObject.ingredients[id] = {[type]: value}
        } else {
            recipeObject.ingredients[id][type] = value
        }
        this.props.updateRecipeCreation(recipeObject)
    }

    changeRecipeText(prop, text){
        let recipeObject = Object.assign({}, this.props.recipeCreation)
        recipeObject[prop] = text
        this.props.updateRecipeCreation(recipeObject)
    }

    validateRecipe(recipe, callback){
        let okayCount = 0
        let ingredientList = []
        if (!recipe.name){
            callback("bad name")
            return
        }
        if (!recipe.ingredients){
            callback("no ingredients")
            return
        }
        if (!recipe.instructions){
            callback("bad instructions")
            return
        }
        for (var prop in recipe.ingredients){
            if (recipe.ingredients.hasOwnProperty(prop)){
                if (!recipe.ingredients[prop].quantity || recipe.ingredients[prop].quantity === 0){
                    callback("bad quantity")
                    return
                }
                ingredientList.push(recipe.ingredients[prop].name)
            }
        }

        for (var ingredient in ingredientList){
            axios.get(this.state.host+'guest/checkIngredient/'+ingredientList[ingredient])
            .then((response) => {
                if (response.data === true){
                    okayCount++
                } else if (response.data === false){
                    callback("bad ingredients")
                    return
                }
                if (okayCount === ingredientList.length){
                    callback("okay")
                } else {
                    console.log('still checking')
                }
                    })
        }

    }

    showRecipe(e){ //for testing
        e.preventDefault()
    }

    handleClick(e){
        e.preventDefault()
        var rowState = Object.assign({}, this.state)
        var recipeState = Object.assign({}, this.props.recipeCreation)
        switch(e.target.name){
            case "clear":
                this.clearRecipe(e.target.parentNode)
                break
            case "add":
                this.initializeIngredientRow(rowState.currentId)
                rowState.rows.push(
                        <SearchBoxConnect title="Ingredient" id={rowState.currentId} name="search" searches={this.props.ingredientsDatalist} onChange={(e) => this.handleChange(e)}/>)
                rowState.currentId++
                this.setState(
                    rowState
                )
                break
            case "remove":
                rowState.rows[e.target.previousSibling.id] = null
                delete recipeState.ingredients[e.target.previousSibling.id]
                this.props.updateRecipeCreation(recipeState)   
                this.setState(
                    rowState
                )
                break
            default:
                break
        }
    }

    toggleVisible(component){
        let newState = Object.assign({}, this.state)
        !newState.visibleComponents[component] ? newState.visibleComponents[component] = true : newState.visibleComponents[component] = false
        this.setState({newState})
    }    

    onSubmit(event){
        var self = this
        event.preventDefault()
        var node = event.target
        var data = {recipe: this.props.recipeCreation, user: this.props.userState.id}
        this.validateRecipe(this.props.recipeCreation, function(result){
            switch(result){
                case "bad quantity":
                    self.toggleVisible("quantityWarning")
                    break
                case "bad name":
                    self.toggleVisible("nameWarning")
                    break
                case "bad instructions":
                    self.toggleVisible("instructionsWarning")
                    break
                case "no ingredients":
                    self.toggleVisible("ingredientWarning")
                    break
                case "bad ingredients":
                    self.toggleVisible("ingredientWarning")
                    break
                case "okay":
                    axios.post(self.state.host+self.props.userState.id+'/saveRecipe', data)
                    .then((response) => {
                        self.props.updateRecipes(response.data)
                    })
                    .then(() => {
                        self.clearRecipe(node)
                    })
                    break
                default:
                    break
            }

        })
    }

    clearRecipe = (node) => {
        this.setState({
            currentId: 0,
            rows: [],
            visibleComponents: {
                ingredientWarning: false,
                nameWarning: false,
                instructionsWarning: false,
                quantityWarning: false

            }
        })
        node.reset()
        this.props.updateRecipeCreation({})

    }

    initializeIngredientRow(i){
        var copyRecipe = Object.assign({}, this.props.recipeCreation)
        if (copyRecipe.ingredients && copyRecipe.ingredients[i]){
            return
        } else if (!copyRecipe.ingredients){
            copyRecipe.ingredients = {[i]: {name: "", quantity: ""}}
        } else if (!copyRecipe.ingredients[i]){
            copyRecipe.ingredients[i] = {name: "", quantity: ""}
        }
        this.props.updateRecipeCreation(copyRecipe)
    }

    render(){
        return (
            <div>
                <form onSubmit={(e) => this.onSubmit(e)}>
            
                    {/*name of recipe*/}
                    Name: <FormInput type="text" 
                                     name="name" 
                                     onChange={(e) => this.handleChange(e)} 
                            />
                    <br/>
                    { !this.state.visibleComponents.nameWarning ? null : <div><span>Please provide a name for your recipe!</span></div> }

                    {/*Search Input for data list*/}            
                    {this.state.rows < 1 ? null : this.state.rows.map((row, i) => {
                    return ( this.state.rows[i] === null ? null : 
                            <div key={i}>
                                <SearchBoxConnect placeholder={['Ingredient Name', 'Amount']} 
                                                  value={[this.props.recipeCreation.ingredients[i].name, this.props.recipeCreation.ingredients[i].quantity]} 
                                                  min={1} 
                                                  quantity={true} 
                                                  title="Ingredient" 
                                                  key={i} 
                                                  id={i} 
                                                  name="searchRecipeList" 
                                                  searches={this.props.ingredientsDatalist[i]} 
                                                  onChange={[(e) => this.handleChange(e), (e) => this.handleChange(e), (e)=> this.handleChange(e)]}
                                />
                                <ButtonComponent name="remove" 
                                                 onClick={(e) => this.handleClick(e)} 
                                                 description="Remove"
                                />
                            </div> )
                    })}
                    
                    { !this.state.visibleComponents.ingredientWarning ? null : <div><span>Please check your ingredients, one or more is incorrect.</span></div> }
                    { !this.state.visibleComponents.quantityWarning ? null : <div><span>Please change quantity to something more than zero.</span></div> }
        
                    {/*add row button*/}
                    <ButtonComponent name="add" 
                                     onClick={(e) => this.handleClick(e)} 
                                     description="Add Ingredient" 
                    />

                    {/*instructions text area*/}
                    <TextComponent rows="5" 
                                   name="instructions" 
                                   onChange={(e) => this.handleChange(e)}
                    />

                    { !this.state.visibleComponents.instructionsWarning ? null : <div><span>Please include instructions for your recipe!</span></div> }
                    
                    {/*save button*/}
                    <input type="submit" value="Save Recipe" />
                    <ButtonComponent description="Clear Recipe" 
                                     name="clear" 
                                     onClick={e => this.handleClick(e)} 
                    />
                </form>
            </div>
        )
    
        
    }
}

export default CreateRecipeContainer