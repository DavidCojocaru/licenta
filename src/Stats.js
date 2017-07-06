import React, { Component } from "react";
import "./Stats.css";
import firebase from "firebase";
import autoBind from "react-class/autoBind";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
// import Griddle, { plugins, styleConfig } from "griddle-react";

const COLOR_COMPUTER = "#2196F3";
const COLOR_USER = "#43AA8B";

const RADIAN = Math.PI / 180;

import { getSizesForGames, filterGamesByUser } from "./utils";

export default class Stats extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {};
  }

  componentDidMount() {
    var ref = firebase.database().ref();
    ref.on(
      "value",
      snapshot => {
        const games = snapshot.val().game;
        const user = this.props.user;
        const gamesForUser = filterGamesByUser(user, games);
        // pentru jocurile unui user imi returneaza size-urile fiecarui joc pe categorii
        // user Andi, are jocurile 1, 5, 7, 9 => { 6: {1,5}, 4: {7},  5: {9} }
        const sizes = getSizesForGames(gamesForUser);
        this.setState({
          gamesBySize: sizes
        });
      },
      function(error) {
        console.log("Error: " + error.code);
      }
    );
  }

  renderGamesBySize() {
    const gamesBySize = this.state.gamesBySize;

    if (!gamesBySize) {
      return null;
    }
    // { 4: {7},  5: {9}, 6: {1,5}, }
    const sizes = Object.keys(gamesBySize).sort();
    return sizes.map((size, index) => {
      const games = gamesBySize[size];

      const computerMoves = games.reduce((acc, game) => {
        return acc + game.compMoves;
      }, 0);

      const playerMoves = games.reduce((acc, game) => {
        return acc + game.playerMoves;
      }, 0);

      const count = games.length;
      const wonByUser = games.reduce((acc, game) => {
        if (game.winner === false) {
          acc++;
        }
        return acc;
      }, 0);

      const data = [
        {
          name: "Computer",
          label: "Computer",
          color: COLOR_COMPUTER,
          fill: COLOR_COMPUTER,
          value: count - wonByUser
        },
        {
          name: "Player",
          color: COLOR_USER,
          fill: COLOR_USER,
          value: wonByUser
        }
      ];

      const colors = [COLOR_COMPUTER, COLOR_USER];

      const renderLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
          <text //pt procente
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {index === 0 ? "Computer " : "Player "}:{" "}
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

      return (
        <div
          key={size}
          className="stats-item"
          style={{
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <PieChart width={400} height={250}>
            <Pie
              data={data}
              cx={200}
              cy={125}
              innerRadius={30}
              outerRadius={80}
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry, index) =>
                <Cell fill={colors[index % colors.length]} />
              )}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                const content = payload[0];
                if (!content) {
                  return null;
                }

                return (
                  <div //content de wons
                    style={{
                      padding: 10,
                      background: "white",
                      border: "1px solid black"
                    }}
                  >
                    {content.name === 0
                      ? "Computer: " + data[0].value
                      : "Player: " + data[1].value}
                  </div>
                );
              }}
            />
          </PieChart>
          <p style={{ maxWidth: 300, fontSize: 16 }}>
            <h5>
              Game size {size}:
            </h5>
            <hr />
            <div>
              Total games: {count}.
            </div>
            <div>
              {" "}Computer moves: {computerMoves}.
            </div>
            <div>
              {" "}Player moves: {playerMoves}.
            </div>
          </p>
        </div>
      );
    });
  }

  render() {
    const gamesBySize = this.renderGamesBySize();

    return (
      <div>
        {gamesBySize}
      </div>
    );
  }
}
