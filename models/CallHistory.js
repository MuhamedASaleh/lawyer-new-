const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const CallHistory = sequelize.define('CallHistory', {
  callerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
  },
  isVideoCall: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
  tableName: 'call_history',
});

module.exports = CallHistory;
