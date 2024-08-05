const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const OnlineUser = sequelize.define('OnlineUser', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isBusy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
  tableName: 'online_users',
});

module.exports = OnlineUser;
