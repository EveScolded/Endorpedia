import { NavigationProp } from "@react-navigation/native";
import React, { Component } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../config/colors";
import { Authenticator } from "../service/Authenticator";

interface AuthState {
  login: string;
  password: string;
  icon: string;
  isHidden: boolean;
  invalidLogIn: boolean;
}

interface IAuthProps {
  navigation: NavigationProp<any>;
}

export default class Autenthication extends Component<IAuthProps, AuthState> {
  private authenticator = new Authenticator();

  constructor(props) {
    super(props);

    this.state = {
      login: "",
      password: "",
      icon: "eye-slash",
      isHidden: true,
      invalidLogIn: false,
    };
  }
  private changeIcon = () => {
    this.setState((prevState) => ({
      icon: prevState.icon === "eye" ? "eye-slash" : "eye",
      isHidden: !prevState.isHidden,
    }));
  };

  private onLogIn = () => {
    try {
      this.authenticator.setToken(this.state.login, this.state.password);
      this.props.navigation.navigate("Start");
      this.setState({ invalidLogIn: false });
    } catch (e) {
      this.setState({ invalidLogIn: true });
    }
  };

  public async componentDidMount(): Promise<void> {
    try {
      const token = await this.authenticator.getToken();
      if (token) {
        this.props.navigation.navigate("Start");
      }
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background.jpg")}
          resizeMode="cover"
          style={styles.imageBackground}
        >
          <View style={styles.content}>
            {this.state.invalidLogIn && (
              <Text style={styles.loginErrorMsg}>
                {
                  "Invalid login or password. Try login: 'Wooo' and password: 'kiee'."
                }
              </Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={{ width: "100%" }}
                placeholder={"login"}
                onChangeText={(login) => this.setState({ login })}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ width: "95%" }}
                secureTextEntry={this.state.isHidden}
                placeholder={"password"}
                onChangeText={(password) => this.setState({ password })}
              />
              <Icon
                style={styles.iconStyle}
                name={this.state.icon}
                onPress={this.changeIcon}
              ></Icon>
            </View>
            <TouchableHighlight
              style={styles.logInButton}
              onPress={this.onLogIn}
            >
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconStyle: {
    alignSelf: "center",
    fontSize: 20,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    margin: 48,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    backgroundColor: colors.searchWindow,
    width: 354,
    height: 50,
    margin: 6,
    padding: 15,
    fontWeight: "bold",
  },
  logInButton: {
    justifyContent: "center",
    borderColor: colors.borderWhite,
    backgroundColor: colors.mainBackground,
    borderWidth: 1,
    width: 170,
    height: 50,
    marginTop: 36,
  },
  buttonText: {
    color: colors.textBlue,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  loginErrorMsg: {
    color: "red",
    backgroundColor: colors.mainBackground,
    borderColor: "red",
    borderWidth: 1,
    padding: 6,
  },
});
