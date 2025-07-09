import {useMemo, useState} from "react";
import {PermissionsAndroid, Platform} from "react-native";
import {BleManager} from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";

const BLE_UUID = "00000dba-0000-0e30-0b00-0e0000000000";
const BLE_CHARACTERISTIC = "00001212-0000-1000-8000-00805f9b34fb";

function useBLE({setBleCharacteristic}) {
    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                return await requestAndroid31Permissions();
            }
        } else {
            return true;
        }
    };

    const isDuplicateDevice = (devices, nextDevice) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("Scanning for Devices");
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes("STEDI")) {
                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const connectToDevice = async (device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            await bleManager.stopDeviceScan();
            await startStreamingData(deviceConnection);
            console.log("Connected to Device: ", deviceConnection.id);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            setBleCharacteristic(0);
        }
    };

    const onHeartRateUpdate = (error, characteristic) => {
        if (error) {
            console.log(error);
            return -1;
        } else if (!characteristic?.value) {
            console.log("No Data was received");
            return -1;
        }

        const rawData = base64.decode(characteristic.value);
        let BleChar = rawData.charCodeAt(0);

        setBleCharacteristic(BleChar);
        console.log("BLE Characteristic: "+BleChar);
    };

    const startStreamingData = async (device) => {
        if (device) {
            device.monitorCharacteristicForService(
                BLE_UUID,
                BLE_CHARACTERISTIC,
                onHeartRateUpdate
            );
        } else {
            console.log("No Device Connected");
        }
    };

    return {
        scanForPeripherals,
        requestPermissions,
        connectToDevice,
        allDevices,
        connectedDevice,
        disconnectFromDevice,
    };
}

export default useBLE;