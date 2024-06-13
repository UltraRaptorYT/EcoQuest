import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import DottedLine from "../components/DottedLine";

export default function LoginScreen() {
  const [email, setEmail] = useState("ultraraptorpai@gmail.com");
  const [password, setPassword] = useState("Tip2Tip<3MoEnjoyers");
  const userContext = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function loginUser(email: string, password: string) {
    const response = await fetch(
      "https://2u3djprsej.execute-api.ap-southeast-1.amazonaws.com/default/supabase_login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    const data = await response.json();
    if (data && "error" in data) {
      throw new Error(data.error);
    }
    if (data.length == 0) {
      throw new Error("Account details are incorrect");
    }
    return data[0];
  }

  const onHandleLogin = async () => {
    if (processing) {
      return;
    }
    setProcessing(true);
    setError("");
    if (email.trim() != "" && password.trim() != "") {
      try {
        const userInfo = await loginUser(email, password);
        userContext?.setUser(userInfo);
        navigation.navigate("BottomBar");
      } catch (error) {
        setError((error as Error).message);
      }
    } else {
      setError("Email and Password cannot be blank");
    }
    setProcessing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.titleContainerBefore}></View>
        <View style={styles.line}>
          <DottedLine
            length={600}
            dotSize={7.5}
            dotSpacing={5}
            dotColor="black"
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Email Address</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholderTextColor="black"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Password</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error !== "" && <Text style={styles.errorMsg}>{error}</Text>}
        <Pressable
          style={[styles.button, styles.loginBtn]}
          onPress={onHandleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Text>Do you need an account?</Text>
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  link: { color: "#04b182", textDecorationLine: "underline" },
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
    height: "100%",
  },
  subhead: {
    color: "#696969",
    fontSize: 16,
  },
  inputItems: { gap: 10 },
  input: {
    borderWidth: 3.5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,
    borderRadius: 999,
  },
  errorMsg: {
    color: "red",
    margin: 10,
    textAlign: "left",
    width: 330,
  },
  login: {},
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#f2f2f2",
  },
  titleContainer: {
    backgroundColor: "#1DD1A1",
    paddingTop: 50,
    paddingBottom: 125,
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
  line: {
    width: "200%",
    height: 0,
    transform: [{ rotate: "-16.5deg" }],
    position: "absolute",
    left: -20,
    bottom: 110,
  },
  formContainer: {
    padding: 30,
    gap: 25,
    height: "100%",
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
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  loginBtn: {
    backgroundColor: "#95D5B2",
  },
});
