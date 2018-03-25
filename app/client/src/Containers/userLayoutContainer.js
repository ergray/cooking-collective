import React from 'react'
import { UserHeadingComponent } from '../Components/userLayoutComponent'
import { ButtonComponent, SideButton } from '../Components/functionalButton.js'
import  { CreateRecipeConnect, UserIngredientConnect, SearchBoxConnect, UserRecipeConnect, SearchRecipeConnect } from './app'
import axios from 'axios'
import { history } from '../Store/store'
axios.defaults.withCredentials = true

class UserLayoutContainer extends React.Component{
    constructor(){
        super()
        this.state = {
            visibleComponents: {
                userIngredients: true,
                userRecipes: false,
                searchRecipes: false,
                newIngredients: false,
                createRecipe: false,
                newIngredient: false,
                addIngredientWarning: false,
                duplicateWarning: false
            },
            // host: 'http://localhost:3001/'
            host: 'https://cooking-collective.herokuapp.com/'
        }
    }

    updateIngredientState(){
        axios.get(this.state.host+this.props.userState.id+'/retrieveUserIngredients')
        .then((response) => {
        })
    }

    searchForIngredient(value){
       axios.get(this.state.host+'searchName/'+value)
        .then((response) => {
            this.props.updateIngredientDatalist(response.data)
        })
    }

    searchForNewIngredient(value){
       axios.get(this.state.host+this.props.userState.id+'/searchNewIngredient/'+value)
        .then((response) => {
            this.props.updateIngredientList(response.data)
        })
    }       

    handleQuantity(event){
        if (event.target.name === "quantity"){
            let newQuantity = Object.assign({}, this.state.selectMenu)
            newQuantity.quantity = event.target.value
            this.setState({
                selectMenu: newQuantity
            })
        } else {
            let newSelectId = Object.assign({}, this.state.selectMenu)
            newSelectId.selected = event.target.value
            this.setState({
                selectMenu: newSelectId
            })
        }
    }

    handleChange(event, type){
            event.preventDefault()
            switch(type){
                case "searchNewIngredients":
                this.searchForIngredient(event.target.value)
                break
                case "addNew":
                    if (event.target.value === "" ){
                        this.props.updateIngredientList([])
                        this.inputIngredientValue("name", event.target.value)
                        break
                    }
                    if (this.state.visibleComponents.addIngredientWarning){
                        this.toggleVisible("addIngredientWarning")
                    }
                    if (this.state.visibleComponents.duplicateWarning){
                        this.toggleVisible("duplicateWarning")
                    }
                    this.searchForNewIngredient(event.target.value)
                    this.inputIngredientValue("name", event.target.value)
                break
                case "newQuantity":
                    this.inputIngredientValue("quantity", Number(event.target.value))
                break
                case "editQuantity":
                    let newIngredientState = Object.assign([], this.props.userIngredientState)
                    let ingredientIndex = newIngredientState.findIndex(function(ingredient){
                        return ingredient.name === event.target.name
                    })
                    newIngredientState[ingredientIndex].quantity = event.target.value
                    this.props.updateUserIngredients(newIngredientState)
                break
                case "editMeasurement":
                    var newIngredientState = Object.assign([], this.props.userIngredientState)
                    var ingredientIndex = newIngredientState.findIndex(function(ingredient){
                        console.log(ingredient.id, ' ', event.target.parentNode.id)
                        return ingredient.id === Number(event.target.parentNode.id)
                     })
                    var currentIngredient = newIngredientState[ingredientIndex]
                    currentIngredient.quantity = this.convertMeasurement(currentIngredient.measurement, currentIngredient.quantity, event.target.value)
                    currentIngredient.measurement = event.target.value
                    this.props.updateUserIngredients(newIngredientState)
                    break
                case "selectMeasurement":
                    this.inputIngredientValue("measurement", event.target.value)
                    break
            default:
                break
            }
    }

    inputIngredientValue(prop, value){
        var ingredientObject = Object.assign({}, this.props.newUserIngredient)
        ingredientObject[prop] = value
        this.props.updateIngredientObject(ingredientObject)
    }

    convertMeasurement(currentMeasurement, currentValue, newMeasurement){
        const valuesToGrams = {
            "lb": 453.592,
            "g": 1,
            "oz": 28.3495
        }

        const valueInGrams = currentValue*valuesToGrams[currentMeasurement]

        return (valueInGrams / valuesToGrams[newMeasurement])
    }

    killSession(){
        this.props.updateIngredientDatalist({})
        this.props.updateIngredientList([])
        this.props.updateIngredientObject({})
        this.props.updateRecipeCreation({})
        this.props.updateRecipes([])
        this.props.updateRecipePage({})
        this.props.updateUserIngredients([])
        this.props.clearUserState({})
    }

    handleClick(event){
        event.preventDefault()
        switch(event.target.name){
            case "signout" :
                axios.get(this.state.host+this.props.userState.id+'/logout')
                 .then((response) => {
                     console.log(response)
                    this.killSession()
                    history.push(response)
                })
                break
            case "addNewIngredient" :
                this.toggleVisible("newIngredient")
                break
            case "ingredients" :
                this.toggleVisible("userIngredients")
                break
            case "save" :
                let dataToSend = []
                this.props.userIngredientState.map( (ingredient) => {
                let ingredientChanges = Object.assign({}, ingredient)
                    ingredientChanges.quantity = this.convertMeasurement(ingredient.measurement, ingredientChanges.quantity, "g")
                    dataToSend.push(ingredientChanges)
                })
                axios.post(this.state.host+this.props.userState.id+'/saveIngredients',
                    dataToSend)
                    .then((response) => {
                        axios.get(this.state.host+this.props.userState.id+'/retrieveAvailRecipes')
                        .then((response) => {
                            this.props.updateRecipes(
                                response.data.recipes
                            )
                        })
                    })
                break
            case "availrecipes" :
                axios.get(this.state.host+this.props.userState.id+'/retrieveAvailRecipes')
               .then((response) => {
                    this.props.updateRecipes(
                        response.data.recipes
                    )
                }).then(() => {
                    this.toggleVisible("userRecipes")
            })
            
                break
            case "newingredient" :
                this.toggleVisible("newIngredients")
                break
            case "searchrecipes" :
                this.toggleVisible("searchRecipes")
                break
            case "makerecipe" :
                this.toggleVisible("createRecipe")
                break
            default:
                break
        }
    }

    checkDuplicate(ingredient){
        for (let checkIngredient in this.props.userIngredientState){
            console.log(this.props.userIngredientState[checkIngredient])
            if (ingredient.toLowerCase() === this.props.userIngredientState[checkIngredient].name.toLowerCase()){
                return true
            }
        }
        return false
    }

    toggleVisible(component){
        let newState = Object.assign({}, this.state)
        for (var prop in newState.visibleComponents){
            if (newState.visibleComponents.hasOwnProperty(prop)){
                newState.visibleComponents[prop]=false
            }
        }
        newState.visibleComponents[component] = true
        // !newState.visibleComponents[component] ? newState.visibleComponents[component] = true : newState.visibleComponents[component] = false
        this.setState({newState})
    }

    validateIngredient(ingredient){
        axios.get(this.state.host+'guest/checkIngredient/'+ingredient)
        .then((response) => {
            return response.data
        })
    }

    handleSubmit(e){
        e.preventDefault()
        if (this.checkDuplicate(this.props.newUserIngredient.name) === true){
            this.toggleVisible("duplicateWarning")
            return
        }
        axios.get(this.state.host+'guest/checkIngredient/'+this.props.newUserIngredient.name)
       .then((response) => {
            if (response.data === false){
                this.toggleVisible("addIngredientWarning")
                return
            } else {
               axios.post(this.state.host+this.props.userState.id+'/addIngredient',
                {
                    quantity: this.convertMeasurement(this.props.newUserIngredient.measurement || "oz", this.props.newUserIngredient.quantity, "g"),
                    ingredient: this.props.newUserIngredient.name,
                    measurement: this.props.newUserIngredient.measurement || "oz",
                    user_id: this.props.userState.id
                })
                .then((response) => {
                    this.props.initializeUserIngredients([response.data.userIngredients])
                    this.props.updateIngredientList(response.data.ingredientsNotInInventory)
                    this.props.updateIngredientObject({name: "", quantity: '', measurement: "oz"})
                    this.props.updateRecipes(response.data.recipes)
                    this.toggleVisible("newIngredient")
                })
        }
        })
    }

    componentWillMount(){
        axios.get(this.state.host+this.props.params.user+'/retrieveUser')
        .then((response) => {
            this.props.updateUserState({
                user: response.data.user
            })
            this.props.updateRecipes(
                [response.data.recipes]
            )
            this.props.initializeUserIngredients(
                [response.data.ingredientData]
            )
            this.setState({
                    newIngredients: response.data.newIngredients
                
            })
        })
    }

    render(){

        return (
            <div className="App">

                <div className="App-header">

                    <h2>The Cooking Collective</h2>
                    <UserHeadingComponent  name={this.props.userState.username || this.props.userState.email}/>
                
                </div>
                
                {/*Show users current available ingredients:*/}
                <div style={{background: 'red', display: 'flex', flexDirection: 'horizontal'}}>
                
                {/*Section of Buttons to determine component Visibility*/}

                {/*Show User Ingredients (default) */}
                    <ButtonComponent style='mobileTop'
                                     backgroundColor={this.state.visibleComponents.userIngredients? "white" : "grey"} 
                                     name="ingredients" 
                                     onClick={e => this.handleClick(e)} 
                                     description={this.state.visibleComponents.userIngredients? "Hide Ingredients" : "Show My Ingredients"}/>

                {/*Show recipes user can make: */}
                    <ButtonComponent style='mobileTop' 
                                     backgroundColor={this.state.visibleComponents.userRecipes? "white" : "grey"}
                                     name="availrecipes" 
                                     onClick={e => this.handleClick(e)} 
                                     description={this.state.visibleComponents.userRecipes ? "Hide Recipes" : "Show My Available Recipes"}/>
                
                {/*Add ingredients not in users inventory:*/}
                    { !this.state.newIngredients || this.state.newIngredients.length < 1 ? null :
                    <ButtonComponent style='mobileTop' 
                                     backgroundColor={this.state.visibleComponents.newIngredient? "white" : "grey"}
                                     name="addNewIngredient" 
                                     onClick={e => this.handleClick(e)} 
                                     description="Add Ingredient to Inventory"/> }

                {/*Create a new recipe*/}
                    <ButtonComponent style='mobileTop' 
                                     backgroundColor={this.state.visibleComponents.createRecipe? "white" : "grey"}
                                     name="makerecipe" 
                                     onClick={e => this.handleClick(e)} 
                                     description="Create a Recipe!"/>

                {/*Search for a Recipe*/}

                    <ButtonComponent style='mobileTop' 
                                     backgroundColor={this.state.visibleComponents.searchRecipes? "white" : "grey"}
                                     name="searchrecipes" 
                                     onClick={e => this.handleClick(e)} 
                                     description="Search Recipes"/>

                {/*Sign out of session*/}
                    <ButtonComponent style='mobileTop' 
                                     backgroundColor='red' 
                                     name="signout" 
                                     onClick={e => this.handleClick(e)} 
                                     description="Sign Out!" /> 
                </div>
                

                <div style={{background: 'white', height: '100px'}} className='functionContainer'>
                    

               {/*Actual components:      */}

               {/*Ingredients in User's inventory*/}
                    {this.state.visibleComponents.userIngredients ? 
                        <div>{this.props.userIngredientState.length === 0 ?
                                <div><br/>You currently have nothing in your inventory!<br/>
                                          Add a new ingredient by selecting the Add Ingredient tab.<br/>
                                </div>
                              : <div><div><br/>Your current available ingredients are as follows. Adjust in-line, or<br/>
                                          add an entirely new ingredient by selecting the Add Ingredient tab.<br/>
                                </div>
                                <UserIngredientConnect onChange={[(e) => this.handleChange(e, "editQuantity"), (e) => this.handleChange(e, "editMeasurement")]} listMap={this.props.userIngredientState} onClick={e => this.handleClick(e)} />
                                <ButtonComponent name="save" onClick={e => this.handleClick(e)} description="Save Changes"/> 
                                </div>
                             }</div> 
                             : null }

                {/*Recipes available to user*/}
                    {this.state.visibleComponents.userRecipes ?
                        <div>
                            {this.props.recipeState.length === 0 ? 
                                <div><br/>
                                    You do not currently have any recipes available.<br/>
                                    Add more ingredients to find out what you can make!<br/>
                                </div>
                        :<div>
                            <UserRecipeConnect recipes={this.props.recipeState}/></div>}
                        </div>
                        : null
                    }

                    {/*Add new type of ingredient to user's inventory*/}

                    { this.state.visibleComponents.newIngredient === false || this.state.newIngredients.length === 0 ? null : <div><form onSubmit={(e) => this.handleSubmit(e)}><br/>Please note only the following ingredients are currently available (more to come once I take a break from styling!):<br/>
                                                                                                                                                                                <br/>[green bell pepper, strawberry, ground beef, white rice, brown rice, kiwi, chicken broth, cheese, jalapeno, zucchini]
                                                                                                                                                                                <br/>
                                                                                                                                                                                <h3>Just type in the name of what you want in the search box below and it will show up</h3>
                                                                                                                                                               <br/><SearchBoxConnect placeholder={['Ingredient Name', 'Amount']} title="Ingredient" id={"i1"} value={[this.props.newUserIngredient.name, this.props.newUserIngredient.quantity]} name="searchNewIngredient" quantity={true} searches={this.props.ingredientsNotInInventory} onChange={[(e) => this.handleChange(e, "addNew"), (e) => this.handleChange(e, "newQuantity"), (e) => this.handleChange(e, "selectMeasurement")]}/>
                    { this.state.visibleComponents.addIngredientWarning === false ? null : <div><span>Sorry, but this ingredient is invalid.</span></div> }
                    { this.state.visibleComponents.duplicateWarning === false ? null : <div><span>Ingredient already in your list, please adjust quantity and/or measurement from your inventory.</span></div> }
                    <input type="submit"></input></form></div> } 

                    {/*Create a new recipe*/}

                    {this.state.visibleComponents.createRecipe ?
                        <div><br/><CreateRecipeConnect id="createrecipe" /></div>: null }
                    
                    {/*Search for a recipe, regardless of inventory*/}

                    {this.state.visibleComponents.searchRecipes ?
                        <div>
                            <SearchRecipeConnect />
                        </div>
                        : null }
                </div>
            </div>
        )
    }
}

export default UserLayoutContainer