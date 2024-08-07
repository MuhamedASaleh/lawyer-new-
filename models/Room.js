const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Update this with the path to your database configuration

const Room = sequelize.define('Room', {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  callerSocketID: {
    type: DataTypes.STRING,
    allowNull: true
  },
  calleeSocketID: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'rooms'
});

module.exports = Room;
