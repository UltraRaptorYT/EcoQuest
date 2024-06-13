import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import ProgressLine from "../components/ProgessLine";
import DottedLine from "../components/DottedLine";

function validatePassword(password: string) {
  // minimum 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  // check for mix of letters, numbers, and symbols
  let hasLetters = false;
  let hasNumbers = false;
  let hasSymbols = false;
  let letters = /[A-Za-z]/;
  let numbers = /[0-9]/;
  let symbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  for (let i = 0; i < password.length; i++) {
    if (password[i].match(letters)) {
      hasLetters = true;
    } else if (password[i].match(numbers)) {
      hasNumbers = true;
    } else if (password[i].match(symbols)) {
      hasSymbols = true;
    }
  }

  if (!hasLetters || !hasNumbers || !hasSymbols) {
    return {
      isValid: false,
      error: "Password must contain a mix of letters, numbers, and symbols",
    };
  }

  return {
    isValid: true,
    error: "",
  };
}

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    const passwordValidationResult = validatePassword(password);
    if (!passwordValidationResult.isValid) {
      setPasswordError(passwordValidationResult.error);
    } else {
      setPasswordError("");
    }
  });

  async function createUser(
    username: string,
    name: string,
    email: string,
    password: string
  ) {
    const response = await fetch(
      "https://e7eg0soi49.execute-api.ap-southeast-1.amazonaws.com/default/supabase_signup",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          name,
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
      throw new Error("Internal Server Error");
    }
    return data[0];
  }

  const onHandleSignUp = async () => {
    setError("");
    if (
      email.trim() !== "" &&
      password.trim() !== "" &&
      username.trim() !== "" &&
      name.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      isPasswordMatch &&
      error == ""
    ) {
      try {
        const userInfo = await createUser(username, name, email, password);
        userContext?.setUser(userInfo);
        navigation.navigate("BottomBar");
      } catch (error) {
        console.error((error as Error).message);
        if (
          error &&
          (error as Error).message &&
          (error as Error).message ==
            `duplicate key value violates unique constraint "ecoquest_user_email_key"`
        ) {
          setError("Email already exist");
        } else if (
          error &&
          (error as Error).message &&
          (error as Error).message ==
            `duplicate key value violates unique constraint "ecoquest_user_username_key"`
        ) {
          setError("Username already exist");
        } else {
          setError((error as Error).message);
        }
      }
    } else {
      setError("Fill up required fields");
    }
  };

  const calculatePasswordStrength = (password: string) => {
    // Minimum password length
    const MIN_LENGTH = 8;

    // Check if password length is less than 8
    if (password.length < MIN_LENGTH) {
      return 0.1;
    }

    // Check for mix of letters, numbers, and symbols
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLetters || !hasSymbols) {
      return 0.3;
    }

    if (!hasLetters || !hasNumbers || !hasSymbols) {
      return 0.7;
    }

    return 1;
  };

  const handlePasswordChange = (text: string) => {
    setError("");
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setError("");
    setConfirmPassword(text);
    setIsPasswordMatch(password === text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign Up</Text>
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
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Name</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="#f2f2f2"
            autoCapitalize="none"
            value={name}
            onChangeText={(text) => {
              setError("");
              setName(text);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Username</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="#f2f2f2"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setError("");
              setUsername(text.toLowerCase());
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Email Address</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setError("");
              setEmail(text);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Password</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            secureTextEntry={true}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={password}
            onChangeText={handlePasswordChange}
          />
        </View>

        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            secureTextEntry={true}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
        </View>
        <View style={styles.passwordLine}>
          <ProgressLine progress={passwordStrength} />
        </View>
        {passwordError !== "" && (
          <Text style={styles.errorMsg}>{passwordError}</Text>
        )}
        {error !== "" && <Text style={styles.errorMsg}>{error}</Text>}
        {!isPasswordMatch && (
          <Text style={styles.errorMsg}>Passwords do not match</Text>
        )}
        <Pressable
          style={[styles.button, styles.loginBtn]}
          onPress={onHandleSignUp}
        >
          <Text style={styles.buttonText}>Register</Text>
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
          <Text>Do you have already an account?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    height: "100%",
  },
  subhead: {
    color: "#696969",
    fontSize: 16,
  },
  formContainer: {
    padding: 30,
    gap: 25,
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#f2f2f2",
  },
  passwordLine: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 330,
    marginTop: 10,
    marginBottom: 10,
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
  line: {
    width: "200%",
    height: 0,
    transform: [{ rotate: "-16.5deg" }],
    position: "absolute",
    left: -20,
    bottom: 110,
  },
  link: { color: "#04b182", textDecorationLine: "underline" },
});
