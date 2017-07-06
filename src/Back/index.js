import React from "react";
import { Redirect } from "react-router-dom";

import "./index.css";
const BACK = (
  <svg fill="#2196F3" height="50" viewBox="0 0 24 24" width="50">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export default class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  render() {
    if (this.state.redirect) {
      const backLocation = window.location.pathname
        .split("/")
        .slice(0, -1)
        .join("/");

      return <Redirect to={backLocation} />;
    }

    return (
      <div
        onClick={() => {
          this.setState(
            {
              redirect: true
            },
            () => {
              this.setState({
                redirect: false
              });
            }
          );
        }}
        className="back"
        style={this.props.style}
      >
        {BACK}
        <span style={{ fontSize: 18 }}>Go back</span>
      </div>
    );
  }
}
