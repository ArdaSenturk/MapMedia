import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  TextInput
} from "react-native";
import MapView from "react-native-maps";
import * as firebase from 'firebase';
import { Ionicons } from "@expo/vector-icons";
import ClusterMarker from "./ClusterMarker";
import { getCluster } from "./MapUtils";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { connect } from "react-redux";
import * as actions from "../Redux/Actions";

const { width, height } = Dimensions.get("window");

let PostLocations = [];
let Posts = null;
let markerTap = 0;

const INITIAL_POSITION = {
  latitude: 41.0082376,
  longitude: 28.9783589,
  latitudeDelta: 2,
  longitudeDelta: 2
}

class HomeScreen extends Component {
  state = {
    postField: false,
    locationDetail: null,
    locationData: null,
    post: null,
    user: null,
    markers: [],
    region: INITIAL_POSITION,
    getPost: null,
    fullPost: null
  };

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ user: { email: currentUser.email, id: currentUser.uid } })
    this.props.getPost();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === "getPostSuccess") {
      for (let i = 0; i < Object.values(nextProps.data).length; i++) {
        const element = Object.values(nextProps.data)[i];        
        Posts = Object.values(element.Posts)[i].post
        // PostLocations = [{ lat: element.locationDetail.lat, lon: element.locationDetail.lng }]
        PostLocations.push({ lat: element.locationDetail.lat, lon: element.locationDetail.lng })
      }
      this.setState({ markers: PostLocations, getPost: Posts, fullPost: nextProps.data })
    }
  }

  render() {
    const { region } = this.state;
    
    const allCoords = PostLocations.map(c => ({
      geometry: {
        coordinates: [c.lon, c.lat]
      }
    }));

    const cluster = getCluster(allCoords, region);

    return (
      <View style={styles.container}>
        <MapView         
        style={styles.map}
        loadingIndicatorColor={"#ffbbbb"}
        loadingBackgroundColor={"#ffbbbb"}
        region={region}
        onRegionChangeComplete={region => this.setState({ region })}
        >
          {cluster.markers.map((marker, index) => this.renderMarker(marker, index))}
        </MapView>
        <View
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 2,
            backgroundColor: "red",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ postField: true })}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              width: 60,
              height: 60
            }}
          >
            <Ionicons name="ios-create" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {this.postField()}
      </View>
    );
  }

  postField() {
    return (
      <Modal transparent animationType="slide" visible={this.state.postField}>
        <View
          style={{
            width,
            height,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: width - 50,
              height: height / 2,
              backgroundColor: "white",
              borderRadius: 25,
              borderWidth: 0.5,
              position: "absolute",
              zIndex: 3
            }}
          >
            <TouchableOpacity
            onPress={() => this.setState({ postField: false })}
            style={{ position: "absolute", right: 10, top: 10, zIndex: 3 }}
            >
              <Ionicons
              size={40}
              name="ios-close"
              />
            </TouchableOpacity>
            <View style={{marginTop: 50}} />
            <TextInput
            value={this.state.post}
            onChangeText={(post) => this.setState({ post })}
            multiline
            placeholder="Gönderinizi Giriniz..."
            maxLenght={200}
            style={{ borderWidth: 0.5, borderColor: 'gray', height: 50, paddingHorizontal: 10 }}
            />
            <GooglePlacesAutocomplete
              placeholder='Lokasyon'
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              keyboardAppearance={'light'} 
              listViewDisplayed='auto'    
              fetchDetails={true}
              renderDescription={row => row.description} 
              onPress={(data, details = null) => { 
                this.setState({ locationDetail: { lat: details.geometry.location.lat, lng: details.geometry.location.lng, name: details.name, id: details.id } })
                

              }}

              getDefaultValue={() => ''}

              query={{
                key: 'AIzaSyB6Mm8N2qdAQwQUQxAiVzW7ZjT6yKVJbl8',
                language: 'tr', 
                types: '(cities)' 
              }}

              styles={{
                textInputContainer: {
                  width: '100%'
                },
                description: {
                  fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }
              }}

              currentLocation={true}
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch'
              GooglePlacesSearchQuery={{
                rankby: 'distance',
                type: 'cafe'
              }}
              
              GooglePlacesDetailsQuery={{
                fields: 'formatted_address',
              }}

              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
              debounce={200}
            />

            <TouchableOpacity
            onPress={() => {              
              this.props.post(this.state.post, this.state.locationDetail, this.state.user)
            }}
            style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', width: 90, height: 40, alignSelf: 'center', borderRadius: 10 }}
            >
              <Text
              style={{ fontSize: 17, padding: 5, color: 'white' }}
              >Gönder</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    );
  }

  renderMarker = (marker, index) => {
    const key = index + marker.geometry.coordinates[0];

    const { getPost, fullPost } = this.state;
    // console.log(marker);
    // console.log(fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))])
    // console.log((marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', '')));

    // if (fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))]) {
    // console.log(Object.values(fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))].Posts));
    // }
    let lastPost = null;
    if (fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))]) {
      for (let i = 0; i < Object.values(fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))].Posts).length; i++) {
        const element = Object.values(fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))].Posts)[i];
        lastPost = element.post
      }
    }
    
    
    
    // If a cluster
    if (marker.properties) {
      return (
        <MapView.Marker
          key={key}
          coordinate={{
            latitude: marker.geometry.coordinates[1],
            longitude: marker.geometry.coordinates[0]
          }}
        >
          <ClusterMarker count={marker.properties.point_count} />
        </MapView.Marker>
      );
    }
    // If a single marker
    return (
      <MapView.Marker
        title={lastPost}
        description="Test"
        onPress={() => {
          if (markerTap === 0) {
            markerTap += 1
          } else if (markerTap === 1) {
            this.props.navigation.navigate("PostScreen", { post: fullPost, id: fullPost[(marker.geometry.coordinates[1].toString().replace('.', ''))+(marker.geometry.coordinates[0].toString().replace('.', ''))] })
            markerTap = 0
          }
        }}
        key={key}
        coordinate={{
          latitude: marker.geometry.coordinates[1],
          longitude: marker.geometry.coordinates[0]
        }}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    ...StyleSheet.absoluteFill
  }
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
)(HomeScreen);
