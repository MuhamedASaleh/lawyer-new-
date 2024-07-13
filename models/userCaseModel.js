

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const UserCase = sequelize.define('UserCase', {
    userCaseID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // userID: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'User', // Assuming your User model is named 'User'
    //         key: 'userID'
    //     }
    // },
    // caseID: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: 'Case', // Assuming your Case model is named 'Case'
    //         key: 'caseID'
    //     }
    // },
    role: {
        type: DataTypes.ENUM('customer', 'lawyer'),
        allowNull: false
    }
}, {
    tableName: 'userCases',
    timestamps: true
});

module.exports = UserCase;
