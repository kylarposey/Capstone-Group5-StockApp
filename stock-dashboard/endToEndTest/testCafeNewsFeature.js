require('dotenv').config({ path: '../.env' });

import { Selector, ClientFunction } from 'testcafe';
import admin from 'firebase-admin';
import fs from 'fs';

// Initialize Firebase Admin SDK (server-side authentication)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require('./group5-capstone-project-firebase-adminsdk-fbsvc-ad251cf412.json'))
    });
}
const test_uid = process.env.TEST_UID; // located from Firebase console

console.log('test_uid', test_uid);

// Generate a Firebase custom auth token
const generateCustomToken = async () => {
    return await admin.auth().createCustomToken('test_uid');
};

// Function to authenticate in the browser
const authenticateWithCustomToken = ClientFunction(async (token) => {
    return window.firebase.auth().signInWithCustomToken(token)
        .then(() => true)
        .catch(error => {
            console.error('Auth error:', error);
            return false;
        });
});

const waitForFirebase = ClientFunction(() => {
   return new Promise((resolve) => {
       const checkFirebase = setInterval(() => {
           if (window.firebase && window.firebase.auth) {
               clearInterval(checkFirebase);
               resolve(true);
           }
       }, 100);
   });
});

fixture `News Feature Test with Custom Authentication`
  .page `http://localhost:3000`
  .beforeEach(async t => {
    const customToken = await generateCustomToken();

    // ✅ Wait for Firebase to initialize
    await t.expect(waitForFirebase()).ok('Firebase not initialized');

    // Authenticate using the token
    const success = await authenticateWithCustomToken(customToken);
    await t.expect(success).ok('Failed to authenticate with Firebase');

    // Wait for auth state update
    await t.wait(2000);
});

test('Test news feature as authenticated user', async t => {
  const newsLink = Selector('#trends-link');
  await t
    .click(newsLink)
    .expect(Selector('.news-card').exists).ok('News cards not found');
});
