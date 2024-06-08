import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";

import outputs from "./amplify_outputs.json";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import HomeScreen from "./src/pages/HomeScreen";
import MarketPlaceScreen from "./src/pages/MarketPlaceScreen";
import QuestScreen from "./src/pages/QuestScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import RecycleScreen from "./src/pages/RecycleScreen";

Amplify.configure(outputs);

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {

                let routeIcons = {
                  "Home": "home",
                  "MarketPlace": "shopping-cart",
                  "Recycle": "recycle",
                  "Quest": "leaf",
                  "Profile": "user"
                }
                let iconName = routeIcons[route.name]

                return <FontAwesome name={iconName} size={size + 4} color={color} />;
              },
              tabBarActiveTintColor: '#48742C',
              tabBarInactiveTintColor: '#ccc',
              headerShown: false,
              tabBarLabel: () => null,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Quest" component={QuestScreen} />
            <Tab.Screen name="Recycle" component={RecycleScreen} />
            <Tab.Screen name="MarketPlace" component={MarketPlaceScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
