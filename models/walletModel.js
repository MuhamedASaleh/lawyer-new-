const {DataTypes} = require('sequelize');
const sequelize = require("../config/dbConfig");



const Wallet = sequelize.define('Wallet', {
    walletID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // userID: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'users', // Name of the User table
    //         key: 'userID'
    //     }
    // },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    currency: {
        type: DataTypes.STRING(3), // Assuming a 3-letter currency code (KWD, USD, EUR)
        allowNull: false,
        defaultValue: 'KWD'
    },
  
}, {
    tableName: 'wallets',
    // updatedAt: 'updatedAt', // Rename default updatedAt field to match the column name
    // createdAt: 'createdAt' // Rename default createdAt field to match the column name
    timeStamp :true
});
module.exports = Wallet ;