'use strict';

import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message, Client } from 'azure-iot-device';
import { AzureDeviceStatic,  AzureDevice } from './index';

export const AzureIotWindowStatic: AzureDeviceStatic = {
    deviceType: 'azure-iot-window',
    deviceFromConnectionString: (connectionString) => {
        return new AzureIotWindow(connectionString)
    }

}

export class AzureIotWindow implements AzureDevice {
    
    private client: Client;

    constructor(connectionString: string) {

        this.client = clientFromConnectionString(connectionString);

        this.client.open((err: any) => {
             if (err) {
                console.error('Could not connect: ' + err.message);
            } else {
                console.log('Client connected');
                
                this.client.on('message', (msg) => {
                    console.log(msg.getData().toString)
                })
            }
        });


    }
}