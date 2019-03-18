import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Vspace from './Components/Vspace/Vspace';
import Single from './Components/Single/Single';
import Piano from './Components/Piano/Piano';
import Duo from './Components/Duo/Duo';
import socket from 'socket.io-client';
import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080'
    };
  }

  render() {
    return (
      <Fragment>
        <header>
          <div>UP</div>
          <button></button>
        </header>
        <Vspace />
        <Switch>
          <Route exact path="/">
            <Single>
              <Piano />
            </Single>
          </Route>
          <Route exact path="/duo">
            <Duo>
              <Piano />
            </Duo>
          </Route>
        </Switch>
      </Fragment>
    );
  }
}
