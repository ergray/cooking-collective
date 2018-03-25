//Dependencies
import React from 'react'
import ReactDOM from 'react-dom';

// CSS
import './index.css';
import './App.css';

//Redux
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'

//Store
import store, { history } from './Store/store'

// Components & Containers
import { App, UserLayoutConnect, RecipeTemplateConnect } from './Containers/app'
// import LoginScreenContainer from './Containers/loginScreenContainer'

console.log('hello from index react render?')

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
        <Route exact path="/" component={App}/>
            <Route path="/:user" component={UserLayoutConnect}/>
            <Route path="/recipe/:recipe" component={RecipeTemplateConnect}/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
