import React from "react";
import Tabs from "muicss/lib/react/tabs";
import Tab from "muicss/lib/react/tab";
import firebase from "firebase";

import { getSizesForGames, gamesToArray } from "../utils";

export default class HighScores extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      games: null
    };
  }
  render() {
    return (
      <Tabs>
        <Tab label="All sizes">
          {this.renderSize()}
        </Tab>
        <Tab label="Size 4">
          {this.renderSize(4)}
        </Tab>
        <Tab label="Size 5">
          {this.renderSize(5)}
        </Tab>
        <Tab label="Size 6">
          {this.renderSize(6)}
        </Tab>
        <Tab label="Size 7">
          {this.renderSize(7)}
        </Tab>
      </Tabs>
    );
  }

  renderSize(size) {
    if (!this.state.games) {
      return <div>loading...</div>;
    }

    const games = size
      ? getSizesForGames(this.state.games)[size] || []
      : this.state.games;

    if (!games.length) {
      return (
        <div>
          No games of size {size} found.
        </div>
      );
    }

    const users = games.reduce((acc, game) => {
      acc[game.user] = acc[game.user] || { winCount: 0, lostCount: 0 };

      if (game.winner === false) {
        acc[game.user].winCount++;
      } else {
        acc[game.user].lostCount++;
      }

      return acc;
    }, {});

    const userNames = Object.keys(users);
    const rankings = userNames
      .map(userName => {
        const user = users[userName];
        const gamesWon = user.winCount;
        const gamesPlayed = user.winCount + user.lostCount;

        return {
          userName,
          gamesWon,
          gamesPlayed,
          gamesLost: user.lostCount,
          wonPercentage: gamesWon / gamesPlayed
        };
      })
      .sort((user1, user2) => {
        return user1.wonPercentage < user2.wonPercentage;
      });

    return (
      <table
        className="mui-table mui-table--bordered"
        style={{ marginTop: 20 }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Fitness</th>
            <th># games won</th>
            <th># games played</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r, index) => {
            const style = {};

            if (r.userName === this.props.user) {
              style.fontWeight = "bold";
              style.color = "#2196F3";
            }
            return (
              <tr style={style} key={index}>
                <td>
                  {r.userName}
                </td>
                <td>
                  {r.wonPercentage.toFixed(2) * 100} %
                </td>
                <td>
                  {r.gamesWon}
                </td>
                <td>
                  {r.gamesPlayed}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  componentDidMount() {
    var ref = firebase.database().ref();
    ref.on(
      "value",
      snapshot => {
        const games = gamesToArray(snapshot.val().game);

        this.setState({
          games
        });
      },
      function(error) {
        console.log("Error: " + error.code);
      }
    );
  }
}
