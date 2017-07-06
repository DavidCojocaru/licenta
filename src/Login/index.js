import React from "react";
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import Button from "../Button";
import Input from "../Input";

import "./index.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.setEmail = this.setEmail.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  render() {
    const { user } = localStorage;

    if (user) {
      return <Redirect to="/" />;
    }

    return (
      <form
        className="login-form"
        onSubmit={e => {
          e.preventDefault();
          this.logIn();
        }}
      >
        <Input
          autoComplete
          name="email"
          label="User..."
          onChange={ev => this.setState({ email: ev.target.value })}
          id="txtEmail"
          type="email"
          placeholder="Email"
        />

        <Input
          name="password"
          autoComplete
          label="Password..."
          onChange={ev => this.setState({ password: ev.target.value })}
          type="password"
          placeholder="Password"
        />

        <div className="login-form__buttons">
          <Button type="submit">Log in</Button>
          <Button onClick={this.signUp}>Sign up</Button>
        </div>
      </form>
    );
  }

  logIn() {
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(this.setEmail)
      .catch(e => alert(e.message));
  }

  setEmail({ email }) {
    localStorage.setItem("user", email);
    this.forceUpdate();
  }

  signUp() {
    const { email, password } = this.state;

    const auth = firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(this.setEmail)
      .catch(e => alert(e.message));
  }
}
