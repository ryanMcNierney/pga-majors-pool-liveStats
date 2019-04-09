// helper functions for scoreScraper.js
const { Player } = require('../db/index')

const parCheck = (position, par) => {
  let newPar
  if (position === 'WD') {
    newPar = 32
  } else if (position === 'CUT') {
    newPar = par + 16
  } else if (isNaN(par)) {
    newPar = 0
  } else {
    newPar = par
  }
  return newPar
}

const bonusCheck = (position) => {
  let bonus
  if (position === '1' || position === 'T1') {
    bonus = -10
  } else {
    bonus = 0
  }
  return bonus
}

const totalCheck = (position, totalNum) => {
  let total
  if (position === 'WD') {
    total = 320
  } else if (position === 'CUT') {
    total = totalNum + 160
  } else {
    total = totalNum
  }
  return total
}

// const getPlayers = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const lookUp = {}
//       await Player.findAll({ attributes: ['id', 'short_name'] }).then(data => {
//         for (let i = 0; i < data.length; i++) {
//           const { id, short_name } = data[i].dataValues
//           lookUp[short_name] = Number(id)
//         }
//         resolve(lookUp)
//       })
//     } catch (e) {
//       console.log('Error getting player lookup')
//       reject(e)
//     }

//   })
// }

const cleanForGoogle = (scoreTable) => {
  const googleArr = []
  for (let row in scoreTable) {
    if (row) {
      const { position, player, par, bonus, today, thru, rnd_1, rnd_2, rnd_3, rnd_4, total } = scoreTable[row]
      googleArr.push([position, player, par, bonus, today, thru, rnd_1, rnd_2, rnd_3, rnd_4, total])
    }
  }
  return googleArr
}

module.exports = { parCheck, bonusCheck, totalCheck, cleanForGoogle }
