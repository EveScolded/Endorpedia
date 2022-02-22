import React from "react";
import StartScreen from "./app/screens/StartScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import People from "./app/screens/People";
import People2 from "./app/screens/People2";
import Details from "./app/screens/Details";
import { SwapiService } from "./app/service/SwapiService";
import { CacheService } from "./app/service/CacheService";
import Autenthication from "./app/screens/Authentication";
import colors from "./app/config/colors";
import Films from "./app/screens/Films";
import Starships from "./app/screens/Starships";
import Vehicles from "./app/screens/Vehicles";
import Species from "./app/screens/Species";
import Planets from "./app/screens/Planets";

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
          component={People2}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Films"
          component={Films}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Starships"
          component={Starships}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Vehicles"
          component={Vehicles}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Species"
          component={Species}
          initialParams={{ dataService: swapiService }}
        />
        <Stack.Screen
          name="Planets"
          component={Planets}
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
