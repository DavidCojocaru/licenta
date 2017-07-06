import React, { Component } from "react";
import Knight from "./Knight";
import "./Game.css";
import autoBind from "react-class/autoBind";
import "./database.js";
import Panel from "muicss/lib/react/panel";
import firebase from "firebase";

import Button from "./Button";

const emptyMatrix = () => [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null]
];

export default class Game extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = this.getInitialState();
  }

  getInitialState() {
    const props = this.props;
    return {
      xi: Math.floor(props.size / 2),
      yi: Math.floor(props.size / 2),

      ix: this.randomPosition(),
      iy: this.randomPosition(),

      x: null,
      y: null,

      SIZE: props.size || 5,
      matrix: this.buildPairs(emptyMatrix()),
      flag: 0,
      turn: true,
      winner: null,
      count: 1,
      count1: 1
    };
  }

  //-------------------------------------------------------------------------------------------------

  render() {
    const { x, y } = this.state;
    return (
      <div>
        {this.renderWinner()}
        <Panel>
          <ul className="game__list">
            <li>{`it's ${this.state.turn ? "computer s" : "your"} turn`}</li>
            <li>{`current position: [${x === null ? "" : x}, ${y === null
              ? ""
              : y}]`}</li>
          </ul>
        </Panel>
        {this.renderTable()}

      </div>
    );
  }

  renderWinner() {
    const { winner } = this.state;

    if (!winner) {
      return null;
    }

    return (
      <div>
        <h4>Game over - {winner} won!</h4>

        <Button onClick={this.playAgain.bind(this)}>
          Play again!
        </Button>
      </div>
    );
  }

  playAgain() {
    this.setState(this.getInitialState());
  }

  //-------------------------------------------------------------------------------------------------

  randomPosition() {
    return Math.floor(Math.random() * this.props.size);
  }

  handleChange(turn) {
    this.setState({ turn });
  }

  //-------------------------------------------------------------------------------------------------

  componentDidUpdate(prevProps, prevState) {
    if (this.state.turn === false && prevState.turn === true) {
      this.myMove();
    }
    if (this.state.turn === true && prevState.turn === false) {
      this.computerMove();
    }
  }

  componentDidMount() {
    if (this.state.turn === true) {
      this.computerMove();
    } else this.myMove();
  }

  //-------------------------------------------------------------------------------------------------

  whoLose(turn) {
    let { x, y, ix, iy, xi, yi } = this.state;
    let min = {};

    if (this.props.size % 2 !== 0 && x === null && y === null) {
      min.x = xi;
      min.y = yi;
    } else if (this.props.size % 2 === 0 && x === null && y === null) {
      min.x = ix;
      min.y = iy;
    } else min = this.determinaMin({ x, y }, {});

    let winner;

    if (turn === true && min.x === undefined) {
      this.setState({
        winner: "computer"
      });
      //setTimeout(() => alert("player`s lose"), 500);
      winner = true;
    }

    if (min.x === undefined && turn === false) {
      this.setState({
        winner: "player"
      });
      winner = false;
    }

    var today = new Date();
    const { user } = this.props;

    var data =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = data + " / " + time;

    if (winner !== undefined) {
      var newPostKey = firebase.database().ref().child("game").push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates["/game/" + newPostKey] = {
        compMoves: this.state.c,
        date: dateTime,
        gameSize: this.props.size,
        playerMoves: this.state.c1,
        user,
        winner
      };
      return firebase.database().ref().update(updates);
    }

    if (min.x !== undefined && turn === false) {
      setTimeout(() => {
        this.handleSquareOnClick(min.x, min.y, 0);
      }, 300);
    }
  }

  computerMove() {
    this.whoLose(false);
    var c = this.state.count++;
    this.setState({ c });
  }

  myMove() {
    this.whoLose(true);
    var c1 = this.state.count1++;
    this.setState({ c1 });
  }

  //-------------------------------------------------------------------------------------------------

  renderTable() {
    const SIZE = this.props.size;
    var rows = [];

    for (var i = 0; i < SIZE; i++) {
      rows.push(this.renderRow(i));
    }

    let className = "table";

    if (this.state.winner) {
      className += " game-over";
    }

    return (
      <Panel style={{ padding: 4 }}>
        <div className={className}>
          {rows}
        </div>
      </Panel>
    );
  }

  //-------------------------------------------------------------------------------------------------

  renderRow(i) {
    const SIZE = this.props.size;
    var columns = [];

    for (var j = 0; j < SIZE; j++) {
      columns.push(this.renderSquares(i, j));
    }

    return (
      <div key={i + 90} className="row">
        {columns}
      </div>
    );
  }

  //-------------------------------------------------------------------------------------------------

  renderSquares(i, j) {
    var color;

    if (i % 2 === 0) {
      color = j % 2 === 0 ? "greenSquare" : "blackSquare";
    } else {
      color = j % 2 !== 0 ? "greenSquare" : "blackSquare";
    }

    var { x, y } = this.state;

    var knight = x === i && y === j
      ? <Knight
          style={{ color: "white", align: "center", fontSize: 40, padding: 20 }}
        />
      : null;

    const wrongSquare = this.state.wrongSquare;
    if (wrongSquare && (wrongSquare.i === i && wrongSquare.j === j)) {
      color = "redSquare";
    }

    if (this.state.matrix[i][j] === 0) {
      color = "blackOpacitySquare";
    } else if (this.state.matrix[i][j] === -1) {
      color = "greenOpacitySquare";
    }

    return (
      <div
        key={(i + 1) * j}
        className={color}
        onClick={this.handleSquareOnClick.bind(this, i, j, -1)}
      >
        {knight}
      </div>
    );
  }

  //-------------------------------------------------------------------------------------------------

  onClick(x, y) {
    this.setState({ x, y, turn: !this.state.turn });
  }

  //-------------------------------------------------------------------------------------------------

  handleSquareOnClick(toX, toY, flag) {
    let a = this.state.matrix;

    if (this.canMoveKnight(toX, toY)) {
      this.moveKnight(toX, toY);
      a[toX][toY] = flag;

      const matrix = a;
      this.setState({
        matrix,
        turn: !this.state.turn,
        tox: toX,
        toy: toY
      });
    } else this.wrongSquare(toX, toY);
  }

  //-------------------------------------------------------------------------------------------------

  canMoveKnight(toX, toY) {
    let { x, y } = this.state;
    let a = this.state.matrix;

    const dx = toX - x;
    const dy = toY - y;

    if (x === null && y === null) {
      return true;
    } else if (a[toX][toY] === 0 || a[toX][toY] === -1) {
      this.setState({ turn: this.state.turn });
      this.wrongSquare(toX, toY);
      return false;
    } else {
      return (
        (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2)
      );
    }
  }

  //-------------------------------------------------------------------------------------------------

  moveKnight(toX, toY) {
    this.setState({
      x: toX,
      y: toY
    });
  }

  //-------------------------------------------------------------------------------------------------

  wrongSquare(toX, toY) {
    this.setState({ wrongSquare: { i: toX, j: toY } });
    setTimeout(() => {
      this.setState({ wrongSquare: null });
    }, 300);
  }

  //-------------------------------------------------------------------------------------------------

  buildPairs(a) {
    const SIZE = this.props.size;
    const size = SIZE - 1;
    a[0][0] = 2;
    a[size][0] = 2;
    a[0][size] = 2;
    a[size][size] = 2;

    a[0][1] = 3;
    a[0][size - 1] = 3;
    a[size][1] = 3;
    a[size][size - 1] = 3;
    a[1][0] = 3;
    a[size - 1][0] = 3;
    a[1][size] = 3;
    a[size - 1][size] = 3;

    for (var i = 2; i <= size - 2; i++) {
      a[0][i] = 4;
      a[size][i] = 4;
      a[i][0] = 4;
      a[i][size] = 4;
    }
    a[1][1] = 4;
    a[1][size - 1] = 4;
    a[size - 1][1] = 4;
    a[size - 1][size - 1] = 4;

    for (var j = 2; j <= size - 2; j++) {
      a[1][j] = 6;
      a[size - 1][j] = 6;
      a[j][1] = 6;
      a[j][size - 1] = 6;
    }

    for (var k = 2; k <= size - 2; k++) {
      for (var l = 2; l <= size - 2; l++) {
        a[k][l] = 8;
        const m = (size - 1) / 2;

        if (Number.isInteger(m) === true) {
          a[m][m] = Math.pow(size, 2);
        }
      }
    }

    this.setState({
      matrix: a
    });
    return a;
  }

  //-------------------------------------------------------------------------------------------------

  inside(g, h) {
    // on board

    const SIZE = this.props.size;
    return g >= 0 && g < SIZE && h >= 0 && h < SIZE;
  }

  //-------------------------------------------------------------------------------------------------

  determinaMin(p, w) {
    // p, w - {x, y: 1...SIZE}

    const SIZE = this.props.size;

    let min = Math.pow(SIZE, 2);
    // let w = {};
    let inside = this.inside.bind(this);
    var a = this.state.matrix;

    if (
      inside(p.x - 2, p.y - 1) &&
      a[p.x - 2][p.y - 1] > 0 &&
      a[p.x - 2][p.y - 1] < min
    ) {
      min = a[p.x - 2][p.y - 1];
      w.x = p.x - 2;
      w.y = p.y - 1;
    }

    if (
      inside(p.x - 2, p.y + 1) &&
      a[p.x - 2][p.y + 1] > 0 &&
      a[p.x - 2][p.y + 1] < min
    ) {
      min = a[p.x - 2][p.y + 1];
      w.x = p.x - 2;
      w.y = p.y + 1;
    }

    if (
      inside(p.x - 1, p.y - 2) &&
      a[p.x - 1][p.y - 2] > 0 &&
      a[p.x - 1][p.y - 2] < min
    ) {
      min = a[p.x - 1][p.y - 2];
      w.x = p.x - 1;
      w.y = p.y - 2;
    }

    if (
      inside(p.x - 1, p.y + 2) &&
      a[p.x - 1][p.y + 2] > 0 &&
      a[p.x - 1][p.y + 2] < min
    ) {
      min = a[p.x - 1][p.y + 2];
      w.x = p.x - 1;
      w.y = p.y + 2;
    }

    if (
      inside(p.x + 1, p.y - 2) &&
      a[p.x + 1][p.y - 2] > 0 &&
      a[p.x + 1][p.y - 2] < min
    ) {
      min = a[p.x + 1][p.y - 2];
      w.x = p.x + 1;
      w.y = p.y - 2;
    }

    if (
      inside(p.x + 1, p.y + 2) &&
      a[p.x + 1][p.y + 2] > 0 &&
      a[p.x + 1][p.y + 2] < min
    ) {
      min = a[p.x + 1][p.y + 2];
      w.x = p.x + 1;
      w.y = p.y + 2;
    }

    if (
      inside(p.x + 2, p.y - 1) &&
      a[p.x + 2][p.y - 1] > 0 &&
      a[p.x + 2][p.y - 1] < min
    ) {
      min = a[p.x + 2][p.y - 1];
      w.x = p.x + 2;
      w.y = p.y - 1;
    }

    if (
      inside(p.x + 2, p.y + 1) &&
      a[p.x + 2][p.y + 1] > 0 &&
      a[p.x + 2][p.y + 1] < min
    ) {
      min = a[p.x + 2][p.y + 1];
      w.x = p.x + 2;
      w.y = p.y + 1;
    }

    const matrix = a;
    this.setState({
      matrix,
      wx: w.x,
      wy: w.y
    });

    return w;
  }
}
