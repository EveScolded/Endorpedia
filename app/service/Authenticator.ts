import * as SecureStore from "expo-secure-store";

export class Authenticator {
  public getToken = async (): Promise<string> => {
    const token = await SecureStore.getItemAsync("secure_token");
    return Promise.resolve(token);
  };

  public setToken() {
    SecureStore.setItemAsync("secure_token", "gdaa23jjhk32lja");
  }
}
