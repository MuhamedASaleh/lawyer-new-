const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Admin = sequelize.define('Admin', {
    adminID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    national_number: {
        type: DataTypes.STRING(20),
        unique: false,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'super_admin'),
        allowNull: false,
        defaultValue: 'admin'
    }
}, {
    tableName: 'admins',
    timestamps: true,
});

module.exports = Admin;
