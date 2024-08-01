const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const { type } = require('../Validations/userValidator');

const User = sequelize.define('User', {
  userID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM('customer', 'lawyer'),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  confirm_password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  personal_image: {
    type: DataTypes.BLOB
  },
  national_number: {
    type: DataTypes.STRING(20),
  },
  lawyer_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
//   averageRating:{
//     type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             min: 1,
//             max: 5
//         }
//   },
  specializations: {
    type: DataTypes.ENUM(
      'Criminal Law',
      'Civil Law',
      'Commercial Law',
      'Family Law',
      'International Law',
      'Labor Law',
      'Intellectual Property Law',
      'Corporate Law',
      'Administrative Law',
      'Constitutional Law',
      'Tax Law',
      'Environmental Law'
    ),
    allowNull: true,
  },
  certification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accept', 'reject'),
    allowNull: true,
    defaultValue: null,
    validate: {
      isStatusValid(value) {
        if (this.role === 'lawyer' && !value) {
          throw new Error('Status is required for lawyers');
        }
      }
    }
  }
}, {
  tableName: 'user',
  hooks: {
    beforeValidate: (user) => {
      if (user.role === 'customer') {
        user.status = null; // Clear status if role is customer
      } else if (user.role === 'lawyer' && !user.status) {
        user.status = 'pending'; // Set status to pending if role is lawyer
      }
    }
  }
});

module.exports = User;
