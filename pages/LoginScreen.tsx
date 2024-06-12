import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import supabase from "../utils/supabase";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userContext = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [error, setError] = useState("");

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
    console.log(data);
    if (data.length == 0) {
      throw new Error("Account details are incorrect");
    }
    return data[0];
  }

  const onHandleLogin = async () => {
    setError("");
    if (email.trim() != "" && password.trim() != "") {
      try {
        const userInfo = await loginUser(email, password);
        console.log(userInfo);
        userContext?.setUser(userInfo);
        navigation.navigate("BottomBar");
      } catch (error) {
        setError((error as Error).message);
      }
    } else {
      setError("Email and Password cannot be blank");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
      <View style={{ alignItems: "center" }}>
        <Button title="Login" onPress={onHandleLogin}></Button>
        <Text style={{ marginTop: 30, marginBottom: 40 }}>
          Do you need an account?
        </Text>
        <Button
          title="SignUp"
          onPress={() => navigation.navigate("SignUp")}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginTop: 22,
    maxWidth: 500,
    minWidth: 300,
  },
  subhead: {
    color: "#6E548C",
  },
  inputItems: {},
  input: {},
  errorMsg: {
    color: "red",
    margin: 10,
    textAlign: "left",
    width: 330,
  },
});
