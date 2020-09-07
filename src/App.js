import React, { Component } from "react";
import "./App.css";
import UiRoot from "./components/UiRoot";

class App extends Component {
  state = {};

  render() {
    return (
      <div className="App">
        <div>
          <UiRoot />
        </div>
      </div>
    );
  }
}

export default App;
