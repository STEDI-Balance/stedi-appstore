import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import { Button, HelperText } from "react-native-paper";
import React, { useState, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Select } from "../components/Select";
import { DatePicker } from "../components/DatePicker";
import { Collapsible } from "../components/Collapsible";
import { useNavigation } from "@react-navigation/native";
import { Slider } from "../components/Slider";
import { SecurityField } from "../components/SecurityField";

export default function SignUp() {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
    birthday: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    heightDec: 0,
    heightUnit: 0,
    weightDec: 0,
    weightUnit: 0,
    agreeAnonymous: false,
    agreeSMS: false,
    agreePrivacy: false,
    agreeTerms: false,
    agreeCookie: false,
  });
  const [unit, setUnit] = useState({
    height: "imperial",
    weight: "imperial",
  });

  const onChangeFormValue = (key, value) => setForm({ ...form, [key]: value });
  const onChangeUnit = (key, value) => setUnit({ ...unit, [key]: value });

  const onSubmit = useCallback(() => {});

  return (
    <SafeAreaView edges={["top"]} style={styles.allBody}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.backButton}
        >
          <FontAwesome5
            style={styles.backText}
            name="chevron-left"
            color="white"
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <FontAwesome5 style={styles.headerIcon} name="users" size={28} />
          <Text variant="labelLarge" style={styles.headerTitle}>
            Create Account
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Email */}
          <TextInput
            style={styles.input}
            label="* Email"
            mode="outlined"
            value={form.email}
            onChangeText={(text) => onChangeFormValue("email", text)}
          />

          <DatePicker
            label="* Birthday"
            value={form.birthday}
            onChange={(date) => onChangeFormValue("birthday", date)}
          />

          <TextInput
            placeholder="e.g 385-123-45-89"
            style={styles.phoneInput}
            label="* Phone Number"
            mode="outlined"
            value={form.phoneNumber}
            onChangeText={(text) => onChangeFormValue("phoneNumber", text)}
          />

          {/* Password */}
          <SecurityField
            label="* Password"
            value={form.password}
            onChangeText={(value) => onChangeFormValue("password", value)}
            placeholder
          />

          {/* Confirm Password */}
          <SecurityField
            value={form.confirmPassword}
            onChangeText={(value) =>
              onChangeFormValue("confirmPassword", value)
            }
            label="* Confirm Password"
          />
          <Select
            options={OPTIONS}
            value={form.gender}
            onSelect={(value) => onChangeFormValue("gender", value)}
            label="* Gender"
            placeholder="Select Gender"
          />
          <Collapsible open={form.agreeAnonymous}>
            {/* Height */}
            <View>
              <View style={styles.units.unityHeader}>
                <Text>Height</Text>
                <View style={styles.units.unityHeaderController}>
                  <TouchableOpacity
                    onPress={() => onChangeUnit("height", "imperial")}
                  >
                    <Text
                      style={{
                        fontWeight: unit.height === "imperial" ? "700" : "400",
                        textDecorationLine:
                          unit.height === "imperial" ? "underline" : "none",
                      }}
                    >
                      Ft
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onChangeUnit("height", "metric")}
                  >
                    <Text
                      style={{
                        fontWeight: unit.height === "metric" ? "700" : "400",
                        textDecorationLine:
                          unit.height === "metric" ? "underline" : "none",
                      }}
                    >
                      m
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.units.sliderContainer}>
                <View style={styles.units.slider}>
                  <View style={styles.units.sliderMinMax}>
                    <Text>{unit.height === "imperial" ? `0'` : `0 M`}</Text>
                    <Text>{unit.height === "imperial" ? `10'` : `2 M`}</Text>
                  </View>
                  <Slider
                    value={form.heightDec}
                    onSlidingComplete={(value) =>
                      onChangeFormValue("heightDec", value)
                    }
                    step={1}
                    min={0}
                    max={unit.height === "imperial" ? 10 : 2}
                  />
                  <Text style={{ alignSelf: "center" }}>{`${Number(
                    form.heightDec
                  ).toFixed(0)}${
                    unit.height === "imperial" ? "'" : " M"
                  }`}</Text>
                </View>
                <View style={styles.units.slider}>
                  <View style={styles.units.sliderMinMax}>
                    <Text>{unit.height === "imperial" ? `0"` : `0 cm`}</Text>
                    <Text>{unit.height === "imperial" ? `11"` : `99 cm`}</Text>
                  </View>
                  <Slider
                    value={form.heightUnit}
                    onSlidingComplete={(value) =>
                      onChangeFormValue("heightUnit", value)
                    }
                    step={1}
                    min={0}
                    max={unit.height === "imperial" ? 11 : 99}
                  />
                  <Text style={{ alignSelf: "center" }}>{`${Number(
                    form.heightUnit
                  ).toFixed(0)}${
                    unit.height === "imperial" ? '"' : " cm"
                  }`}</Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.units.unityHeader}>
                <Text>Weight</Text>
                <View style={styles.units.unityHeaderController}>
                  <TouchableOpacity
                    onPress={() => onChangeUnit("weight", "imperial")}
                  >
                    <Text
                      style={{
                        fontWeight: unit.weight === "imperial" ? "700" : "400",
                        textDecorationLine:
                          unit.weight === "imperial" ? "underline" : "none",
                      }}
                    >
                      lbs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onChangeUnit("weight", "metric")}
                  >
                    <Text
                      style={{
                        fontWeight: unit.weight === "metric" ? "700" : "400",
                        textDecorationLine:
                          unit.weight === "metric" ? "underline" : "none",
                      }}
                    >
                      kg
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.units.sliderContainer}>
                <View style={styles.units.slider}>
                  <View style={styles.units.sliderMinMax}>
                    <Text>{unit.weight === "imperial" ? `0 lbs` : `0 kg`}</Text>
                    <Text>
                      {unit.weight === "imperial" ? `300 lbs` : `136 kg`}
                    </Text>
                  </View>
                  <Slider
                    value={form.weightDec}
                    onSlidingComplete={(value) =>
                      onChangeFormValue("weightDec", value)
                    }
                    step={1}
                    min={0}
                    max={unit.weight === "imperial" ? 300 : 136}
                  />
                  <Text style={{ alignSelf: "center" }}>{`${Number(
                    form.weightDec
                  ).toFixed(0)} ${
                    unit.weight === "imperial" ? "lbs" : "kg"
                  }`}</Text>
                </View>
                <View style={styles.units.slider}>
                  <View style={styles.units.sliderMinMax}>
                    <Text>{unit.weight === "imperial" ? `0 oz` : `0 g`}</Text>
                    <Text>
                      {unit.weight === "imperial" ? `15 oz` : `999 g`}
                    </Text>
                  </View>
                  <Slider
                    value={form.weightUnit}
                    onSlidingComplete={(value) =>
                      onChangeFormValue("weightUnit", value)
                    }
                    step={1}
                    min={0}
                    max={unit.weight === "imperial" ? 15 : 999}
                  />
                  <Text style={{ alignSelf: "center" }}>{`${Number(
                    form.weightUnit
                  ).toFixed(0)} ${
                    unit.weight === "imperial" ? "oz" : "g"
                  }`}</Text>
                </View>
              </View>
            </View>
          </Collapsible>
          {/* Check box one */}
          <View style={styles.checkboxContainer}>
            <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
              <Checkbox
                status={form.agreeAnonymous ? "checked" : "unchecked"}
                onPress={() => {
                  setForm({ ...form, agreeAnonymous: !form.agreeAnonymous });
                }}
              />
            </View>
            <Text style={styles.checkboxText}>
              Agree to share my anonymous data (optional)
            </Text>
          </View>

          {/* Check box two */}
          <View style={styles.checkboxContainer}>
            <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
              <Checkbox
                style={styles.checkbox}
                status={form.agreeSMS ? "checked" : "unchecked"}
                onPress={() => {
                  setForm({ ...form, agreeSMS: !form.agreeSMS });
                }}
              />
            </View>
            <Text style={styles.checkboxText}>
              I consent to receiving text messages at the cell number I provided
              (mandatory, must allow STOP opt-out)
            </Text>
          </View>
          {/* Check box three */}
          <View style={styles.checkboxContainer}>
            <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
              <Checkbox
                style={styles.checkbox}
                status={form.agreePrivacy ? "checked" : "unchecked"}
                onPress={() => {
                  setForm({ ...form, agreePrivacy: !form.agreePrivacy });
                }}
              />
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the Privacy Policy (mandatory)
            </Text>
          </View>
          {/* Check box four */}
          <View style={styles.checkboxContainer}>
            <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
              <Checkbox
                style={styles.checkbox}
                status={form.agreeTerms ? "checked" : "unchecked"}
                onPress={() => {
                  setForm({ ...form, agreeTerms: !form.agreeTerms });
                }}
              />
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the Terms of Use Policy (mandatory)
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
              <Checkbox
                style={styles.checkbox}
                status={form.agreeCookie ? "checked" : "unchecked"}
                onPress={() => {
                  setForm({ ...form, agreeCookie: !form.agreeCookie });
                }}
              />
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the Cookie Policy (mandatory)
            </Text>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Sign Up Button */}
          <Button
            mode="contained"
            onPress={() => console.log("Pressed")}
            style={{ ...styles.signUpButton, marginBottom: bottom }}
          >
            Sign Up
          </Button>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allBody: {
    backgroundColor: "#A0CE4E",
    height: "100%",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    height: "100%",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backText: {
    color: "white",
    fontWeight: "800",
    marginVertical: "auto",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  headerTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "white",
    fontWeight: "800",
  },
  headerIcon: {
    fontSize: 18,
    color: "white",
  },
  formContainer: {
    gap: 16, // Equal spacing between all child elements
    paddingVertical: 20,
  },
  input: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
  },

  phoneInput: {
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    backgroundColor: "#F6F6F6",
    borderRadius: "100%",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    marginTop: 2,
  },
  //break the text if it's too long
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    fontStyle: "italic",
    marginVertical: "auto",
  },
  spacer: {
    height: 20, // Add some extra space before the button
  },
  units: {
    unityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    unityHeaderController: {
      marginTop: 20,
      flexDirection: "row",
      gap: 20,
    },
    slider: {
      flex: 1,
    },
    sliderContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    sliderMinMax: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
  signUpButton: {
    marginBottom: 30,
  },
});

const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
