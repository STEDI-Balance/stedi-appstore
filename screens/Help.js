import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "react-native-paper";

const Help = ({ sessionToken }) => {
  const [subject, setSubject] = useState("Contact"); // keep something sensible
  const [notification, setNotification] = useState(null);
  const [name, setName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [messageText, setMessageText] = useState("");

  const canSubmit = name.trim() && toAddress.trim() && messageText.trim();

  const submit = async () => {
    try {
      await fetch("https://dev.stedi.me/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "suresteps.session.token": sessionToken
        },
        body: JSON.stringify({
          name: name.trim(),
          toAddress: toAddress.trim(),
          subject,
          messageText: messageText.trim()
        })
      });
      setNotification("Thanks for submitting!");
      setToAddress("");
      setName("");
      setMessageText("");
    } catch (error) {
      console.log("error", error);
      setNotification("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.content}>
            <Text style={styles.header}>Contact us</Text>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="eg. Jane Doe"
                placeholderTextColor="#8B9AAF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@email.com"
                placeholderTextColor="#8B9AAF"
                value={toAddress}
                onChangeText={setToAddress}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            {/* Message */}
            <View style={styles.field}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Type your message..."
                placeholderTextColor="#8B9AAF"
                value={messageText}
                onChangeText={setMessageText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {notification ? <Text style={styles.notice}>{notification}</Text> : null}

            <TouchableOpacity
              onPress={submit}
              disabled={!canSubmit}
              style={[styles.button, !canSubmit && { opacity: 0.5 }]}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FB" },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2
  },
  content: { gap: 14 },
  header: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F1D2B",
    marginBottom: 4
  },
  field: { gap: 6 },
  label: { fontSize: 12, color: "#526B84", paddingLeft: 2 },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9D5E3",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15
  },
  multiline: { minHeight: 120 },
  notice: { color: "#2E6C44", fontWeight: "600" },
  button: {
    backgroundColor: "#A0CE4E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" }
});
