import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function DeviceSetupOnboarding({ visible, onFinish }) {
  if (!visible) return null;

  const pages = [
    { backgroundColor: '#0B1220', title: 'Step 1', subtitle: 'Turn on the device and enable Bluetooth.' },
    { backgroundColor: '#0B1220', title: 'Step 2', subtitle: 'Open the app and sign in.' },
    { backgroundColor: '#0B1220', title: 'Step 3', subtitle: 'Go to Device Setup and tap Add New.' },
    { backgroundColor: '#0B1220', title: 'Step 4', subtitle: 'Choose your device model.' },
    { backgroundColor: '#0B1220', title: 'Step 5', subtitle: 'Wait for pairing to finish.' },
    { backgroundColor: '#0B1220', title: 'Step 6', subtitle: 'Tap Done to start using it.' }
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.fullscreen}>
        <Onboarding
          testID="onboarding-component"
          pages={pages.map(p => ({
            backgroundColor: p.backgroundColor,
            title: '',
            subtitle: '',
            image: (
              <View style={styles.card}>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.subtitle}>{p.subtitle}</Text>
              </View>
            )
          }))}
          onSkip={onFinish}
          onDone={onFinish}
          containerStyles={styles.container}
          bottomBarColor="#0B1220"
          titleStyles={styles.hidden}
          subTitleStyles={styles.hidden}
          imageContainerStyles={styles.imageWrap}
          nextLabel={<Text style={styles.nextText}>Next</Text>}
          skipLabel={<Text style={styles.skipText}>Skip</Text>}
          DoneButtonComponent={(props) => (
            <Pressable accessibilityRole="button" style={styles.doneBtn} {...props}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          )}
          controlStatusBar
          showSkip
          allowFontScaling
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#dfe2e7ff'
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '90%',
    backgroundColor: '#121A2B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E9EEF7',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: '#B9C4D6',
    lineHeight: 22,
    textAlign: 'center'
  },
  nextText: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#D0D9E8',
    textAlign: 'center'
  },
  skipText: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#89A2FF',
    textAlign: 'center'
  },
  doneBtn: {
    backgroundColor: '#4F7BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  hidden: { height: 0, opacity: 0 }
});
