import ResponsivePiano from './Components/ResponsivePIano/ResponsivePiano';
import Namespace from './Components/Namespace/Namespace';
import Modal from './Components/Modal/Modal';
import Single from './Components/Single/Single';
import Menu from './Components/Menu/Menu';
import Duo from './Components/Duo/Duo'
import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { FaMagic } from 'react-icons/fa';
import PropTypes from 'prop-types';
import 'react-piano/dist/styles.css';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isNamespaceFormOpen: '',
      roomName: ''
    };

    this.redirectToRoom = this.redirectToRoom.bind(this);
    this.onClickMenuOpen = this.onClickMenuOpen.bind(this);
    this.onClickNamespaceFormOpen = this.onClickNamespaceFormOpen.bind(this);
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
              <Namespace closeModal={this.onClickNamespaceFormOpen} onConfirm={this.redirectToRoom} />
            </Modal>}
        </header>
        <Switch>
          <Route exact path="/">
            <Single>
              <div className="tutorialGuideText">
                <p className="guildText"><FaMagic />Do your Magic by clicking, tapping, or using your keyboard</p>
                <IoMdArrowRoundDown />
              </div>
              <ResponsivePiano className="theme"/>
            </Single>
          </Route>
          <Route exact path="/duo/:room_name" component={Duo}/>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired
};
