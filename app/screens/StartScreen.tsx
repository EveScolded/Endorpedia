import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity as TouchableHighlight,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
        <Text style={styles.text}>Films</Text>
        <Text style={styles.text}>Starships</Text>
        <Text style={styles.text}>Vehicles</Text>
        <Text style={styles.text}>Species</Text>
        <Text style={styles.text}>Planets</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#fff",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
    borderColor: "#fff",
    borderWidth: 1,
    width: 200,
    height: 50,
    padding: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    fontSize: 32,
    fontWeight: "600",
    padding: 10,
    color: "#FFE81F",
    textShadowColor: " rgba(255, 232, 31, 1)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 19,
  },
});
