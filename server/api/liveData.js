const router = require('express').Router()
const { liveDataON, liveDataOFF } = require('../scraper/scoreScraper')

//insert routes here
router.get('/:status', async (req, res) => {
  const status = req.params.status
  if (status === 'on') {
    await liveDataON()
    res.sendStatus(200)
  } else if (status === 'off') {
    await liveDataOFF()
    res.sendStatus(200)
  } else {
    res.status(400)
  }
})

module.exports = router
