import { View } from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import { Button } from "react-native-paper";
import * as React from "react";

const SignUp = () => {
    //Consts
    const [checked, setChecked] = React.useState(false);

    //Colors
    const textColor = '#FFFFFF';
    const backgroundColor = 'rgb(30, 30, 30)';
    const inputBoarderColor = 'rgb(100, 100, 100)';
    const labelTextColor = 'rgb(250, 250, 250)';
    const buttonColor = 'rgb(61, 83, 209)';

  return (
  <View style={{ backgroundColor, padding: 20, flex: 1 }}>

    {/* Title */}
    <Text 
        style={
            {fontWeight: 'bold', color: textColor, marginBottom: 20}
        }
        variant="headlineSmall">Sign Up
    </Text>

    {/* Email */}
    <TextInput style={{ marginBottom: 20 }} label="Email" mode="outlined" outlineColor={inputBoarderColor} theme={{ colors: { background: backgroundColor, text: labelTextColor } }} />

    {/* Birthday */}
    <TextInput style={{ marginBottom: 20 }} label="Birthday" mode="outlined" outlineColor={inputBoarderColor} theme={{ colors: { background: backgroundColor, text: labelTextColor } }} />

    {/* Phone Number */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <View style={{ width: 50, marginRight: 10 }}/>
      <TextInput style={{ flex: 1 }} label="Phone Number" mode="outlined" outlineColor={inputBoarderColor} theme={{ colors: { background: backgroundColor, text: labelTextColor } }}
      />
    </View>

    {/* Password */}
    <TextInput style={{ marginBottom: 20 }} label="Password" mode="outlined" secureTextEntry outlineColor={inputBoarderColor} theme={{ colors: { background: backgroundColor, text: labelTextColor } }} right={<TextInput.Icon icon="eye" />} />

    {/* Confirm Password */}
    <TextInput style={{ marginBottom: 20 }} label="Confirm Password" mode="outlined" secureTextEntry outlineColor={inputBoarderColor} theme={{ colors: { background: backgroundColor, text: labelTextColor } }} right={<TextInput.Icon icon="eye" />} />

    {/* Check box one */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
            setChecked(!checked);
        }}
        />
        <Text style={{ color: textColor }}>I consent to receive messages via SMS. (Message and data rates may apply. Reply STOP to opt out.)</Text>
    </View>

    {/* Check box two */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
            setChecked(!checked);
        }}
        />
        <Text style={{ color: textColor }}>I confirm that I have read and agree to STEDI's Privacy Policy, Terms of Use, and Cookie Policy.</Text>
    </View>

    {/* Spacer */}
    <View style={{ flex: 1 }} />

    {/* Sign Up Button */}
    <Button mode="contained" onPress={() => console.log('Pressed')} buttonColor={buttonColor}>
        Sign Up
    </Button>
  </View>
  );
}

export default SignUp;