const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const QuestionAnswer = sequelize.define('QuestionAnswer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: true
    }, 
    status: {
        type: DataTypes.ENUM('pending', 'accept', 'reject'),
        allowNull: true,
        defaultValue: 'pending'
      }
}, {
    tableName: 'question_answers',
});

module.exports = QuestionAnswer;
