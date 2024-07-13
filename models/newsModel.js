const DataTypes = require("sequelize")

const sequelize = require("../config/dbConfig");



const News = sequelize.define('News', {
    newsID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB, // Assuming the image is stored as a BLOB in the database
        allowNull: true
    },
   
}, {
    tableName: 'news',
    timeStamp :true
    // updatedAt: 'updatedAt', // Rename default updatedAt field to match the column name
    // createdAt: 'createdAt' // Rename default createdAt field to match the column name
});

module.exports = News
