import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { customTheme } from "../utils/Constants";

export const Select = ({ options, value, onSelect, label, placeholder, error }) => {
  // Create a custom theme specifically for the dropdown to ensure green colors
  const dropdownTheme = {
    ...customTheme,
    colors: {
      ...customTheme.colors,
      primary: customTheme.colors.primary, // #A0CE4E
      outline: customTheme.colors.outline, // #A0CE4E
      surface: "#FFFFFF", // Force white background
      surfaceVariant: "#FFFFFF", // Force white surface variant
      background: "#FFFFFF", // Force white background
    }
  };

  return (
    <Dropdown
      label={label}
      placeholder={placeholder}
      options={options}
      value={value}
      onSelect={onSelect}
      error={error}
      theme={dropdownTheme}
      mode="outlined"
      style={styles.dropdown}
      contentStyle={styles.dropdownContent}
      menuContentStyle={styles.menuContent}
      inputStyle={styles.inputStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    borderRadius: 10,
    borderColor: customTheme.colors.outline, // Green border
    backgroundColor: "#FFFFFF", // Force white background
  },
  dropdownContent: {
    backgroundColor: "#FFFFFF", // Force white background for dropdown content
  },
  menuContent: {
    backgroundColor: "#FFFFFF", // Force white dropdown menu background
    borderRadius: 10,
    borderWidth: 1,
    borderColor: customTheme.colors.outline, // Green border for menu
  },
  inputStyle: {
    backgroundColor: "#FFFFFF", // Force white input background
    color: customTheme.colors.onSurface, // Dark text
  },
});
