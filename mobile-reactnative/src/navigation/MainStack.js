import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GlobalContextProvider, {
  useGlobalContext,
} from "../store/contexts/GlobalContext";
import Login from "../screens/Login/Login";
import LoginInput from "../screens/Login/LoginInput";
import RegisterInput from "../screens/Register/RegisterInput";
import LoadingScreen from "../screens/Loading/LoadingScreen";
import TabBar from "./TabBar";
import ForgotPassword from "../screens/Login/ForgotPassword";
import RegisterVerify from "../screens/Register/RegisterVerify";
import RegisterPhoneInput from "../screens/Register/RegisterPhoneInput";
import ForgotPasswordPhoneInput from "../screens/Login/ForgotPasswordPhoneInput";

const Stack = createStackNavigator();

const MainStack = () => {
  const { isLoading, token } = useGlobalContext();

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#0091ff",
        },
      }}
    >
      {token == null ? (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LoginInput"
            component={LoginInput}
            options={{
              title: "Đăng nhập",
            }}
          />
          <Stack.Screen
            name="RegisterInput"
            component={RegisterInput}
            options={{
              title: "Đăng kí",
            }}
          />
          <Stack.Screen
            name="RegisterVerify"
            component={RegisterVerify}
            options={{
              title: "Xác thực số điện thoại",
            }}
          />

          <Stack.Screen
            name="RegisterPhoneInput"
            component={RegisterPhoneInput}
            options={{
              title: "Đăng kí",
            }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              title: "Lấy lại mật khẩu",
            }}
          />
          <Stack.Screen
            name="ForgotPasswordPhoneInput"
            component={ForgotPasswordPhoneInput}
            options={{
              title: "Lấy lại mật khẩu",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="TabBar"
            component={TabBar}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
