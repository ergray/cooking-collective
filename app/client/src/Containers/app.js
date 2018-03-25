import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../Actions/actions'
import Main from './Main'
import SignIn from './signin'
import SearchBox from '../Components/searchBox'
import UserLayout from './userLayoutContainer'
import CreateRecipeContainer from './createRecipeContainer'
import RecipeTemplateContainer from './recipe'
import { SearchRecipe } from './searchRecipeContainer'
import  { UserIngredientComponent, UserRecipeComponent } from '../Components/userLayoutComponent'

function mapStateToProps(state){
    return {
        ingredientsDatalist: state.ingredientsDatalist,
        ingredientsNotInInventory: state.ingredientsNotInInventory,
        newUserIngredient: state.newUserIngredient,
        userState: state.userState,
        recipeState: state.recipeState,
        userIngredientState: state.userIngredientState,
        recipeCreation: state.recipeCreation,
        recipePage: state.recipePage
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch)
}

export const App = connect(mapStateToProps, mapDispatchToProps)(Main)
export const SignInConnect = connect(mapStateToProps, mapDispatchToProps)(SignIn)
export const SearchRecipeConnect = connect(mapStateToProps, mapDispatchToProps)(SearchRecipe)
export const UserLayoutConnect = connect(mapStateToProps, mapDispatchToProps)(UserLayout)
export const CreateRecipeConnect = connect(mapStateToProps, mapDispatchToProps)(CreateRecipeContainer)
export const RecipeTemplateConnect = connect(mapStateToProps, mapDispatchToProps)(RecipeTemplateContainer)
export const UserIngredientConnect = connect(mapStateToProps, mapDispatchToProps)(UserIngredientComponent)
export const SearchBoxConnect = connect(mapStateToProps, mapDispatchToProps)(SearchBox)
export const UserRecipeConnect = connect(mapStateToProps, mapDispatchToProps)(UserRecipeComponent)
