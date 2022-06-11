
import admin from "firebase-admin";
// const serviceAccount = "./media-storage-firebase-adminsdk.json"
import * as serviceAccount from './media-storage-firebase-adminsdk.json';
const serviceAccountKey = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    projectId: "media-storage-b4d60",
    storageBucket: "media-storage-b4d60.appspot.com"

    // credential: admin.credential.cert(<path to your firebase credentials file >),
    // storageBucket: <firebaseprojectid>.appspot.com
})

// Cloud storage
const bucket = admin.storage().bucket();

export default bucket;
