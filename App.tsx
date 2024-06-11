import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FontAwesomeIconName } from "./src/utils/types";
import { RootStackParamList } from "./src/utils/types";

import WelcomeScreen from "./src/pages/WelcomeScreen";
import HomeScreen from "./src/pages/HomeScreen";
import MarketPlaceScreen from "./src/pages/MarketPlaceScreen";
import QuestScreen from "./src/pages/QuestScreen";
import ProfileScreen from "./src/pages/ProfileScreen";
import RecycleScreen from "./src/pages/RecycleScreen";
import CreatePostScreen from "./src/pages/Post/CreatePostScreen";

import { UserProvider } from "./src/context/UserContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let routeIcons: { [key: string]: FontAwesomeIconName } = {
            Home: "home",
            MarketPlace: "shopping-cart",
            Recycle: "recycle",
            Quest: "leaf",
            Profile: "user",
          };
          let iconName = routeIcons[route.name];

          return <FontAwesome name={iconName} size={size + 4} color={color} />;
        },
        tabBarActiveTintColor: "#48742C",
        tabBarInactiveTintColor: "#ccc",
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
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="BottomBar" component={TabNavigator} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
