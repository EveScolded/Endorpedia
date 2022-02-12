import React from "react";
import StartScreen from "./app/screens/StartScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import People from "./app/screens/People";
import Details from "./app/screens/Details";
import { SwapiService } from "./app/service/SwapiService";
import { CacheService } from "./app/service/CacheService";
import Autenthication from "./app/screens/Authentication";
import colors from "./app/config/colors";
import Films from "./app/screens/Films";

const Stack = createNativeStackNavigator();

export default function App() {
  const swapiService = new CacheService(new SwapiService());

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={Autenthication}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: colors.mainBackground,
            },
          }}
        />
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: colors.mainBackground,
            },
          }}
        />
        <Stack.Screen
          name="People"
          component={People}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Films"
          component={Films}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          initialParams={{ dataService: swapiService }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
