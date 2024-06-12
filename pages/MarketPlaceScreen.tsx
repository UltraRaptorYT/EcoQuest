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

export default function MarketPlaceScreen() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState<string>();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Pressable
          onPress={() => {
            setCaption("");
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
                // createPost();
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
    color: "#f2f2f2",
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
