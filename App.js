import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import * as firebase from 'firebase'
import reducers from "./Redux/Reducers";
import AppNavigator from './navigation/AppNavigator';


const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  componentWillMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyBDDXsTg4PM7I-Bs2HYFJKI83YiB7YQc_4",
      authDomain: "mapmedia-fe54b.firebaseapp.com",
      databaseURL: "https://mapmedia-fe54b.firebaseio.com",
      projectId: "mapmedia-fe54b",
      storageBucket: "",
      messagingSenderId: "576461090238",
      appId: "1:576461090238:web:65dfd8da8fd71eedbd1def"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon.png'),
      ]),
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
