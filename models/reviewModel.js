const DataTypes = require("sequelize")
const sequelize = require("../config/dbConfig");


const Review = sequelize.define('Review', {
    reviewID: {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timeStamp :true,
    tableName: 'reviews'
});

module.exports = Review ;