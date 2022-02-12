import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import colors from "../config/colors";

interface CardProps {
  itemName: string;
  propertyOne: string[] | string;
  propertyTwo: string[] | string;
  propertyThree: string[] | string;
  onClick: () => void;
}

export default class Card extends Component<CardProps, {}> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableHighlight
        style={styles.itemsList}
        onPress={() => this.props.onClick()}
      >
        <View>
          <Text style={[styles.item, styles.itemName]}>
            {this.props.itemName}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyOne[0]}: {this.props.propertyOne[1]}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyTwo[0]}: {this.props.propertyTwo[1]}
          </Text>
          <Text style={styles.item}>
            {this.props.propertyThree[0]}: {this.props.propertyThree[1]}
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
    width: 170,
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
