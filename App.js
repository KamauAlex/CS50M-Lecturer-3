 import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

// Time constants
// Work time
let workMin = "00";
let workSec = "05";
let workOverall = parseInt(workMin) + parseInt(workSec);
// Break time
let breakMin = "00";
let breakSec = "10";
let breakOverall = parseInt(breakMin) + parseInt(breakSec);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  clock: {
    fontSize: 40,
    alignItems: 'center',
  },
  buttonsView: {
    flexDirection: 'row',
  },
  buttonStyle: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 0.5,
  },
  center: {
    alignItems: 'center',
  }

});

const Clock = props => (
  <View style={styles.center}>
    <Text style={styles.clock}>{props.minutes}:{props.seconds}</Text>
  </View>

);

const Buttons = props => (
  <View style={styles.buttonsView}>
    <Button title={props.buttonTitle} onPress={props.startTimer} color="black" style={styles.buttonStyle}/>
    <Button title="Reset" onPress={props.resetTimer} color="black" style={styles.buttonStyle}/>
  </View>
);  

class Timer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      overall: workOverall,
      minutes: workMin,
      seconds: workSec,
      started: false,
      buttonTitle: "Start",
      break: false,
    };
    this.decrement = this.decrement.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.finishTimer = this.finishTimer.bind(this);
  }

  decrement () {

    // if (this.state.seconds === "00") { // Go from 24:00 to 23:59
    //   this.setState(prevState => ({
    //     minutes: String(parseInt(prevState.minutes) - 1),
    //     seconds: "59",
    //   }))
    // } else if (parseInt(this.state.seconds) <= 10) {
    //   this.setState(prevState => ({
    //     seconds: "0" + String(parseInt(prevState.seconds) - 1),
    //   }))
    // } else {
    //   this.setState(prevState => ({
    //     seconds: String(parseInt(prevState.seconds) - 1),
    //   }));      
    // }
    if (this.state.overall <= 1) {
      console.log("VIBRATING!");
      this.finishTimer();

    }
    else if (parseInt(this.state.minutes) <= 9 && parseInt(this.state.minutes) >= 0 &&
        parseInt(this.state.seconds) <= 10 && parseInt(this.state.seconds) > 0) {

      this.setState(prevState => ({
        overall: prevState.overall - 1,
        minutes: "0" + String(Math.floor((prevState.overall - 1) / 60)),
        seconds: "0" + String((prevState.overall - 1) % 60),
      }));  

    }
    else if (parseInt(this.state.minutes) <= 9 && parseInt(this.state.minutes) >= 0) {
      this.setState(prevState => ({
        overall: prevState.overall - 1,
        minutes: "0" + String(Math.floor((prevState.overall - 1) / 60)),
        seconds: String((prevState.overall - 1) % 60),
      }));      
    }
    else if (parseInt(this.state.seconds) <= 10 && parseInt(this.state.seconds) > 0) {
      this.setState(prevState => ({
        overall: prevState.overall - 1,
        minutes: String(Math.floor((prevState.overall - 1) / 60)),
        seconds: "0" + String((prevState.overall - 1) % 60),
      }));
    } else {
      this.setState(prevState => ({
        overall: prevState.overall - 1,
        minutes: String(Math.floor((prevState.overall - 1) / 60)),
        seconds: String((prevState.overall - 1) % 60),
      })); 
    }


  }

  startTimer () {
    if (this.state.started === false) {
      this.interval = setInterval(this.decrement, 1000);
      this.setState({
        started: true,
        buttonTitle: "Stop",
      })
    } else {
      clearInterval(this.interval);
      this.setState({
        started: false,
        buttonTitle: "Continue",
      })
    }

  }

  resetTimer () {
    clearInterval(this.interval);
    this.setState({
      started: false,
      buttonTitle: "Start",
      minutes: workMin,
      seconds: workSec,
      break: false,
      overall: workOverall,
    });
    this.props.setRedColor();
  }

  finishTimer () {
    clearInterval(this.interval);
    if (this.state.break == false) {
      this.setState({
        break: true,
        started: false,
        buttonTitle: "Start",
        minutes: breakMin,
        seconds: breakSec,
        overall: breakOverall,
      });
      this.props.changeBackgroundColor();
    } else {
      this.setState({
        break: false,
        started: false,
        buttonTitle: "Start",
        minutes: workMin,
        seconds: workSec,
        overall: workOverall,
      });
      this.props.changeBackgroundColor();
    }
  }

  render() {
    return (
      <View>
        <Clock minutes={this.state.minutes} seconds={this.state.seconds} />
        <Buttons startTimer={this.startTimer} resetTimer={this.resetTimer} buttonTitle={this.state.buttonTitle} />
      </View>
    );
  }
}


export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      color: "#f96161",
    }
    this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
    this.setRedColor = this.setRedColor.bind(this);
  }

  changeBackgroundColor() {
    if (this.state.color == "#f96161") {
      this.setState({
        color: "#5aed75",
      })
    } else {
      this.setState({
        color: "#f96161",
      })
    }
  }

  setRedColor() {
    this.setState({
      color: "#f96161",
    })
  }

  render() {
    return (
      <View style={[styles.container, styles.center, {backgroundColor: this.state.color}]}>
        <Text style={[{fontSize: 26, marginBottom: '10%'}, styles.center]}>Pomodoro Timer!</Text>
        <Timer changeBackgroundColor={this.changeBackgroundColor} setRedColor={this.setRedColor}/>
      </View>
    );
  }
}

