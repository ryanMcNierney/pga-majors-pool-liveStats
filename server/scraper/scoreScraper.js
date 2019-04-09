// get the live scores
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { fb } = require('../db/firebase')

// helper functions
const { parCheck, bonusCheck, totalCheck, getPlayers, cleanForGoogle } = require('./scoreUtils')
const { googleMain } = require('./sheetsUpdater')

const url = 'https://www.flashscore.com/golf/pga-tour/masters-tournament/'

const createScoreTable = async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.fs-table')
    const html = await page.content()
    const $ = cheerio.load(html)

    const scoreTable = {}
    const playerLookUp = await getPlayers()

    $('.table-main > table > tbody').children('tr').each((i, elem) => {
      // stats
      const position = $(elem).find('.cell_ra').text()
      const player = $(elem).find('.cell_ab').text()
      const par = parCheck(position, Number($(elem).find('.cell_sc').text()))
      const thru = $(elem).find('.cell_su').text()
      const today = Number($(elem).find('.cell_sw').text())
      const rnd_1 = (position === 'WD') ? 80 : Number($(elem).find('.cell_sd').text())
      const rnd_2 = (position === 'WD') ? 80 : Number($(elem).find('.cell_se').text())
      const rnd_3 = (position === 'CUT' || position === 'WD') ? 80 : Number($(elem).find('.cell_sf').text())
      const rnd_4 = (position === 'CUT' || position === 'WD') ? 80 : Number($(elem).find('.cell_sg').text())
      const totalNum = Number($(elem).find('.cell_sh').text()) // total helper
      const total = totalCheck(position, totalNum)

      // bonus check
      const bonus = bonusCheck(position)

      // lookup the player_id from Player postGres
      const id = playerLookUp[player]

      if (id) {
        scoreTable[id] = { id, player, position, bonus, par, thru, today, rnd_1, rnd_2, rnd_3, rnd_4, total }
      } else {
        console.log(player, 'is not in the postgres database')
      }

    })

    await browser.close()
    return scoreTable

  } catch (e) {
    console.log('Error', e)
  }
}

// add the table to firebase
const updateLiveData = async (scoreTable) => {
  const newArchiveKey = Date.now()
  try {
    let liveData
    await fb.ref('masters/live-data').once('value', snapshot => {
      liveData = snapshot.val()
    })
    // archive the current data then push to new
    if (liveData) {
      // get archiveRef & archiveCount
      const archiveRef = await fb.ref('masters/archive')
      let archiveCount = 0
      await archiveRef.child('count').once('value', snapshot => {
        if (snapshot.val()) {
          archiveCount = snapshot.val()
        }
      })

      // add live-data to archive & update count
      await archiveRef.child(newArchiveKey).set(liveData)
      archiveCount++

      // if archive > 5 remove oldest entry
      if (archiveCount > 5) {
        let oldestArchiveKey
        await archiveRef.once('value', snapshot => {
          const everything = snapshot.val()
          const keys = Object.keys(everything)
          oldestArchiveKey = keys[0]
        })
        await archiveRef.child(oldestArchiveKey).remove()
      } else {
        await archiveRef.child('count').set(archiveCount)
      }

      // set live-data with new scoreTable
      await fb.ref('masters/live-data-status').set(true)
      await fb.ref('masters/live-data').set(scoreTable, () => {
        console.log('Data updated to firebase live-data')
      })
      return newArchiveKey
    } else {
      await fb.ref('masters/live-data-status').set(true)
      await fb.ref('masters/live-data').set(scoreTable, () => {
        console.log('Data updated to firebase live-data')
      })
      await fb.ref('masters/archive/count').set(0)
      return newArchiveKey
    }
  } catch (e) {
    console.log('Error updating firebase live-data', e)
  }
}

// update google sheets
const updateGoogle = async (scoreTable) => {
  const batch = await cleanForGoogle(scoreTable)
  await googleMain(batch)
}

const updateData = async () => {
  const scoreTable = await createScoreTable()
  await updateLiveData(scoreTable)
  await updateGoogle(scoreTable)
}

const liveDataON = () => {
  updateData()
  console.log('----LIVE DATA IS ON----')
}

const liveDataOFF = () => {
  fb.ref('masters/live-data-status').set(false)
  console.log('----LIVE DATA IS OFF----')
}

module.exports = { liveDataON, liveDataOFF }
