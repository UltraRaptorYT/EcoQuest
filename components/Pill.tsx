import { ReactNode } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export default function Pill({
  children,
  isSelected,
  onPress,
}: {
  children: ReactNode;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={() => onPress()}>
      <Text style={[styles.pill, isSelected ? styles.pillSelected : []]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#cfcfcf",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 100,
    marginRight: 10,
  },
  pillSelected: {
    backgroundColor: "#b0b0b0",
  }
});
