import { AzureDeviceStatic, AzureIotWindowStatic, AzureIotMessageLoggerStatic, AzureIotTemperatureSensorStatic } from './index';

export interface DeviceMappingEntry {
    deviceType: string;
    deviceId: string;
}

const allTypes: AzureDeviceStatic[] = [
    AzureIotWindowStatic,
    AzureIotMessageLoggerStatic,
    AzureIotTemperatureSensorStatic
]

export const DeviceTypeRegistry = {
    lookup: function(deviceType: string) {
        return allTypes.find(x => x.deviceType === deviceType) || undefined;
    }
} 


