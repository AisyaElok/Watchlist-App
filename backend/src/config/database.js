const admin = require('firebase-admin')

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('../../serviceAccountKey.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://watchlistapp-lokiie-default-rtdb.asia-southeast1.firebasedatabase.app'
  })
}

const db = admin.database()
module.exports = db