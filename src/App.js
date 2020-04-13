import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";

import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
  onSubmit = async (event) => {
    event.preventDefault();
    window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ message: "Waiting on transcation success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have been entered." });
  };

  onClick = async () => {
    window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transcation success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "A winner has been picked" });
  };
  render() {
    console.log(web3.version);
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This Contract is manager by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people competing to
          win {web3.utils.fromWei(this.state.balance, "ether")} ether.
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Try your Luck</h4>
          <div>
            <label>Amount of Ether </label>

            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pic a winner</h4>
        <button onClick={this.onClick}>Pick Winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
