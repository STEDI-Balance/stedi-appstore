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
  const [errors, setErrors] = useState({});

  const onChangeFormValue = (key, value) => {
    setForm({ ...form, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };
  const onChangeUnit = (key, value) => setUnit({ ...unit, [key]: value });

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Birthday validation
    if (!form.birthday) {
      newErrors.birthday = "Birthday is required";
    }

    // Phone number validation
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{3}-\d{3}-\d{2}-\d{2}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (e.g. 385-123-45-89)";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Gender validation
    if (!form.gender) {
      newErrors.gender = "Gender is required";
    }

    // Height and weight validation (if agree to share anonymous data is checked)
    if (form.agreeAnonymous) {
      if (form.heightDec === 0) {
        newErrors.heightDec = "Height is required when sharing anonymous data";
      }
      if (form.weightDec === 0) {
        newErrors.weightDec = "Weight is required when sharing anonymous data";
      }
    }

    // Mandatory agreements validation
    if (!form.agreeSMS) {
      newErrors.agreeSMS = "SMS consent is mandatory";
    }
    if (!form.agreePrivacy) {
      newErrors.agreePrivacy = "Privacy Policy agreement is mandatory";
    }
    if (!form.agreeTerms) {
      newErrors.agreeTerms = "Terms of Use agreement is mandatory";
    }
    if (!form.agreeCookie) {
      newErrors.agreeCookie = "Cookie Policy agreement is mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = useCallback(() => {
    if (validateForm()) {
      console.log("Form is valid, proceeding with submission");
      // Handle form submission here
    } else {
      console.log("Form has errors");
    }
  }, [form]);

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
          <View>
            <TextInput
              style={styles.input}
              label="* Email"
              mode="outlined"
              value={form.email}
              onChangeText={(text) => onChangeFormValue("email", text)}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          </View>

          <View>
            <DatePicker
              label="* Birthday"
              value={form.birthday}
              onChange={(date) => onChangeFormValue("birthday", date)}
              error={!!errors.birthday}
            />
            <HelperText type="error" visible={!!errors.birthday}>
              {errors.birthday}
            </HelperText>
          </View>

          <View>
            <TextInput
              placeholder="e.g 385-123-45-89"
              style={styles.phoneInput}
              label="* Phone Number"
              mode="outlined"
              value={form.phoneNumber}
              onChangeText={(text) => onChangeFormValue("phoneNumber", text)}
              error={!!errors.phoneNumber}
            />
            <HelperText type="error" visible={!!errors.phoneNumber}>
              {errors.phoneNumber}
            </HelperText>
          </View>

          {/* Password */}
          <View>
            <SecurityField
              label="* Password"
              value={form.password}
              onChangeText={(value) => onChangeFormValue("password", value)}
              placeholder
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          </View>

          {/* Confirm Password */}
          <View>
            <SecurityField
              value={form.confirmPassword}
              onChangeText={(value) =>
                onChangeFormValue("confirmPassword", value)
              }
              label="* Confirm Password"
              error={!!errors.confirmPassword}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          </View>
          <View>
            <Select
              options={OPTIONS}
              value={form.gender}
              onSelect={(value) => onChangeFormValue("gender", value)}
              label="* Gender"
              placeholder="Select Gender"
              error={!!errors.gender}
            />
            <HelperText type="error" visible={!!errors.gender}>
              {errors.gender}
            </HelperText>
          </View>
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
              <HelperText type="error" visible={!!errors.heightDec}>
                {errors.heightDec}
              </HelperText>
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
              <HelperText type="error" visible={!!errors.weightDec}>
                {errors.weightDec}
              </HelperText>
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
          <View>
            <View style={styles.checkboxContainer}>
              <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
                <Checkbox
                  style={styles.checkbox}
                  status={form.agreeSMS ? "checked" : "unchecked"}
                  onPress={() => {
                    onChangeFormValue("agreeSMS", !form.agreeSMS);
                  }}
                />
              </View>
              <Text style={styles.checkboxText}>
                I consent to receiving text messages at the cell number I
                provided (mandatory, must allow STOP opt-out)
              </Text>
            </View>
            <HelperText type="error" visible={!!errors.agreeSMS}>
              {errors.agreeSMS}
            </HelperText>
          </View>
          {/* Check box three */}
          <View>
            <View style={styles.checkboxContainer}>
              <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
                <Checkbox
                  style={styles.checkbox}
                  status={form.agreePrivacy ? "checked" : "unchecked"}
                  onPress={() => {
                    onChangeFormValue("agreePrivacy", !form.agreePrivacy);
                  }}
                />
              </View>
              <Text style={styles.checkboxText}>
                I have read and agree to the Privacy Policy (mandatory)
              </Text>
            </View>
            <HelperText type="error" visible={!!errors.agreePrivacy}>
              {errors.agreePrivacy}
            </HelperText>
          </View>
          {/* Check box four */}
          <View>
            <View style={styles.checkboxContainer}>
              <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
                <Checkbox
                  style={styles.checkbox}
                  status={form.agreeTerms ? "checked" : "unchecked"}
                  onPress={() => {
                    onChangeFormValue("agreeTerms", !form.agreeTerms);
                  }}
                />
              </View>
              <Text style={styles.checkboxText}>
                I have read and agree to the Terms of Use Policy (mandatory)
              </Text>
            </View>
            <HelperText type="error" visible={!!errors.agreeTerms}>
              {errors.agreeTerms}
            </HelperText>
          </View>
          <View>
            <View style={styles.checkboxContainer}>
              <View style={Platform.OS === "ios" ? styles.checkbox : {}}>
                <Checkbox
                  style={styles.checkbox}
                  status={form.agreeCookie ? "checked" : "unchecked"}
                  onPress={() => {
                    onChangeFormValue("agreeCookie", !form.agreeCookie);
                  }}
                />
              </View>
              <Text style={styles.checkboxText}>
                I have read and agree to the Cookie Policy (mandatory)
              </Text>
            </View>
            <HelperText type="error" visible={!!errors.agreeCookie}>
              {errors.agreeCookie}
            </HelperText>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Sign Up Button */}
          <Button
            mode="contained"
            onPress={onSubmit}
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
    gap: 4, // Equal spacing between all child elements
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
