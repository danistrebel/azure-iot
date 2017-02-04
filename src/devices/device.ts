export interface AzureDevice { }

export interface AzureDeviceStatic {
    deviceType: string;
    deviceFromConnectionString: (connectionString: string) => AzureDevice;
}
