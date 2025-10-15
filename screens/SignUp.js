import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
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
import { countries } from "../utils/Constants";

export default function SignUp() {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    birthday: "",
    countryCode: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    heightCm: 0,
    weightKg: 0,
    agreeAnonymous: false,
    agreeSMS: false,
    agreePrivacy: false,
    agreeTerms: false,
    agreeCookie: false,
  });

  //Current unit type, imperial or metric
  const [unit, setUnit] = useState({
    heightAndWeight: "imperial"
  });

  //Opposite of current unit type, imperial or metric
  function oppositOfImperialOrMetric(currentUnit) {
    return currentUnit === "imperial" ? "metric" : "imperial";
  };
  
  //Handel press of switch unit button
  const handelSwitchUnitButtonPress = () => {
    setUnit(prev => ({
      ...prev,
      heightAndWeight: oppositOfImperialOrMetric(prev.heightAndWeight)
    }));
  };

  //Height or weight, as imperial or metric
  function heightOrWeightInCurrentUnit(currentUnit, weightOrHeight, value) {
    //Return weight or height
    if (weightOrHeight === "height") {
      //Return height
      if (currentUnit === "imperial") {
        //Return height in feet and inches
        let feet = Math.floor((value / 100) * 3.28);
        let inches = Math.floor(((value / 100) * 3.28) % 12);
        return `${feet}'${inches}"`;
      } else {
        //Return height in meters and centameters
        let centameters = value % 100;
        let meters = Math.floor(value / 100);
        return `${meters}M, ${centameters}CM`;
      }
    } else {
      //Return weight
      if (currentUnit === "imperial") {
        //Return weight in pounds
        return `${Math.floor(value * 2.2)}LBs`;
      } else {
        //Return weight in kilograms
        return `${value}KG`;
      }
    }
  }

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

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

    // Country code validation
    if (!form.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
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
      if (form.heightCm === 0) {
        newErrors.heightCm = "Height is required when sharing anonymous data";
      }
      if (form.weightKg === 0) {
        newErrors.weightKg = "Weight is required when sharing anonymous data";
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

  const createUser = async () => {
    try {
      // Get the country phone number from the country code
      const selectedCountry = countries.find(c => c.code === form.countryCode);
      const countryNumber = selectedCountry?.number || '';
      
      
      // Format birthday to YYYY-MM-DD format
      const formattedBirthday = form.birthday 
        ? new Date(form.birthday).toISOString().split('T')[0]
        : '';

      const currentTimestamp = new Date().getTime();

      const formattedPhone = form.phoneNumber.replace(/\D+/g, "")

      const userData = {
        userName: form.email,
        email: form.email,
        password: form.password,
        phone: formattedPhone,
        birthDate: formattedBirthday,
        verifyPassword: form.confirmPassword,
        agreedToTermsOfUseDate: currentTimestamp,
        agreedToCookiePolicyDate: currentTimestamp,
        agreedToPrivacyPolicyDate: currentTimestamp,
        agreedToTextMessageDate: currentTimestamp,
        region: selectedCountry?.code || '',
        whatsAppPhone: formattedPhone
      };

      const response = await fetch('https://dev.stedi.me/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email or cell # has already been previously registered");
        } else {
          throw new Error("Error creating account. Please confirm password is at least 6 characters, has an upper case letter, a lower case letter, a number, and a symbol.");
        }
      }

      // The response text is the login token
      return responseText;
    } catch (error) {
      throw error;
    }
  };

  const createCustomer = async (loginToken) => {
    try {
      // Get the country code name for region
      const selectedCountry = countries.find(c => c.code === form.countryCode);
      const region = selectedCountry?.code || '';
      
      // Format phone number
      const cleanPhoneNumber = form.phoneNumber.replace(/\D+/g, "");
      const fullPhone = cleanPhoneNumber;
      
      // Format birthday to YYYY-MM-DD format
      const formattedBirthday = form.birthday 
        ? new Date(form.birthday).toISOString().split('T')[0]
        : '';

      const customerData = {
        customerName: form.name.trim(), // Use the name from the form
        email: form.email,
        heightCm: form.heightCm, //New
        phone: fullPhone,
        weightKg: form.weightKg, //New
        whatsAppPhone: fullPhone,
        birthDay: formattedBirthday,
        region: region,
        gender: form.gender || "Male",
      };

      const response = await fetch('https://dev.stedi.me/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'suresteps.session.token': loginToken,
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email or cell # has already been previously registered");
        } else {
          throw new Error("Error creating account. Please confirm information is correct.");
        }
      }

      const responseText = await response.text();
      return responseText;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = useCallback(async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // First create the user
        const loginToken = await createUser();
        
        // Then create the customer with the login token
        await createCustomer(loginToken);
        
        // Success - show alert and navigate to login
        Alert.alert(
          "Success",
          "Successfully created user, please login to get started.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login")
            }
          ]
        );
      } catch (error) {
        // Show error alert
        Alert.alert(
          "Error",
          error.message || "An error occurred while creating your account. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Form has errors");
      console.log({ errors });
    }
  }, [form, navigation]);

  console.log({errors})


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
              label="* Name"
              mode="outlined"
              value={form.name}
              onChangeText={(text) => onChangeFormValue("name", text)}
              error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          </View>
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
            <Select
              options={phoneCodes}
              value={form.countryCode}
              onSelect={(value) => onChangeFormValue('countryCode', value)}
              label="* Country Code"
              placeholder="Select Country Code"
              error={!!errors.countryCode}
            />
            <HelperText type="error" visible={!!errors.countryCode}>
              {errors.countryCode}
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
              options={genderOptions}
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

        {/* Height and Weight sliders, visable when agreed to share anonymous data */}
          <Collapsible open={form.agreeAnonymous}>
            {/* Metric or Imperial Button */}
            <Button onPress={handelSwitchUnitButtonPress}>
              <Text>Show units as {oppositOfImperialOrMetric(unit.heightAndWeight)}</Text>
            </Button>

            {/* Height Slider*/}
              <Text>Height: {heightOrWeightInCurrentUnit(unit.heightAndWeight, "height", form.heightCm)}</Text>
              <Slider
              value={form.heightCm} 
              step={1} 
              onSlidingComplete={(value) => 
              onChangeFormValue("heightCm", value)} 
              min={55}
              max={272}/>

            {/* Height Error */}
              <HelperText type="error" visible={!!errors.heightCm}>
                {errors.heightCm}
              </HelperText>
                
            {/* Weight Slider*/}
              <Text>Weight: {heightOrWeightInCurrentUnit(unit.heightAndWeight, "weight", form.weightKg)}</Text>
              <Slider
              value={form.weightKg} 
              step={1} 
              onSlidingComplete={(value) => 
              onChangeFormValue("weightKg", value)} 
              min={2}
              max={635}/>

            {/* Weight Error */}
              <HelperText type="error" visible={!!errors.weightKg}>
                {errors.weightKg}
              </HelperText>

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
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
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

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];


  const phoneCodes = countries?.map((country) => ({
    label: country.name,
    value: country.code,
  })) || [];
