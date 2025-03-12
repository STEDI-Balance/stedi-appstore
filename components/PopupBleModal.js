import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DeviceModal from "../DeviceConnectionModal";
import useBLE from '../useBLE';

/**
 * Component that handles the BLE device connection modal.
 * Scans for BLE devices and prompts the user to connect to a device.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setBleCharacteristic - Function to set the BLE characteristic.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @component
 *
 * @example
 * return (
 *   <PopupBleModal setBleCharacteristic={setBleCharacteristic} />
 * )
 */
const PopupBleModal = ({setBleCharacteristic}) => {
  const [connectionPromptVisible, setConnectionPromptVisible] = useState(true);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE({setBleCharacteristic});

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    console.log('Permission Enabled after requesting: '+isPermissionsEnabled);
    if (isPermissionsEnabled) {
      await scanForPeripherals();
    }
  };

  const hideModal = () => {
    setDeviceModalVisible(false);
    setConnectionPromptVisible(false);
  };

  const openModal = async () => {
    await scanForDevices();
    setDeviceModalVisible(true);
  };


  return (
    // !connectedDevice ? (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={connectionPromptVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setConnectionPromptVisible(!connectionPromptVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <View>


                <Text style={styles.titleText}>Please Connect to a BLE Device</Text>
            </View>
            <View style={styles.twoButtons}>
              <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openModal}
                style={[styles.button, styles.buttonOpen, styles.button2]}
              >
                <Text style={styles.textStyle}>
                  {connectedDevice ? "Disconnect" : "Connect"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={hideModal}
                style={[styles.button, styles.buttonClose, styles.button2]}
              >
                <Text style={styles.textStyle}>Skip</Text>
              </TouchableOpacity>
              <DeviceModal
                closeModal={hideModal}
                visible={deviceModalVisible}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
    // ) : null
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  button: {
    borderRadius:5,
    padding: 10,
     margin:5
  },
  buttonOpen: {
    backgroundColor: '#67a3d9',
  },
  buttonClose: {
    backgroundColor:'#67a3d9',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button2:{
 margin:5,
  },
  twoButtons:{
    flexDirection: "row" ,
    justifyContent: 'space-evenly'
  }
});

export default PopupBleModal;
