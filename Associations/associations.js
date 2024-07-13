const Call = require("../models/callModel")
const Case = require("../models/caseModel")
const News =require ("../models/newsModel")
const Notification = require ("../models/notificationModel ")
const Review = require ("../models/reviewModel")
const User = require ("../models/userModel")
const UserCase = require ("../models/userCaseModel")
const Wallet = require ("../models/walletModel")
const sequelize = require ("../config/dbConfig")

sequelize.sync({force:true}
)
    .then(() => {
        console.log('Models synchronized successfully.');
    })
    .catch(error => {
        console.error('Error synchronizing models:', error);
    });
    
    module.exports = {Call,Case,News,Notification,Review,User,UserCase,Wallet} 