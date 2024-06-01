const admin = require('firebase-admin');
const serviceAccount = require('./safify-7973d-firebase-adminsdk-rmnq2-f9dd82f582.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
module.exports = admin;