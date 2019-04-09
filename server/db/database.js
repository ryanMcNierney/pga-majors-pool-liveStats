const Sequelize = require('sequelize')

//insert database name below
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/pga-majors-pool', {
  logging: false
})

module.exports = db
