import React from 'react'
import axios from 'axios'
import ListWithQuantity from '../Components/listComponents'

class RecipeTemplateContainer extends React.Component{
    constructor(){
        super()
        this.state = {
            styles: {
                header: {
                    backgroundColor: 'black',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between'
                },
                createdBy: {
                    alignSelf: 'flex-end',
                    flexGrow: '0',
                    padding: '0 10% 0 0'
                },
                recipeBox: {
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 0 0 10%'
                },
                recipeTitle: {
                    flexGrow: '1',
                    padding: '0 20%'
                }
            },
            host: 'https://cooking-collective.herokuapp.com/'
            // host: 'http://localhost:3001/'
        }
    }

    componentWillMount(){
         axios.get(this.state.host+(this.props.userState.id || 'guest')+'/recipeComponents/'+this.props.params.recipe)
        .then((response) => this.props.updateRecipePage(response.data))
    }

    render(){
        return (
            <div>
                <div style={this.state.styles.header}>
                    <h2 style={this.state.styles.recipeTitle}>{this.props.recipePage.name}</h2>
                    <span style={this.state.styles.createdBy}> Created by: {this.props.recipePage.author}</span>
                </div>
                <div style={this.state.styles.recipeBox}>
                    <div>
                        <h2>Ingredients:</h2>
                    </div>
                    <ListWithQuantity list={this.props.recipePage.ingredients} />
                    <div>
                        <h2>Instructions:</h2>
                    </div>
                    <div>
                        {this.props.recipePage.instructions}
                    </div><br/>
                </div>
            </div>
        )
    }
}

export default RecipeTemplateContainer