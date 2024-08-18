const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Admin = sequelize.define('Admin', {
    adminID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
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
