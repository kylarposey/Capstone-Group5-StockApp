require('dotenv').config({ path: '../.env' });
const admin = require('firebase-admin');
const fs = require('fs');

// Path to your service account key
const serviceAccount = require('./group5-capstone-project-firebase-adminsdk-fbsvc-ad251cf412.json');

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// UID of the user to test as (currently an existing a test user google account)
const uid = process.env.TEST_UID; // located from Firebase console

// Generate a custom token
admin.auth().createCustomToken(uid)
  .then((customToken) => {
    console.log('Custom token generated:', customToken);
    // Save token to a file that your tests will read
    fs.writeFileSync('./test-token.txt', customToken);  //expires after 1 hour
  })
  .catch((error) => {
    console.error('Error creating custom token:', error);
  });