import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import supabase from "../utils/supabase";

export default function MarketPlaceScreen() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [title, setTitle] = useState<string>();
  const [meetAt, setMeetAt] = useState<string>();
  const [recycledFrom, setRecycledFrom] = useState<string>();

  const [modalVisible, setModalVisible] = useState(false);

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

      if (!result.canceled) {
        const { uri, fileName } = result.assets[0];
        setImage(uri);
        let file = await uriToBlob(uri);
        let filePath = `${String(new Date().getTime())}_${fileName}`;
        const { data, error } = await supabase.storage
          .from("ecoquest")
          .upload(filePath, file);
        if (error) {
          return console.error(error);
        }
        setImage(
          process.env.EXPO_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/ecoquest/" +
            data.path
        );
      } else {
        pickImage();
      }
    };

    if (modalVisible) {
      pickImage();
    }
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Pressable
          onPress={() => {
            setDescription("");
            setImage("");
            setModalVisible(true);
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
            {image && <Image source={{ uri: image }} style={styles.img} />}
            <TextInput
              placeholder="Write a title"
              style={styles.textInput}
              onChangeText={(text) => setTitle(text)}
              value={title}
            ></TextInput>
            <TextInput
              placeholder="Write a description"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setDescription(text)}
              value={description}
            ></TextInput>
            <TextInput
              placeholder="Write a price"
              style={styles.textInput}
              onChangeText={(text) => setPrice(Number(text))}
              value={String(price)}
            ></TextInput>
            <TextInput
              placeholder="Write a meeting location"
              style={styles.textInput}
              onChangeText={(text) => setMeetAt(text)}
              value={meetAt}
            ></TextInput>
            <TextInput
              placeholder="Write a description"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setRecycledFrom(text)}
              value={recycledFrom}
            ></TextInput>
            <Pressable
              style={styles.button}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Post</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text>MarketPlacePage</Text>
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
  // Modal
  centeredView: {
    flex: 1,
  },
  modalView: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    paddingTop: 32,
    alignItems: "center",
    height: "100%",
    zIndex: 5,
    gap: 10,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  img: {
    width: 300,
    aspectRatio: 1,
    height: 300,
    marginRight: "auto",
    marginLeft: "auto",
    padding: 5,
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  textInput: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderWidth: 3,
    borderColor: "#696969",
    paddingHorizontal: 10,
  },
  activityIndicator: {
    height: 600,
    justifyContent: "center",
  },

  button: {
    width: "100%",
    borderRadius: 15,
    height: "auto",
  },
});
