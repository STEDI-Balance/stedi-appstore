import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";



export function DatePicker({ label, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      onChange(params.date);
    },
    [setOpen, onChange]
  );

  return (
    <>
      <TextInput
        onPressIn={() => setOpen(true)}
        placeholder={placeholder}
        style={styles.phoneInput}
        label={label}
        mode="outlined"
        value={dateToString(value)}
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setOpen(true)}
          />
        }
      />

      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={value}
        onConfirm={onConfirmSingle}
      />
    </>
  );
}

const dateToString = (date) => {
  if (!date) return "";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
