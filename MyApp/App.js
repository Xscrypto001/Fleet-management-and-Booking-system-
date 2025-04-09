import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CarDetailScreen from "./screens/Ticket";
import Nav from "./screens/auth";
import BookingHistoryScreen from "./screens/Booking";
import HomeScreen from "./screens/Home";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Tickets" component={CarDetailScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Booking" component={BookingHistoryScreen} />
        <Tab.Screen name="Auth" component={Nav} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
