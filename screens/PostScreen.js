import React, { Component } from 'react';
import { ScrollView, KeyboardAvoidingView, StyleSheet, Text, View, FlatList, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { connect } from "react-redux";
import * as actions from "../Redux/Actions";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

class PostScreen extends Component {
  state={
    postMessages: [],
    post: null,
    user: null
  }

  componentWillMount() {
    this.props.getPostDetail(this.props.navigation.getParam("id").channelId)
    this.userInfo()
  }

  userInfo() {
    const { currentUser } = firebase.auth()
    firebase.database().ref(`Users/${currentUser.uid}`).once("value", snap => {
      this.setState({ user: { email: snap.val().email, id: snap.val().uid } })
    })
  }

  componentWillReceiveProps(nextProps) {        
    if (nextProps.status === "getPostsSuccess") {
      this.setState({ postMessages: Object.values(nextProps.data) })
    }
  }

  render() {
    return (
      <View
      style={styles.container}
      >
        <Text
        style={{ backgroundColor: 'red', fontSize: 17, color: 'white', marginTop: 10, left: 10, width: 35 }}
        onPress={() => this.props.navigation.pop()}
        >Geri</Text>
        <FlatList      
        style={{ height, marginTop: 10, width }}
        keyExtractor={(item, index) => index.toString()}
        data={this.state.postMessages}
        renderItem={(item, index) => (
          <List
            item={item}
            index={index}
          />
        )}
      />
      <KeyboardAvoidingView behavior="padding">
      <View
      style={{ flexDirection: 'row' }}
      >
      <TextInput
      style={{ width, fontSize: 17, bottom: 0, borderWidth: 0.5, borderColor: 'gray', padding: 10 }}
      placeholder="Mesaj"
      value={this.state.post}
      onChangeText={(post) => this.setState({ post })}
      />
      {(this.state.post && this.state.user) ? (
        <TouchableOpacity
        onPress={() => {
          let d = new Date()
          this.props.sendMessage({ channelId: this.props.navigation.getParam("id").channelId, id: d.getTime(), post: this.state.post, userInfo: this.state.user })
          this.setState({ post: null })
        }}
        style={{ position: 'absolute', right: 10 }}
        >
          <Ionicons
          name="ios-send"
          size={40}
          />
        </TouchableOpacity>
      ) : null}
      </View>
      </KeyboardAvoidingView>
      </View>
    );
  }
}

class List extends Component {

  render() {
    const { post,userInfo: {email} } = this.props.item.item
    return (
      <View>
      <View
      style={{ margin: 5, borderWidth: 0.5, borderRadius: 5 }}
      >
        <Text style={{ fontSize: 17, padding: 5 }} >{post}</Text>
      </View>
      <Text style={{ fontSize: 12, color: 'gray', paddingHorizontal: 5 }} >{email}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});


const mapStateToProps = ({ postReducers }) => {
  const { status, data } = postReducers;
  return {
    status,
    data
  };
};

export default connect(
  mapStateToProps,
  actions
)(PostScreen);