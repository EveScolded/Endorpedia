import React, { Component } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
} from "react-native";
import colors from "../config/colors";

interface InputProps {
  placeholderText: string;
  onSearchInput: (search: string) => void;
  searchItem: () => void;
}

export default class SearchInput extends Component<InputProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={this.props.placeholderText}
          style={styles.inputStyle}
          onChangeText={(search) => this.props.onSearchInput(search)}
        />
        <TouchableHighlight onPress={this.props.searchItem}>
          <Image
            style={styles.imageStyle}
            source={require("../assets/searchIcon.png")}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    backgroundColor: colors.searchWindow,
    width: 354,
    height: 50,
    margin: 6,
    padding: 15,
    fontWeight: "bold",
  },
  inputStyle: { flex: 1 },
  imageStyle: {
    margin: 3,
    height: 15,
    width: 15,
    resizeMode: "stretch",
    alignItems: "center",
  },
});
