import { useContext } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";

export default function ProfileScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userContext = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.hi}>Hi {userContext?.user.name}!</Text>
        <Pressable
          style={[styles.button, styles.loginBtn]}
          onPress={() => {
            navigation.navigate("Welcome");
          }}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
  },
  header: {
    display: "flex",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    borderWidth: 3,
    borderColor: "black",
    fontWeight: "bold",
    padding: 10,
    borderRadius: 9999,
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  loginBtn: {
    backgroundColor: "#95D5B2",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  contentContainer: {
    padding: 15,
  },
  hi: {
    fontSize: 18,
  },
});
