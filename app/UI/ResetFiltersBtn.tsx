import React, { Component } from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";
import colors from "../config/colors";

interface ResetFiltersProps {
  onResetFilters: () => void;
}

export default class ResetFilterBtn extends Component<ResetFiltersProps, {}> {
  render() {
    return (
      <TouchableHighlight>
        <Text style={styles.text} onPress={this.props.onResetFilters}>
          Reset filters
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    backgroundColor: colors.mainBanana,
    width: 200,
    height: 50,
    padding: 15,
    marginTop: 5,
    fontWeight: "bold",
    color: colors.textBlue,
  },
});
