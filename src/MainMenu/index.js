import React, { Component } from "react";
import firebase from "firebase";
import Game from "../Game";

import Stats from "../Stats";
import HighScores from "../HighScores";
import { Route, Redirect } from "react-router-dom";

import Button from "../Button";
import SizeChooser from "../SizeChooser";
import Back from "../Back";
import Login from "../Login";

import "./index.css";

const SPACER = <div style={{ flex: 1 }} />;

const VALID_SIZES = {
  4: true,
  5: true,
  6: true,
  7: true
};
export default class App extends Component {
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyBSdI1rY49qWJQg6cdpmDRB_zfqi-j551k",
      authDomain: "licenta-95706.firebaseapp.com",
      databaseURL: "https://licenta-95706.firebaseio.com",
      projectId: "licenta-9W5706",
      storageBucket: "",
      messagingSenderId: "151651797273"
    };
    firebase.initializeApp(config);
  }

  signOut() {
    localStorage.removeItem("user");
    this.props.history.push("/login");
  }

  renderMenu() {
    const { user } = localStorage;
    if (!user) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="main-menu__wrapper">
        <Back style={{ visibility: "hidden" }} />
        <Button
          minSize
          onClick={() => {
            this.props.history.push("/play");
          }}
        >
          <svg
            fill="white"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          {SPACER}
          Play
          {SPACER}
        </Button>

        <Button
          minSize
          onClick={() => {
            this.props.history.push("/stats");
          }}
        >
          <svg
            fill="white"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
          {SPACER}
          Stats
          {SPACER}{" "}
        </Button>

        <Button
          minSize
          onClick={() => {
            this.props.history.push("/high-scores");
          }}
        >
          <svg
            fill="white"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
          {SPACER}
          High Scores{SPACER}
        </Button>

        <Button minSize onClick={this.signOut.bind(this)}>
          <svg
            fill="white"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
          </svg>
          {SPACER}
          Sign out{SPACER}
        </Button>
      </div>
    );
  }

  renderPlaySize(user, { match }) {
    const size = match.params.size;

    if (!VALID_SIZES[size]) {
      return <Redirect to="/play" />;
    }

    return <Game size={size} user={user} />;
  }
  render() {
    const { user } = localStorage;
    const { location } = this.props;

    return (
      <div className="main-menu">
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          <Back />}

        <Route path="/" exact render={this.renderMenu.bind(this)} />
        <Route path="/login" exact render={() => <Login />} />

        <Route path="/play" exact render={() => <SizeChooser user={user} />} />
        <Route
          path="/play/:size"
          exact
          render={this.renderPlaySize.bind(this, user)}
        />
        <Route path="/stats" render={() => <Stats user={user} />} />
        <Route path="/high-scores" render={() => <HighScores user={user} />} />
      </div>
    );
  }
}
