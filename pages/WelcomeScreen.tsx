import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { RootStackParamList } from "../utils/types";
import React from "react";
import DottedLine from "../components/DottedLine";

type WelcomeScreenProps = StackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>EcoQuest</Text>
        <View style={styles.titleContainerBefore}></View>
        <View style={styles.line}>
          <DottedLine
            length={600}
            dotSize={7.5}
            dotSpacing={5}
            dotColor="black"
          />
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/EcoQuest.png")}
            style={styles.icon}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.loginBtn]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.signUpBtn]}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
  },
  button: {
    borderWidth: 3,
    borderColor: "black",
    fontWeight: "bold",
    padding: 10,
    borderRadius: 9999,
    width: 200,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: "#f2f2f2",
    marginTop: "auto",
    marginBottom: 100,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    alignItems: "center",
  },
  loginBtn: {
    backgroundColor: "#95D5B2",
  },
  signUpBtn: {
    backgroundColor: "#D8F3DC",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#f2f2f2",
  },
  titleContainer: {
    backgroundColor: "#1DD1A1",
    paddingTop: 100,
    paddingBottom: 225,
    position: "relative",
  },
  titleContainerBefore: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 150, // Height of the triangle
    borderTopColor: "transparent",
    borderRightWidth: 500, // Width of the triangle
    borderRightColor: "#f2f2f2", // Color of the triangle
    borderStyle: "solid", // Style of the border
    backgroundColor: "transparent", // Set the background color to transparent
  },
  iconContainer: {
    display: "flex",
    position: "absolute",
    bottom: -135,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    width: 150,
    height: 150,
  },
  line: {
    width: "200%",
    height: 0,
    // borderColor: "black",
    // borderWidth: 7.5,
    // borderStyle: "dotted",
    transform: [{ rotate: "-16.5deg" }],
    position: "absolute",
    left: -20,
    bottom: 110,
  },
});

export default WelcomeScreen;
