import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export class Authenticator {
  public getToken = async (): Promise<string> => {
    let token: string;
    if (Platform.OS === "web") {
      token = localStorage.getItem("secure_token");
    } else {
      token = await SecureStore.getItemAsync("secure_token");
    }
    return Promise.resolve(token);
  };

  public setToken(login: string, password: string) {
    if (login === "Wooo" && password === "kiee") {
      const token = "gdaa23jjhk32lja";
      if (Platform.OS === "web") {
        localStorage.setItem("secure_token", token);
      } else {
        SecureStore.setItemAsync("secure_token", token);
      }
      return token;
    }
    throw "Invalid login or password";
  }
}
