import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../config/colors";

interface IDetailsProps {
  route: any;
}

export default class Details extends Component<IDetailsProps, {}> {
  render() {
    const { details } = this.props.route.params;
    return (
      <View style={styles.details}>
        {details != null &&
          Object.keys(details).map((key) => {
            return (
              <Text style={styles.detail} key={key}>
                {key[0].toUpperCase() + key.slice(1).replace("_", " ")}:{" "}
                {details[key]}
              </Text>
            );
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.mainBackground,
    justifyContent: "space-evenly",
  },
  detail: {
    color: colors.textBlue,
    lineHeight: 20,
  },
});
