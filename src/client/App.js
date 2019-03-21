import ResponsivePiano from './Components/ResponsivePIano/ResponsivePiano';
import ResizablePiano from './Components/ResizablePiano/ResizablePiano';
import Namespace from './Components/Namespace/Namespace';
import Modal from './Components/Modal/Modal';
import Single from './Components/Single/Single';
import Menu from './Components/Menu/Menu';
import Duo from './Components/Duo/Duo'
import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { FaMagic } from 'react-icons/fa';
import 'react-piano/dist/styles.css';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080',
      isMenuOpen: false,
      isNamespaceFormOpen: '',
      roomName: '',
      myId: null,
      counterpartId: ''
    };

    this.createMySocket = this.createMySocket.bind(this);
    this.onPlayNoteInput = this.onPlayNoteInput.bind(this);
    this.redirectToRoom = this.redirectToRoom.bind(this);
    this.onClickMenuOpen = this.onClickMenuOpen.bind(this);
    this.onClickNamespaceFormOpen = this.onClickNamespaceFormOpen.bind(this);
  }

  createMySocket() {
    const { endpoint, roomName } = this.state;
    const roomUrl = `${endpoint}/duo`;
    const socket = io(roomUrl);

    this.setState(() => {
      return {
        myId: socket.id
      };
    });

    const socketData = {
      id: socket.id,
      roomName
    };

    socket.emit('join', socketData);

    socket.on('join', data => {

      console.log(data);
    });
  }

  onClickMenuOpen() {
    this.setState(prevState => {
      return {
        isMenuOpen: !prevState.isMenuOpen
      };
    });
  }

  onClickNamespaceFormOpen() {
    this.setState(prevState => {
      return {
        isNamespaceFormOpen: !prevState.isNamespaceFormOpen
      };
    });
  }

  redirectToRoom(roomName) {
    this.setState(prevState => {
      return {
        isMenuOpen: !prevState.isMenuOpen,
        isNamespaceFormOpen: !prevState.isNamespaceFormOpen,
        roomName
      };
    });

    this.props.history.push(`/duo/${roomName}`);
    this.createMySocket();
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
    const { isMenuOpen, isNamespaceFormOpen } = this.state;

    return (
      <Fragment>
        <header className="headerContainer">
          <div className="titleCover">
            <span className="title">Your Piano</span>
          </div>
          <div className="dropboxCover">
            <i className="dropbox fas fa-bars" onClick={this.onClickMenuOpen}></i>
          </div>
          {isMenuOpen && <Menu onClickClose={this.onClickMenuOpen} onClickOpen={this.onClickNamespaceFormOpen}/>}
          {isNamespaceFormOpen &&
            <Modal closeModal={this.onClickNamespaceFormOpen}>
              <Namespace
                closeModal={this.onClickNamespaceFormOpen}
                onConfirm={this.redirectToRoom}
              />
            </Modal>}
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
          <Route exact path="/duo/:room_name">
            <Duo>
              <ResizablePiano width={600} onPlayNoteInput={this.onPlayNoteInput}/>
              <ResizablePiano width={600} onPlayNoteInput={this.onPlayNoteInput}/>
            </Duo>
          </Route>
        </Switch>
      </Fragment>
    );
  }
}
