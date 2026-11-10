import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import WifiDetailScreen from "../screens/WifiDetailScreen";
import AddWifiScreen from "../screens/AddWifiScreen";
import { Hotspot } from "../services/wifiService";

export type RootStackParamList = {
  Map: undefined;
  WifiDetail: { hotspot: Hotspot };
  AddWifi: { latitude: number; longitude: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#1E88E5" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="Map" component={MapScreen} options={{ title: "Xtom Wi-Fi Maps" }} />
        <Stack.Screen name="WifiDetail" component={WifiDetailScreen} options={{ title: "Taarifa za Mtandao" }} />
        <Stack.Screen name="AddWifi" component={AddWifiScreen} options={{ title: "Ongeza Wi-Fi" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
