const DataTypes = require("sequelize")
const sequelize = require("../config/dbConfig");


const Notification = sequelize.define('Notification', {
    notificationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // userID: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'users', // Assuming 'users' is the name of your User table
    //         key: 'userID'
    //     }
    // },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Default to unread
    },
  
}, {
    tableName: 'notifications',
    updatedAt: 'updatedAt', // Rename default updatedAt field to match the column name
    createdAt: 'createdAt' // Rename default createdAt field to match the column name
});
module.exports = Notification;