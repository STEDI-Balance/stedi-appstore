import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "react-native-onboarding-swiper";

export default function DeviceSetupOnboarding({
  visible,
  onFinish,
  onScanQR,
  onOpenStore
}) {
  const [hasDevice, setHasDevice] = useState(null);
  const [deviceId, setDeviceId] = useState("");

  if (!visible) return null;

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

      <Pressable
        accessibilityRole="button"
        onPress={() => onScanQR?.()}
        style={styles.ghostBtn}
      >
        <Text style={styles.ghostBtnIcon}>📷</Text>
        <Text style={styles.ghostBtnText}>Scan QR Code</Text>
      </Pressable>

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

      <Pressable
        accessibilityRole="button"
        style={[styles.primaryBtn, { opacity: deviceId.trim() ? 1 : 0.5 }]}
        disabled={!deviceId.trim()}
        onPress={() => onFinish?.({ hasDevice: true, deviceId })}
      >
        <Text style={styles.primaryBtnText}>Save</Text>
      </Pressable>
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

      <Pressable
        accessibilityRole="button"
        style={styles.primaryBtn}
        onPress={() => onOpenStore?.()}
      >
        <Text style={styles.primaryBtnText}>Go to Store</Text>
      </Pressable>
    </TopAlignedPage>
  );

  const pages = [
    { backgroundColor: "#F5F7FB", title: "", subtitle: "", image: CheckingDevice },
    { backgroundColor: "#F5F7FB", title: "", subtitle: "", image: SetupDevice },
    { backgroundColor: "#F5F7FB", title: "", subtitle: "", image: FindDevice }
  ];

  const handleDone = () => {
    if (hasDevice === false) onOpenStore?.();
    else onFinish?.({ hasDevice, deviceId });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Onboarding
          testID="onboarding-component"
          pages={pages}
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
            <Pressable accessibilityRole="button" style={styles.doneBtn} {...props}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          )}
          allowFontScaling
          controlStatusBar
          showSkip
        />
      </SafeAreaView>
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
  const toneStyle =
    tone === "danger" ? styles.bannerDanger : styles.bannerInfo;
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
  const activeStyle =
    tone === "yes" ? styles.pillYesActive : styles.pillNoActive;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.pill, active ? activeStyle : styles.pillNeutral]}
    >
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillEmoji}>{emoji}</Text>
    </Pressable>
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
    marginTop: 0
  },

  pageRoot: { flex: 1, alignSelf: "stretch" },
  pageScroll: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "stretch",
    gap: 14
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
    letterSpacing: 0.3
  },

  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#0F1D2B",
    marginTop: 6
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
    elevation: 2
  },
  bannerEmoji: { fontSize: 18 },
  bannerDanger: { backgroundColor: "#FDECEC", borderWidth: 1, borderColor: "#E8A5A5" },
  bannerInfo: { backgroundColor: "#EAF6EF", borderWidth: 1, borderColor: "#B9E0C5" },
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
    borderWidth: 1
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
    alignSelf: "flex-start"
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
    fontSize: 15
  },

  mapWrap: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E4EBF3",
    borderWidth: 1,
    borderColor: "#D3DEEA"
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
    elevation: 2
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  nextText: { fontSize: 16, paddingHorizontal: 12, paddingVertical: 6, color: "#0F1D2B" },
  skipText: { fontSize: 16, paddingHorizontal: 12, paddingVertical: 6, color: "#3E6BFF" },
  doneBtn: {
    backgroundColor: "#3E6BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  doneText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  hidden: { height: 0, opacity: 0 }
});
