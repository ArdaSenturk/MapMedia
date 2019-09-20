import React, { Component } from "react";
import {
  View,
  StatusBar,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  AsyncStorage
} from "react-native";
import * as firebase from "firebase";

var CustomLayoutSpring = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.easeIn,
    springDamping: 0.7
  }
};

let screen = "";

export default class Splash extends Component {
  state = {
    splash: true
  };

  componentDidMount() {
    const { currentUser } = firebase.auth();

    if (currentUser !== "") {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setTimeout(() => {
            this.setState({ splash: false });
          }, 700);
          setTimeout(() => {
            this.props.navigation.navigate("Main");
          }, 1000);
        } else {
          setTimeout(() => {
            this.setState({ splash: false });
          }, 700);
          setTimeout(() => {
            this.props.navigation.navigate("Login");
          }, 1000);
        }
      });
    } else {
      setTimeout(() => {
        this.setState({ splash: false });
      }, 700);
      setTimeout(() => {
        this.props.navigation.navigate("Login");
      }, 1000);
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return this.state.splash ? (
      <View style={styles.container}>
        <View>
          {this.state.splash ? (
            <Image
              resizeMode="contain"
              source={require("../assets/images/icon.png")}
              style={styles.imageStyle}
            />
          ) : null}
        </View>
        {Platform.OS === "ios" ? (
          <StatusBar hidden />
        ) : (
          <StatusBar translucent={true} barStyle="light-content" />
        )}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  imageStyle: {
    width: 100,
    height: 100,
    alignSelf: "center"
  }
});
