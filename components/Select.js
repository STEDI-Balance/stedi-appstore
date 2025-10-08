import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
export const Select = ({ options, value, onSelect, label, placeholder, error }) => {
  return (
    <Dropdown
      label={label}
      placeholder={placeholder}
      options={options}
      value={value}
      onSelect={onSelect}
      error={error}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
  },
});
