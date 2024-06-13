import { Pressable, StyleSheet, Text, View } from "react-native";
import { TaskType } from "../pages/QuestScreen";
import supabase from "../utils/supabase";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Toast from "react-native-toast-message";

export default function Task({
  task,
  rerun,
}: {
  task: TaskType;
  rerun: () => void;
}) {
  const userContext = useContext(UserContext);
  const taskTypeMap: { [key: string]: string } = {
    Recycling: "#FFC4C4",
    "DIY Projects": "#FFF5C5",
    Community: "#A5EDD9",
    Others: "#90e0ef",
  };

  async function updateTasks() {
    const { error } = await supabase.from("ecoquest_user_tasks").insert({
      user_id: userContext?.user.id,
      task_id: task.id,
    });
    if (error) {
      console.error(error);
      return;
    }
    Toast.show({
      type: "success",
      text1: `Gained +${task.points}`,
      visibilityTime: 1000,
    });
    rerun();
  }

  return (
    <Pressable
      onPress={() => updateTasks()}
      style={[
        styles.taskContainer,
        { backgroundColor: taskTypeMap[task.type] },
      ]}
    >
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.flex}>
        <Text style={styles.type}>Type: {task.type}</Text>
        <Text style={styles.points}>+ {task.points}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 3,
    width: "100%",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  type: { fontSize: 16 },
  points: {
    fontSize: 20,
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
});
