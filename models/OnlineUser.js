const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Update with the correct path to your Sequelize instance

const OnlineUser = sequelize.define('OnlineUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  socketId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  isBusy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'onlineUser', // Specify the table name
  timestamps: true, // Handles `createdAt` and `updatedAt` automatically
});

module.exports = OnlineUser;
