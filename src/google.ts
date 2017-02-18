import * as google from "googleapis";

// GOOGLE_APPLICATION_CREDENTIALS=./config/passwd/google.json

export interface GoogleFileMeta {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
}

export type GoogleFileListCallback = (files: GoogleFileMeta[]) => void;

export class GoogleApi {

    private driveApi: any;

    constructor() {
        this.initGoogleApis();
    }

    listFiles(callback: GoogleFileListCallback) {
        this.driveApi.files.list("", function (err, result) {
                if (err) {
                    console.error(err);
                    throw Error("Failed to list files");
                }
                callback(result.files);
            });
    }

    private initGoogleApis() {

        let _self = this;

        google.auth.getApplicationDefault(function(err, authClient) {
            if (err) {
            console.log(err);
            }

            if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                authClient = authClient.createScoped([
                'https://www.googleapis.com/auth/drive'
                ]);
            }
            
            _self.driveApi = google.drive({
                version: 'v3',
                auth: authClient
            });
        });
    }
}
