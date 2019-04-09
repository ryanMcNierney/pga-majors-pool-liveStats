const { google } = require('googleapis')

const googleMain = (batch) => {
  try {
    // configure a JWT auth client
    let jwtClient = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets'])

    //authenticate request
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully connected!')
      }
    })

    const data = [{ range: 'liveData!A4:L90', values: batch }]
    const resource = { data, valueInputOption: 'USER_ENTERED' }

    // write to google sheet
    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.batchUpdate({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource
    }, (err, result) => {
      if (err) {
        console.log('Error writing to google sheet', err)
      } else {
        console.log(`${result.data.totalUpdatedRows} rows updated`)
      }
    })

    // write the last pull time
    const time = new Date(Date.now()).toLocaleTimeString()
    const timeValue = [[time]]
    const timeResource = { values: timeValue }

    sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource: timeResource,
      range: 'liveData!B1',
      valueInputOption: 'USER_ENTERED'
    }, (err) => {
      if (err) {
        console.log('Error writing TIME to google sheet', err)
      } else {
        console.log(`Time cell updated`)
      }
    })
  } catch (e) {
    console.log('Error writing data to Google', e)
  }
}

module.exports = { googleMain }
