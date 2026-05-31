const admin = require('firebase-admin')

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://watchlistapp-lokiie-default-rtdb.asia-southeast1.firebasedatabase.app',
    httpAgent: new (require('https').Agent)({ keepAlive: false })
  })
}

const db = admin.database()
module.exports = db