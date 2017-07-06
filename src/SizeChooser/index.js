import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import Button from "../Button";

export default class SizeChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: null
    };
  }

  render() {
    const { user } = this.props;

    if (!user) {
      return <Redirect to="/login" />;
    }

    if (this.state.size) {
      return <Redirect to={`/play/${this.state.size}`} />;
    }

    return (
      <div>
        <Button minSize onClick={this.choose(4)}>4x4</Button>
        <br />
        <Button minSize onClick={this.choose(5)}>5x5</Button>
        <br />
        <Button minSize onClick={this.choose(6)}>6x6</Button>
        <br />
        <Button minSize onClick={this.choose(7)}>7x7</Button>
      </div>
    );
  }

  choose(size) {
    return () => {
      this.setState({
        size
      });
    };
  }
}

SizeChooser.propTypes = {
  user: PropTypes.string
};
