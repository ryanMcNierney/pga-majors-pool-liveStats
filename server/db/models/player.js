const db = require('../database')
const Sequelize = require('sequelize')

const Player = db.define('players', {
  short_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  long_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  profile: {
    type: Sequelize.STRING,
    allowNull: false
  },
  img: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  wgr: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fix_wgr: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  masters: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  usOpen: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  theOpen: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  pgaChamp: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Player
