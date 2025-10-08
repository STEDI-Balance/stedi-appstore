import React, { useEffect } from "react";//react is a javascript library for user interfaces
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// with react-navigation I can change screens from one component to another easily
import { useNavigation } from '@react-navigation/native';//this is another react hook

const Login = ({ loggedInState, loggedInStates, setLoggedInState }) => {
  const navigation = useNavigation();
  const [form, setForm] = React.useState({
    phoneNumber: "",
    oneTimePassword: "",
  });

  const onChangeFormValue = (key, value) => setForm({ ...form, [key]: value });

  const sendOTP = async () => {
    const loginResponse = await fetch(
      `https://dev.stedi.me/twofactorlogin/${form.phoneNumber}?region=US`,
      {
        method: "POST",
        headers: {
          "content-type": "application/text",
        },
      }
    );
    if (loginResponse.status == 200) {
      setLoggedInState(loggedInStates.LOGGING_IN);
    } else {
      Alert.alert(`Invalid phone number: ` + form.phoneNumber);
    }
  };

  const login = async () => {
    const loginResponse = await fetch("https://dev.stedi.me/twofactorlogin", {
      method: "POST",
      headers: {
        "content-type": "application/text",
      },
      body: JSON.stringify({
        phoneNumber: form.phoneNumber,
        oneTimePassword: form.oneTimePassword,
        region: "US",
      }),
    });
    if (loginResponse.status == 200) {
      //200 means the password was valid
      const sessionToken = await loginResponse.text();
      const userNameResponse = await fetch(
        "https://dev.stedi.me/validate/" + sessionToken
      );
      const userName = await userNameResponse.text();
      console.log("sessionToken in Login Button", sessionToken);
      await AsyncStorage.setItem("sessionToken", sessionToken); //local storage
      await AsyncStorage.setItem("userName", userName);
      //   setLoggedInState(loggedInStates.LOGGED_IN);
      navigation.replace("Navigation");
    } else {
      console.log("response status", loginResponse.status);
      Alert.alert("Invalid", "Invalid Login information");
      setLoggedInState(loggedInStates.NOT_LOGGED_IN);
    }
  };

  useEffect(() => {
    if (loggedInState == loggedInStates.LOGGED_IN) {
      navigation.replace("Navigation");
    }
  });

  if (loggedInState == loggedInStates.NOT_LOGGED_IN) {
    return (
      <View style={styles.allBody}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          key="phoneNumber"
          value={form.phoneNumber}
          onChangeText={(value) => onChangeFormValue("phoneNumber", value)}
          style={styles.input}
          backgroundColor="#e6f0d5"
          placeholderTextColor="#818181"
          placeholder="Cell Phone"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signUpLink}>Don't have Account?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            console.log(
              `ParseInt output: ${parseInt(form.phoneNumber).toString().length}`
            );
            if (parseInt(form.phoneNumber).toString().length < 10) {
              Alert.alert("Invalid Phone Number: " + form.phoneNumber);
            } else {
              sendOTP();
            }
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (loggedInState == loggedInStates.LOGGING_IN) {
    return (
      <View style={styles.allBody}>
        <TextInput
          key="oneTimePassword"
          value={form.oneTimePassword}
          onChangeText={(value) => onChangeFormValue("oneTimePassword", value)}
          style={styles.input}
          placeholderTextColor="#818181"
          backgroundColor="#e6f0d5"
          placeholder="One Time Password"
          keyboardType="numeric"
        />
        {/* <View style={{...styles.allBody,flexDirection:"row"}}> */}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            setLoggedInState(loggedInStates.NOT_LOGGED_IN);
          }}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={{ color: "white" }}>Login</Text>
        </TouchableOpacity>
        {/* </View> */}
      </View>
    );
  }
  //you should never see this text
  else if (loggedInState == loggedInStates.LOGGED_IN) {
    return (
      <View>
        <Text>you logged in</Text>
      </View>
    );
  }
};

export default Login




const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  allBody: {
    marginTop: 150,
    marginLeft: 20,
    marginRight: 20
  },
  input: {
    height: 45,
    marginTop: 25,
    //  borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  margin: {
    marginTop: 100
  },
  bioButton: {
    alignItems: 'center',
    backgroundColor: '#A0CE4E',
    padding: 10,
    marginTop: 5,
    borderRadius: 10
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#A0CE4E',
    padding: 10,
    marginTop: 8,
    borderRadius: 10
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#A0CE4E',
    padding: 10,
    borderRadius: 10
  },
  title: {
    textAlign: "center",
    color: '#A0CE4E',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 35
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginTop: 100,
    justifyContent: 'center'
  },
  
  paragraph: {
    textAlign: 'center'
  },
  signUpButton: {
    padding: 10,
    alignItems: 'flex-end',
    borderRadius: 5,
  },
  signUpLink: {
    color: 'gray',
    textAlign: 'left',
    marginLeft: 0,
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2
  }

})
