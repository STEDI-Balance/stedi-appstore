import React, { useState, useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import Onboarding from "react-native-onboarding-swiper";
import { UserContext } from "../utils/context";
import { customTheme } from "../utils/Constants";

export default function DeviceSetupOnboarding({
  visible,
  onClose,
  onScanQR,
  onOpenStore,
}) {
  const [hasDevice, setHasDevice] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const { user, setUser, sessionToken } = useContext(UserContext);
  const [savingDevice, setSavingDevice] = useState(false);
  const [setupConcluded, setSetupConcluded] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(null);

  if (!visible || !user?.userName) return null;

  const onSaveDeviceId = async () => {
    if (!user.userName || !sessionToken || savingDevice) return;

    setSavingDevice(true);
    setDeviceStatus(null);

    const body = {
      deviceNickName: deviceId,
    };

    try {
      const response = await fetch(
        `https://dev.stedi.me/user/${user.userName}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            "suresteps.session.token": sessionToken,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const isConnected = await checkDeviceConnection();

        if (isConnected) {
          Alert.alert("Success", "Device ID saved successfully!");
          setSetupConcluded(true);
          setSavingDevice(false);
          setUser((prevUser) => ({
            ...prevUser,
            deviceNickName: deviceId,
          }));
          return;
        }

        setDeviceStatus(
          "Device ID saved, but no recent connection found. Please ensure your device is powered on and connected to the internet."
        );
        setSavingDevice(false);
      } else {
        console.log("Failed to save Device ID:", response.status);
        Alert.alert("Error", "Failed to save Device ID. Please try again.");
        setSavingDevice(false);
      }
    } catch (error) {
      console.log("Error saving Device ID:", error);
      Alert.alert(
        "Error",
        "An error occurred while saving Device ID. Please try again."
      );
      setSavingDevice(false);
    }
  };

  const checkDeviceConnection = async () => {
    if (!deviceId.trim() || !sessionToken) return;

    try {
      const response = await fetch(
        `https://dev.stedi.me/devices/updates/recent?seconds=120`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "suresteps.session.token": sessionToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const deviceConnection = data.find(
          (log) =>
            `${log.deviceId}`.trim().toLowerCase() ===
            deviceId.trim().toLowerCase()
        );
        if (deviceConnection) return true;
        return false;
      }
    } catch (error) {
      console.log("Error checking device connection:", error);
      return false;
    }
  };

  const handleDone = () => {
    setUser((prevUser) => ({
      ...prevUser,
      deviceNickName: deviceId,
    }));
    setSavingDevice(false);
    if (onClose) onClose({ hasDevice, deviceId });
  };

  const CheckingDevice = (
    <TopAlignedPage>
      <Kicker>Checking Device</Kicker>

      <Banner tone="danger" text="No Device Found" />

      <H1>Do you have a device with you?</H1>

      <View style={styles.choicesRow}>
        <Choice
          label="Yes"
          emoji="✅"
          active={hasDevice === true}
          onPress={() => setHasDevice(true)}
          tone="yes"
        />
        <Choice
          label="No"
          emoji="❌"
          active={hasDevice === false}
          onPress={() => setHasDevice(false)}
          tone="no"
        />
      </View>
    </TopAlignedPage>
  );

  const SetupDevice = (
    <TopAlignedPage>
      <Kicker>Setup Device</Kicker>
      <Banner tone="info" text="Make sure it’s plugged in" />
      <H1>Let’s set up your device!</H1>
      <Button
        mode="outlined"
        onPress={() => onScanQR?.()}
        icon="camera"
        style={styles.scanButton}
      >
        Scan QR Code
      </Button>
      <Text style={styles.help}>or enter your device ID</Text>
      <View style={{ gap: 6 }}>
        <Text style={styles.inputLabel}>Device ID</Text>
        <TextInput
          placeholder="eg. MN-145-U89010"
          placeholderTextColor="#8B9AAF"
          value={deviceId}
          onChangeText={setDeviceId}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>
      <Button
        mode="contained"
        disabled={!deviceId.trim() || savingDevice}
        onPress={onSaveDeviceId}
        loading={savingDevice}
        style={styles.saveButton}
      >
        Save
      </Button>
      {deviceStatus && <Text style={styles.deviceStatus}>{deviceStatus}</Text>}
    </TopAlignedPage>
  );

  const FindDevice = (
    <TopAlignedPage>
      <Kicker>Find Device</Kicker>
      <H1>Find your device!</H1>

      <View style={styles.mapWrap}>
        <Image
          source={{ uri: "https://placehold.co/1200x600/png?text=Map+Preview" }}
          style={styles.mapImg}
        />
      </View>

      <Text style={styles.help}>or buy one 🛒</Text>

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={() => onOpenStore?.()}
          icon="store"
          style={[styles.storeButton, styles.buttonInGroup]}
        >
          Go to Store
        </Button>

        <Button
          mode="text"
          onPress={handleSkipFromFindDevice}
          style={[styles.skipButton, styles.buttonInGroup]}
        >
          Skip for now
        </Button>
      </View>
    </TopAlignedPage>
  );

  // Dynamic pages based on device selection
  const getPages = () => {
    const checkingPage = {
      backgroundColor: "#F5F7FB",
      title: "",
      subtitle: "",
      image: CheckingDevice,
    };

    if (hasDevice === true) {
      return [
        checkingPage,
        {
          backgroundColor: "#F5F7FB",
          title: "",
          subtitle: "",
          image: SetupDevice,
        },
      ];
    } else if (hasDevice === false) {
      return [
        checkingPage,
        {
          backgroundColor: "#F5F7FB",
          title: "",
          subtitle: "",
          image: FindDevice,
        },
      ];
    } else {
      // Default: show only the checking device page until user makes a choice
      return [checkingPage];
    }
  };

  const handleSkipFromFindDevice = () => {
    onClose?.({ hasDevice: false, deviceId: "" });
  };

  const canConclude =
    hasDevice === false ||
    (hasDevice === true && deviceId.trim().length > 0 && setupConcluded);

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <Onboarding
            testID="onboarding-component"
            key={hasDevice}
            pages={getPages()}
            onSkip={handleDone}
            onDone={handleDone}
            containerStyles={styles.onboardingContainer}
            imageContainerStyles={styles.imageContainer}
            bottomBarColor="#F5F7FB"
            titleStyles={styles.hidden}
            subTitleStyles={styles.hidden}
            nextLabel={<Text style={styles.nextText}>Next</Text>}
            skipLabel={<Text style={styles.skipText}>Skip</Text>}
            DoneButtonComponent={(props) => (
              <TouchableOpacity
                disabled={!canConclude}
                style={[
                  styles.doneButton,
                  canConclude && styles.doneButtonDisabled,
                ]}
                {...props}
              >
                <Text style={[!canConclude && styles.doneButtonText]}>
                  Done
                </Text>
              </TouchableOpacity>
            )}
            allowFontScaling
            controlStatusBar
            showSkip={hasDevice === null}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function TopAlignedPage({ children }) {
  return (
    <View style={styles.pageRoot}>
      <ScrollView
        contentContainerStyle={styles.pageScroll}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

function Kicker({ children }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

function H1({ children }) {
  return <Text style={styles.h1}>{children}</Text>;
}

function Banner({ tone, text }) {
  const toneStyle = tone === "danger" ? styles.bannerDanger : styles.bannerInfo;
  const textStyle =
    tone === "danger" ? styles.bannerTextDanger : styles.bannerTextInfo;
  const emoji = tone === "danger" ? "❗" : "ℹ️";
  return (
    <View style={[styles.banner, toneStyle]}>
      <Text style={styles.bannerEmoji}>{emoji}</Text>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

function Choice({ label, emoji, active, onPress, tone }) {
  return (
    <Button
      mode={active ? "contained" : "outlined"}
      onPress={onPress}
      style={[
        styles.choiceButton,
        active && tone === "yes" && styles.choiceButtonYesActive,
        active && tone === "no" && styles.choiceButtonNoActive,
      ]}
      contentStyle={styles.choiceButtonContent}
    >
      <Text
        style={[active && tone === "no" && styles.choiceButtonTextNoActive]}
      >
        {label} {emoji}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FB" },

  onboardingContainer: { flex: 1, paddingHorizontal: 0 },
  imageContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: 0,
    marginTop: 0,
  },

  pageRoot: { flex: 1, alignSelf: "stretch" },
  pageScroll: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "stretch",
    gap: 14,
  },

  kicker: {
    alignSelf: "stretch",
    backgroundColor: "#2F4858",
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#0F1D2B",
    marginTop: 6,
  },

  banner: {
    alignSelf: "stretch",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerEmoji: { fontSize: 18 },
  bannerDanger: {
    backgroundColor: "#FDECEC",
    borderWidth: 1,
    borderColor: "#E8A5A5",
  },
  bannerInfo: {
    backgroundColor: "#EAF6EF",
    borderWidth: 1,
    borderColor: "#B9E0C5",
  },
  bannerTextDanger: { color: "#9B3B3B", fontWeight: "700" },
  bannerTextInfo: { color: "#2E6C44", fontWeight: "700" },

  choicesRow: { flexDirection: "row", gap: 12 },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  pillNeutral: { backgroundColor: "#FFFFFF", borderColor: "#C9D5E3" },
  pillYesActive: { backgroundColor: "#E8F5E9", borderColor: "#2E7D32" },
  pillNoActive: { backgroundColor: "#FFEBEE", borderColor: "#C62828" },
  pillLabel: { fontSize: 16, fontWeight: "700", color: "#0F1D2B" },
  pillEmoji: { fontSize: 18 },

  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#C9D5E3",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  ghostBtnIcon: { fontSize: 20 },
  ghostBtnText: { fontSize: 16, fontWeight: "600", color: "#0F1D2B" },

  help: { color: "#557089", marginTop: 6 },

  inputLabel: { fontSize: 12, color: "#526B84", paddingLeft: 2 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9D5E3",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },

  mapWrap: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E4EBF3",
    borderWidth: 1,
    borderColor: "#D3DEEA",
  },
  mapImg: { width: "100%", height: "100%", resizeMode: "cover" },

  primaryBtn: {
    backgroundColor: "#3E6BFF",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  nextText: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#0F1D2B",
  },
  skipText: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#3E6BFF",
  },

  doneText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  // Paper Button Styles
  scanButton: {
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  saveButton: {
    marginTop: 8,
  },
  storeButton: {
    marginTop: 8,
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  doneButtonDisabled: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: "#A0A0A0",
  },
  doneButtonText: {
    color: customTheme.colors.primary,
  },
  choiceButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  choiceButtonContent: {
    paddingVertical: 8,
  },
  choiceButtonYesActive: {
    backgroundColor: customTheme.colors.primary,
    color: "black",
  },
  choiceButtonNoActive: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#C62828",
    color: "black",
  },
  choiceButtonTextNoActive: {
    color: "black",
  },

  // Button group styles
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  buttonInGroup: {
    marginTop: 0,
  },
  skipButton: {
    alignSelf: "center",
  },

  hidden: { height: 0, opacity: 0 },
  deviceStatus: { color: "#D32F2F", marginTop: 8, fontWeight: "600" },
});
