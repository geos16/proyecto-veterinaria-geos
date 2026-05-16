const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mascota = sequelize.define('Mascota', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  raza: {
    type: DataTypes.STRING
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY
  },
  edad: { 
  type: DataTypes.STRING 
  },
  sintomas: {
  type: DataTypes.TEXT, allowNull: false 
  },
  diagnostico: { type: DataTypes.TEXT 
  }
});

module.exports = Mascota;