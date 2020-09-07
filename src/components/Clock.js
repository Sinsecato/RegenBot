import React from "react";
import ReactDOM from "react-dom";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minutes: 1, seconds: 59 };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let newSeconds = this.state.seconds - 1;
    if (newSeconds <= 0 && this.state.minutes <= 0) {
      this.props.action();
      this.restart();
    } else if (newSeconds > 0) {
      this.setState({
        seconds: newSeconds,
      });
    } else {
      let newMinutes = this.state.minutes - 1;
      this.setState({
        minutes: newMinutes,
        seconds: 59,
      });
    }
  }

  less10() {
    return this.state.seconds > 9
      ? this.state.seconds
      : "0" + this.state.seconds;
  }

  restart() {
    this.setState({
      minutes: "1",
      seconds: "59",
    });
  }

  render() {
    return (
      <span className="countdownTimer">
        {this.state.minutes} : {this.less10()}
      </span>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));

export default Clock;
