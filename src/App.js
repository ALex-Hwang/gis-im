import './App.css';
import React, {Component} from 'react'
import ChatRoom from './Components/ChatRoom'
import Prescrib from './Components/Prescrib'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './assets/css/MainPage.css'

var storage = window.localStorage;

class App extends Component {
  render() {
    storage.setItem("TopBarKey","首页");
    return (
      <div className="App">
          <BrowserRouter>
          <Switch>
            <Route exact path = "/ChatRoom" component = {ChatRoom}/>
            <Route exact path = "/" component = {ChatRoom}/>
            <Route exact path = "/Prescription" component = {Prescrib}/>
          </Switch>
          </BrowserRouter>
      </div>
    )
  }

}

export default App;
