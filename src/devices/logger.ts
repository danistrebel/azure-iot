import { Client } from 'azure-event-hubs';
import { AzureDeviceStatic,  AzureDevice } from './index';

export const AzureIotMessageLoggerStatic: AzureDeviceStatic = {
    deviceType: 'azure-iot-message-logger',
    deviceFromConnectionString: (connectionString) => {
        return new AzureIotMessageLogger(connectionString)
    }
}

export class AzureIotMessageLogger implements AzureDevice {
    
    constructor(connectionString: string) {

        console.log(connectionString);

        let logMessage = this.logMessage;

        let client = Client.fromConnectionString(connectionString);

        client.open()
            .then(client.getPartitionIds.bind(client))
            .then(function (partitionIds) {
                return partitionIds.map(function (partitionId) {
                    return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                            receiver.on('errorReceived', error => logMessage(error.message))
                            receiver.on('message', msg => logMessage(JSON.stringify(msg.body)));
                            console.log('logger created for ' + partitionId)

                    });
                });
            })
            .catch(err => logMessage(err.message));
    }

    private logMessage(msg) {
        let d = (new Date()).toISOString()
        console.log(`${d}: ${msg}`)
    }
}