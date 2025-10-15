import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Share, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Avatar, Title, Caption } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../utils/context";

const Profile = (props) => {
  const navigation = useNavigation();

  const {user} = useContext(UserContext);


  const myCustomerShare = async () => {
    try {
      await Share.share({ message: "This is a test" });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const avatarLabel = user.userName?.split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.header}>
              <Avatar.Text label={avatarLabel} size={72} />
              <View style={styles.userInfo}>
                <Text style={styles.title} numberOfLines={2}>{user.userName}</Text>
              </View>
            </View>

            <Text style={styles.indexScoreTitle}>Your Index Score balance progress</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Title>20</Title>
                <Caption>Weekly index score</Caption>
                <Text style={styles.subText}>random balance</Text>
              </View>

              <View style={styles.infoBox}>
                <Title>50</Title>
                <Caption>Monthly index score</Caption>
                <Text style={styles.subText}>random balance</Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.shareButton} onPress={myCustomerShare}>
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                  await AsyncStorage.removeItem("sessionToken");
                  await AsyncStorage.removeItem("onBoarded");
                  props.setLoggedInState("NOT_LOGGED_IN");
                  navigation.replace("Login");
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FB" },

  // page padding so cards can be full-width without fixed width
  scroll: { padding: 16, gap: 16, paddingBottom: 32 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    // use full width minus page padding
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2
  },
  cardContent: { gap: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  userInfo: {
    flex: 1,                 // take remaining space
    minWidth: 0              // allow text to shrink/wrap
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F1D2B",
    flexShrink: 1,           // prevents overflow on long emails
    flexWrap: "wrap"
  },

  indexScoreTitle: {
    color: "#7DB343",
    fontSize: 16,
    fontWeight: "800"
  },

  divider: {
    height: 1,
    backgroundColor: "#E4EAF2",
    width: "100%"
  },

  // two boxes side-by-side that wrap on small screens
  infoRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap"
  },
  infoBox: {
    flexGrow: 1,
    flexBasis: 160,
    gap: 2
  },
  subText: { color: "#334B61" },

  buttonsContainer: { marginTop: 8, gap: 12 },
  shareButton: {
    alignItems: "center",
    backgroundColor: "#67a3d9",
    paddingVertical: 12,
    borderRadius: 10
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" }
});
