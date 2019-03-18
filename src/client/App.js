import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Vspace from './Components/Vspace/Vspace';
import Single from './Components/Single/Single';
import Piano from './Components/Piano/Piano';
import Menu from './Components/Menu/Menu';
import Duo from './Components/Duo/Duo'
import socket from 'socket.io-client';
import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080',
      isMenuOpen: false
    };

    this.onClickMenuOpen = this.onClickMenuOpen.bind(this);
  }

  onClickMenuOpen(e) {
    this.setState(prevState => {
      return {
        isMenuOpen: !prevState.isMenuOpen
      };
    });
  }

  render() {
    const { isMenuOpen } = this.state;

    return (
      <Fragment>
        <header className="headerContainer">
          <div className="titleCover">
            <span className="title">Your Piano</span>
          </div>
          <div className="dropboxCover">
            <i className="dropbox fas fa-bars" onClick={this.onClickMenuOpen}></i>
          </div>
          {isMenuOpen && <Menu onClickClose={this.onClickMenuOpen}/>}
        </header>
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
