import { AzureDeviceStatic, AzureIotWindowStatic} from './index';

export interface DeviceMappingEntry {
    deviceType: string;
    deviceId: string;
}

const allTypes: AzureDeviceStatic[] = [
    AzureIotWindowStatic
]

export const DeviceTypeRegistry = {
    lookup: function(deviceType: string) {
        return allTypes.find(x => x.deviceType === deviceType) || undefined;
    }
} 


