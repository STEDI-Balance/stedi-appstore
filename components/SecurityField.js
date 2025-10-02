import React, { useState} from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export const SecurityField = ({
  value,
  onChangeText,
  label,
  showContent = false,
  styles,
  error,
}) => {
    const [show, setShow] = useState(showContent);
    const toggleShowContent = (field) => 
      setShow(!show);
    
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles || inputStyles.input}
      label={label}
      mode="outlined"
      secureTextEntry={!show}
      error={error}
      right={
        <TextInput.Icon
          onPress={() => toggleShowContent("confirmPassword")}
          icon={show ? "eye-off" : "eye"}
        />
      }
    />
  );
};

const inputStyles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
