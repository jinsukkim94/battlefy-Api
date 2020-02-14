import React, { Component } from 'react';
import './App.css';
const API_URL = process.env.REACT_APP_API_URL;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      submit: false,
      data: []
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.value) {
      alert("Enter A Summoner's Name");
    } else {
      fetch(`${API_URL}/${this.state.value}`).then((res) => res.json()).then((result) => {
        this.setState({ submit: true, data: result });
      })
    }
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header">
          {!this.state.submit ?
            <form onSubmit={this.handleSubmit}>
              <label>
                Enter Summoner Name: {" "}
                <input type="text" name="name" onChange={this.handleChange}></input>
              </label>
              <input type="submit" value="Submit"></input>
            </form>
            :
            <ul>
              {this.state.data.map((item, index) => {
                console.log(item, index);
                return (
                  <li key={index}>
                    <p>Summoner: {item.summonerName} / Result: {item.win ? "WIN" : "LOSE"}{""}</p>
                    <p>GameTime: {`${item.gameTime.minutes}:${item.gameTime.seconds}`}{" "}</p>
                    <p>KDA: {item.kda}{" "}</p>
                    <p>Champion: {`${item.champ} / Level: ${item.champLevel}`}{" "}</p>
                    <p>Spells:
                      <div>{item.spells[0].slice(8)}</div>
                      <div>{item.spells[1].slice(8)}</div>
                    </p>
                    <p>Runes:
                      <div>{item.perks.key}</div>
                      <div>{item.perks.second}</div>
                    </p>
                    <p>Items: {item.items.map((single) =>
                      <div>{`${single} `}{" "}</div>
                    )}
                    </p>
                    <p>Minions: {item.totalMinionsKilled}{" "}</p>
                    <p>Minions Per Minute: {item.minionsPerMin.toFixed(2)}{" "}</p>
                    <hr />
                  </li>
                )
              }
              )}
            </ul>
          }
        </header>
      </div>
    );
  }
}

export default App;
