import React from 'react';
import {Route, Switch} from 'react-router-dom'
import Login from './components/Login.jsx';
import './App.css'

function App() {
  return (
    <div Classname="App">
      <Switch>
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  )
}

export default App;
