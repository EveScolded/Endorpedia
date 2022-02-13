import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity as TouchableHighlight,
} from "react-native";
import colors from "../config/colors";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/grogu.png")} />
      <Text style={styles.header}>Endorpedia</Text>
      <View style={styles.container}>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("People")}
          >
            People
          </Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("Films")}
          >
            Films
          </Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("Starships")}
          >
            Starships
          </Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("Vehicles")}
          >
            Vehicles
          </Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("Species")}
          >
            Species
          </Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text
            style={styles.text}
            onPress={() => navigation.navigate("Planets")}
          >
            Planets
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.mainBackground,
    color: colors.textWhite,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
    borderColor: colors.borderWhite,
    borderWidth: 1,
    width: 200,
    height: 50,
    padding: 15,
    fontWeight: "bold",
    color: colors.textWhite,
  },
  header: {
    fontSize: 32,
    fontWeight: "600",
    padding: 10,
    color: colors.mainBanana,
    textShadowColor: " rgba(255, 232, 31, 1)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 19,
  },
});
