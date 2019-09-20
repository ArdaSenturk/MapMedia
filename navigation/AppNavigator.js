import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Splash from '../screens/Splash';
import Login from '../screens/LoginRegister/Main';
import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  Splash,
  Login,
  Main: MainTabNavigator,
}));