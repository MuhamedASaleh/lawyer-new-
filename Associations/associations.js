

// const Admin = require('../models/adminModel');
// const Call = require("../models/callModel");
const Case = require("../models/caseModel");
// const News = require("../models/newsModel");
// const Notification = require("../models/notificationModel");
const Review = require("../models/reviewModel");
// const UserCase = require("../models/userCaseModel");
const User = require('../models/userModel');
const QuestionAnswer = require('../models/questionAnswerModel');
// const Wallet = require("../models/walletModel");

// relation between question and user
User.hasMany(QuestionAnswer, {foreignKey: 'userID',onDelete: 'CASCADE', // Cascade delete
  });
  
  QuestionAnswer.belongsTo(User, {
    foreignKey: 'userID',
    onDelete: 'CASCADE', // Cascade delete
  });

//   relation between user and case 
User.hasMany(Case, {
    foreignKey: 'lawyerId',
    onDelete: 'CASCADE',
  });
  
  User.hasMany(Case, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
  });
  
  Case.belongsTo(User, {
    foreignKey: 'lawyerId',
    onDelete: 'CASCADE',
  });
  
  Case.belongsTo(User, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
  });


  User.hasMany(QuestionAnswer, {foreignKey: 'userID',onDelete: 'CASCADE', // Cascade delete
  });
  
  QuestionAnswer.belongsTo(User, {
    foreignKey: 'userID',
    onDelete: 'CASCADE', // Cascade delete
  });



// Association for lawyerID
User.hasMany(Review, {
  foreignKey: 'lawyerID',
  onDelete: 'CASCADE',
  as: 'LawyerReviews'
});

Review.belongsTo(User, {
  foreignKey: 'lawyerID',
  onDelete: 'CASCADE',
  as: 'Lawyer'
});

// (async () => {
//     try {
//         await sequelize.sync({ alter: true }); // or { force: true } to drop and recreate tables
//         console.log('Database synced!');
//     } catch (error) {
//         console.error('Error syncing database:', error);
//     }
// })();

module.exports = {  Case,Review ,User ,QuestionAnswer };
