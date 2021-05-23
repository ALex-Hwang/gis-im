import './App.css';
import React, {Component} from 'react'
import ChatRoom from './Components/ChatRoom'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
         <BrowserRouter>
				<Switch>
					<Route exact path = "/" component = {ChatRoom}/>
				</Switch>
          </BrowserRouter>
    </div>
  );
}

export default App;
