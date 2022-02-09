import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import colors from "../config/colors";

interface CardProps {
  item: string[];
  itemName: string;
  propertyOneName: string;
  propertyOneValue: string;
  propertyTwoName: string;
  propertyTwoValue: string;
  propertyThreeName: string;
  propertyThreeValue: string;
  onClick: (string) => void;
}

export default class Card extends Component<CardProps, {}> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableHighlight
        style={styles.itemsList}
        onPress={() => this.props.onClick(this.props.item)}
      >
        <View>
          <Text style={[styles.item, styles.itemName]}>
            {this.props.itemName}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyOneName}: {this.props.propertyOneValue}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyTwoName}: {this.props.propertyTwoValue}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyThreeName}: {this.props.propertyThreeValue} cm
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  itemsList: {
    textAlign: "center",
    borderColor: colors.borderWhite,
    borderWidth: 1,
    width: 166,
    margin: 6,
    padding: 15,
  },
  item: {
    textAlign: "center",
    fontWeight: "bold",
    color: colors.textBlue,
  },
  itemName: {
    textTransform: "uppercase",
    fontSize: 14,
    borderBottomColor: colors.borderWhite,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});
