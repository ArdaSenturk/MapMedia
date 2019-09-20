import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions";

const { width, height } = Dimensions.get("screen");

var CustomLayoutSpring = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  }
};

class Login extends React.Component {
  state = {
    login: true,
    register: false,
    loading: false,
    email: "",
    password: "",
    username: ""
  };

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }

  componentWillReceiveProps(nextProps) {
    const { status, data } = nextProps;
    if (status === "attempting") {
      this.setState({ loading: true });
    } else if (status === "registerFail") {
      console.log("Kayıt Hatası");
      alert("Kayıt Hatası")
      this.setState({ loading: false })
    } else if (status === "registerSuccess") {
      this.props.navigation.navigate("Main");
    } else if (status === "loginFail") {
      console.log("Giriş Hatası");
      
    } else if (status === "loginSuccess") {
      this.props.navigation.navigate("Main");
    } else if (status === "forgotFail") {
      console.log("Forgot Hatası");
      
    } else if (status === "forgotSuccess") {
      console.log("Forgot Başarılı");
      
    }
  }

  login() {
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  register() {
    const {
      email,
      password,
      username
    } = this.state;
    this.props.register(
      email,
      password,
      username
    )
  }

  forgotPassword() {
    this.props.forgot(this.state.email);
  }

  render() {
    const { login, register } = this.state;
    return (
      <View style={styles.container}>
        {login && (
          <View
            style={{
              width: width - 60,
              position: "absolute",
              top: 50,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{ width: 80, height: 80 }}
              source={require("../../assets/images/icon.png")}
            />
          </View>
        )}

        <KeyboardAvoidingView>
          {login ? this.loginUI() : this.registerUI()}
        </KeyboardAvoidingView>
      </View>
    );
  }

  loginUI() {
    const { login, register, email, password, loading } = this.state;
    return (
      <View style={styles.loginViewStyle}>
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Mail"
            numberOfLines={1}
            keyboardType="email-address"
            onSubmitEditing={() => {
              this.password.focus();
            }}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            style={styles.textInputStyle}
            secureTextEntry
            keyboardType="default"
            placeholder="Şifre"
            numberOfLines={1}
            ref={ref => (this.password = ref)}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={password}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={this.login.bind(this)}
          style={styles.loginButtonStyle}
        >
          {loading ? (
            <ActivityIndicator color="white" size={1} />
          ) : (
            <Text style={{ color: "white", fontSize: 17 }}>
              Giriş Yap
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={() => this.setState({ login: !login, register: !register })}
          style={[styles.loginButtonStyle, { backgroundColor: "#00A4CCFF" }]}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Kayıt Ol
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={this.forgotPassword.bind(this)}
        >
          <Text style={{ color: "gray", fontSize: 14, marginTop: 10 }}>
            Şifremi Unuttum
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  registerUI() {
    const {
      login,
      register,
      email,
      password,
      username,
      loading,
    } = this.state;
    return (
      <View style={styles.loginViewStyle}>
        <View>
          <TextInput
            style={[
              styles.textInputStyle
            ]}
            placeholder="Email"
            numberOfLines={1}
            keyboardType="email-address"
            onSubmitEditing={() => {
              this.password.focus();
            }}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            style={[
              styles.textInputStyle
            ]}
            secureTextEntry
            keyboardType="default"
            placeholder="Şifre"
            numberOfLines={1}
            ref={ref => (this.password = ref)}
            onSubmitEditing={() => {
              this.username.focus();
            }}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={password}
            onChangeText={password => this.setState({ password })}
          />
          <TextInput
            style={[
              styles.textInputStyle
            ]}
            keyboardType="default"
            placeholder="Kullanıcı Adı"
            numberOfLines={1}
            ref={ref => (this.username = ref)}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={username}
            onChangeText={username =>
              this.setState({ username })
            }
          />
        </View>
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={this.register.bind(this)}
          style={[styles.loginButtonStyle, { backgroundColor: "#00A4CCFF" }]}
        >
          {loading ? (
            <ActivityIndicator color="white" size={1} />
          ) : (
            <Text style={{ color: "white", fontSize: 17 }}>
              Kayıt Ol
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={() => this.setState({ login: !login, register: !register })}
          style={[styles.loginButtonStyle]}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Giriş Yap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          activeOpacity={0.8}
          onPress={this.forgotPassword.bind(this)}
        >
          <Text style={{ color: "gray", fontSize: 14, marginTop: 10 }}>
            Şifremi Unuttum
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  selectProduct = id => {
    const { product, selectProduct } = this.state;
    product[id].selected = !product[id].selected;
    this.setState({ product });

    selectProduct.splice(0, selectProduct.length);
    for (let i = 0; i < product.length; i++) {
      const element = product[i];
      if (element.selected) {
        selectProduct.push(element.db);
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  loginViewStyle: {
    width: width - 50,
    justifyContent: "center",
    alignItems: "center"
  },
  textInputStyle: {
    width: width - 60,
    height: 40,
    margin: 5,
    paddingLeft: 10,
    borderWidth: 0.5,
    borderColor: "gray"
  },
  loginButtonStyle: {
    width: "60%",
    height: 40,
    backgroundColor: "#26de81",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  }
});

const mapStateToProps = ({ loginReducers }) => {
  const { status, data } = loginReducers;
  return {
    status,
    data
  };
};

export default connect(
  mapStateToProps,
  actions
)(Login);
