const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://watchlistapp-lokiie-default-rtdb.asia-southeast1.firebasedatabase.app'
  })
}

const db = admin.database()
module.exports = db