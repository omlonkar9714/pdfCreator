import React, {Component} from 'react';
import {View, Text} from 'react-native';
import HomeScreen from './screens/HomeScreen';

class AppStart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <HomeScreen></HomeScreen>;
  }
}

export default AppStart;
