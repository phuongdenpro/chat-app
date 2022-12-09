import AsyncStorage from "@react-native-async-storage/async-storage";
const TOKEN__KEY = "TOKEN__KEY";

class Store {
  async getToken() {
    try {
      let value = await AsyncStorage.getItem(TOKEN__KEY);
      return value;
    } catch (error) {
      return value;
    }
  }

  async setToken(tokenValue) {
    try {
      let value = await AsyncStorage.setItem(TOKEN__KEY, tokenValue);
      return value;
    } catch (err) {
      return value;
    }
  }

  removeToken() {
    AsyncStorage.removeItem(TOKEN__KEY);
  }
}

const store = new Store();

export default store;
