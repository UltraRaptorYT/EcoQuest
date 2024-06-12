import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import supabase from "../utils/supabase";
import Post from "../components/Post";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";
import * as ImagePicker from "expo-image-picker";

type PostType = {
  id: number;
  img: string;
  caption: string;
  user_id: string;
  created_at: string;
};

const HomeScreen = () => {
  const userContext = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<PostType[]>();

  const [image, setImage] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState<string>();

  useEffect(() => {
    async function getPost() {
      const { data, error } = await supabase
        .from("ecoquest_post")
        .select()
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      }
      setPosts(data || []);
    }
    getPost();
  }, []);

  // Function to convert local URI to Blob
  async function uriToBlob(uri: string) {
    // Fetch the file
    const response = await fetch(uri);

    // Convert the response to a Blob
    const blob = await response.blob();

    return blob;
  }

  useEffect(() => {
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        const { uri, fileName } = result.assets[0];
        setImage(uri);
        let file = await uriToBlob(uri);
        console.log(uri);
        let filePath = `${String(new Date().getTime())}_${fileName}`;
        const { data, error } = await supabase.storage
          .from("ecoquest")
          .upload(filePath, file);
        if (error) {
          return console.log(error);
        }
        console.log(
          process.env.EXPO_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/ecoquest/" +
            data.path
        );
        setImage(
          process.env.EXPO_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/ecoquest/" +
            data.path
        );
      }
    };

    if (modalVisible) {
      pickImage();
    }
  }, [modalVisible]);

  useEffect(() => {
    console.log(userContext);
  }, []);

  async function createPost() {
    if (!image?.startsWith("data")) {
      return;
    }
    let file = await uriToBlob(image);

    let filePath = `${String(new Date().getTime())}_${"sad.jpeg"}`;
    const { data, error } = await supabase.storage
      .from("ecoquest")
      .upload(filePath, file);
    if (error) {
      return console.log(error);
    }

    console.log(image, data);
    console.log(userContext?.user);
    // supabase.from("ecoquest_post").insert({
    //   img:
    // });
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Pressable
          onPress={() => {
            setCaption("");
            setImage("");
            setModalVisible(true);
            // navigation.navigate("Quest");
            // navigation.navigate("CreatePost");
          }}
        >
          <FontAwesome name="plus-square-o" size={26} color="black" />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome name="times" size={16} color="#B0B0B0" />
            </Pressable>
            <Image source={{ uri: image }} style={styles.img} />
            <TextInput
              placeholder="Write a caption"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setCaption(text)}
              value={caption}
            ></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                createPost();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Post</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.postContainer}>
        {posts?.map((e, i) => {
          return <Post img={e.img} caption={e.caption} key={`Post${i}`}></Post>;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    marginTop: 22,
    maxWidth: 500,
    minWidth: 300,
    width: "100%",
  },
  postContainer: {
    width: "100%",
  },
  header: {
    display: "flex",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },

  // Modal
  centeredView: {
    flex: 1,
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    height: "100%",
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  img: {
    width: 200,
    aspectRatio: 1,
    height: 200,
    marginRight: "auto",
    marginLeft: "auto",
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  textInput: {
    width: "100%",
    padding: 10,
  },
});

export default HomeScreen;
