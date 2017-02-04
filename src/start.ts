'use strict';

import { AzureIotWindowStatic, DeviceMappingEntry, DeviceTypeRegistry } from './devices';
import * as iothub from 'azure-iothub';

//TODO move this to the config
const devices: DeviceMappingEntry[] =  [{
    deviceId: 'iot-window',
    deviceType: AzureIotWindowStatic.deviceType
}]


if(process.argv.length < 4) {
    console.error("HostName and Registry Access Key");
} else {
    let hostName = process.argv[2]
    let registryAccessKey = process.argv[3];
    let connectionString = `HostName=${hostName};SharedAccessKeyName=registryReadWrite;SharedAccessKey=${registryAccessKey}`
    let registry = iothub.Registry.fromConnectionString(connectionString);

    devices.forEach(d => {
        let deviceCreator = startDevice(hostName, d.deviceType);
        registry.get(d.deviceId, (err, deviceInfo) => {
            if(err) {
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
            let connectionString = `HostName=${hostName};DeviceId=${deviceInfo.deviceId};SharedAccessKey=${deviceInfo.authentication.symmetricKey.primaryKey}`;
            DeviceTypeRegistry.lookup(deviceType).deviceFromConnectionString(connectionString);
        }

    }
}