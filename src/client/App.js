import ResponsivePiano from './Components/ResponsivePIano/ResponsivePiano';
import { IoMdArrowRoundDown } from 'react-icons/io';
import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Single from './Components/Single/Single';
import Menu from './Components/Menu/Menu';
import { FaMagic } from 'react-icons/fa';
import Duo from './Components/Duo/Duo'
import 'react-piano/dist/styles.css';
import io from 'socket.io-client';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080',
      isMenuOpen: false
    };

    this.sendSocket = this.sendSocket.bind(this);
    this.onPlayNoteInput = this.onPlayNoteInput.bind(this);
    this.onClickMenuOpen = this.onClickMenuOpen.bind(this);
  }

  sendSocket() {
    const { endpoint } = this.state;
    const socket = io(endpoint);

    socket.emit('try', endpoint);

    socket.on('try', endpoint => {

      console.log(endpoint);
    });
  }

  onClickMenuOpen() {
    this.setState(prevState => {
      return {
        isMenuOpen: !prevState.isMenuOpen
      };
    });
  }

  onPlayNoteInput(midiNumber) {
    const { endpoint } = this.state;
    const socket = io(endpoint);

    socket.emit('play', midiNumber, 'grand_piano');

    socket.on('play', midiNumber => {
      console.log(midiNumber);
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
              <div className="tutorialGuideText">
                <p className=""><FaMagic />Do your Magic by clicking, tapping, or using your keyboard</p>
                <IoMdArrowRoundDown />
              </div>
              <ResponsivePiano />
            </Single>
          </Route>
          <Route exact path="/duo">
            <Duo>
              <ResponsivePiano onPlayNoteInput={this.onPlayNoteInput}/>
            </Duo>
          </Route>
        </Switch>
      </Fragment>
    );
  }
}
