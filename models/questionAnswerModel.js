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
}, {
    tableName: 'question_answers',
});

module.exports = QuestionAnswer;
