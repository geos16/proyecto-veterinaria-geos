const { Sequelize } = require('sequelize');
require('dotenv').config();

// Si existe la variable DATABASE_URL, estamos en la nube (Render)
const sequelize = process.env.DATABASE_URL
 ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Requisito para certificados de Render
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false
      }
    );

module.exports = sequelize;