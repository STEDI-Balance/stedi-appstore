import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function DeviceSetupOnboarding({ visible, onFinish }) {
  const pages = [
    { backgroundColor: '#fff', title: 'Step1' },
    { backgroundColor: '#fff', title: 'Step2' },
    { backgroundColor: '#fff', title: 'Step3' },
    { backgroundColor: '#fff', title: 'Step4' },
    { backgroundColor: '#fff', title: 'Step5' },
    { backgroundColor: '#fff', title: 'Step6' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Onboarding
        pages={pages}
        onSkip={onFinish}
        onDone={onFinish}
        containerStyles={styles.container}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
