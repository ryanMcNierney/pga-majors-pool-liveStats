// firebase init
const Firebase = require('firebase')
require('firebase/database')
if (process.env.NODE_ENV !== 'production') require('../../.env')

Firebase.initializeApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  storageBucket: process.env.FB_STORAGE_BUCKET
})

const fb = Firebase.database()
console.log('----Firebase Initialized----')

module.exports = { fb }
