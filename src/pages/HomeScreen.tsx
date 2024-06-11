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
import React, { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import Post from "../components/Post";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";

import * as ImagePicker from "expo-image-picker";

type PostType = {
  id: number;
  img: string;
  caption: string;
  user_id: string;
  created_at: string;
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<PostType[]>();

  const [image, setImage] = useState<string | undefined>(undefined);

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

  async function createPost() {
    if (image?.startsWith("data")) {
      let file = await uriToBlob(image);

      let filePath = `${String(new Date().getTime())}_${"sad.jpeg"}`;
      const { data, error } = await supabase.storage
        .from("ecoquest")
        .upload(filePath, file);
      if (error) {
        return console.log(error);
      }
    }
    console.log(image);
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Pressable
          onPress={() => {
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
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome name="times" size={24} color="black" />
            </Pressable>
            <Image source={{ uri: image }} style={styles.img} />
            <TextInput placeholder="Write a caption"></TextInput>
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
    flex: 1,
    display: "flex",
    marginTop: 22,
    maxWidth: 500,
    minWidth: 300,
  },
  postContainer: {},
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
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    width: "100%",
    height: 100,
  },
});

export default HomeScreen;