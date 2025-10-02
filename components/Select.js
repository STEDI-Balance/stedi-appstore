import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
export const Select = ({ options, value, onSelect, label, placeholder }) => {
  return (
    <Dropdown
      label={label}
      placeholder={placeholder}
      options={options}
      value={value}
      onSelect={onSelect}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
  },
});
