'use strict';

import * as devices from './devices';
import * as iothub from 'azure-iothub';

//TODO move this to the config
const deviceConfig: devices.DeviceMappingEntry[] =  [{
    deviceId: 'iot-window',
    deviceType: devices.AzureIotWindowStatic.deviceType
},{
    deviceId: 'iot-fake-temp',
    deviceType: devices.AzureIotTemperatureSensorStatic.deviceType
}]


if(process.argv.length < 4) {
    console.error("Missing Azuure IOT Hub Parameters:");
    console.error("[1] HostName");
    console.error("[2] Registry Access Key");
} else {
    let hostName = process.argv[2]
    let registryAccessKey = process.argv[3];
    let connectionString = `HostName=${hostName};SharedAccessKeyName=iothubowner;SharedAccessKey=${registryAccessKey}`
    let registry = iothub.Registry.fromConnectionString(connectionString);

    let logger = devices.AzureIotMessageLoggerStatic.deviceFromConnectionString(connectionString);

    deviceConfig.forEach(d => {
        let deviceCreator = startDevice(hostName, d.deviceType);
        //Try to get an existing device from the registry
        registry.get(d.deviceId, (err, deviceInfo) => {
            if(err) {
                //Create the device if it is new
                let device = new iothub.Device(null);
                device.deviceId = d.deviceId;
                registry.create(device, deviceCreator);
            } else {
                deviceCreator(err, deviceInfo);
            }
        })
    })    
}

function startDevice(hostName: string, deviceType: string) {
    return (error: Error, deviceInfo: iothub.Device) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Creating Device with ID: ' + deviceInfo.deviceId);
            let deviceConnectionString = `HostName=${hostName};DeviceId=${deviceInfo.deviceId};SharedAccessKey=${deviceInfo.authentication.symmetricKey.primaryKey}`;
            devices.DeviceTypeRegistry.lookup(deviceType).deviceFromConnectionString(deviceConnectionString);
        }

    }
}