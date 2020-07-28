const Sequelize = require('sequelize');

const sequelize = new Sequelize('groupomania', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
    } catch (err) {
        throw new Error('Something went wrong')
    }
}

module.exports = { sequelize, dbConnection }