
import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message, Client } from 'azure-iot-device';
import { AzureDeviceStatic,  AzureDevice } from './index';

export const AzureIotTemperatureSensorStatic: AzureDeviceStatic = {
    deviceType: 'azure-iot-temperature',
    deviceFromConnectionString: (connectionString) => {
        return new AzureIotTemperatureSensor(connectionString)
    }

}

export class AzureIotTemperatureSensor implements AzureDevice {
    
    constructor(connectionString: string) {

        let client = clientFromConnectionString(connectionString);

        client.open((err: any) => {
             if (err) {
                console.error('Could not connect: ' + err.message);
            } else {
                setInterval(() => {
                    let fakeTemperature = 19 + (Math.random() * 5);
                    let msg = new Message(JSON.stringify({deviceId: 'temp', temperature: fakeTemperature}));
                    client.sendEvent(msg, (error, response) => {
                        if (error) {
                            console.error(error.message);
                        } else {
                            console.log('temp sent: ' + fakeTemperature);
                        }
                    })
                }, 4000)
            }
        });


    }
}