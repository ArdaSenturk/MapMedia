import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import PostScreen from '../screens/PostScreen';


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    PostScreen
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
);


export default HomeStack;
