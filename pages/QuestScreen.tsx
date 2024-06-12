import { View, Text, StyleSheet, ScrollView } from "react-native";
import supabase from "../utils/supabase";
import { useEffect, useState } from "react";

export type TaskType = {
  id: number;
  title: string;
  description: string;
  points: number;
};

export default function QuestScreen() {
  const [tasks, setTasks] = useState<TaskType[]>();
  const taskTypeMap = {
    Recycling: "red",
    "DIY Projects": "blue",
    Community: "pink",
    Others: "green",
  };
  useEffect(() => {
    async function getTasks() {
      const { data, error } = await supabase.from("ecoquest_tasks").select();

      if (error) {
        console.error(error);
        return;
      }

      setTasks(data || []);
    }
    getTasks();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
      </View>
      <ScrollView></ScrollView>
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
});
