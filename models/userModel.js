import { DataTypes } from 'sequelize';
const sequelize = require("../config/dbConfig");

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
        allowNull: false
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
        unique: true,
        allowNull: true,
        validate: {
            isNullForLawyer(value) {
                if (this.role === 'lawyer' && value !== null) {
                    throw new Error('National number must be null for lawyers');
                }
            }
        }
    },
    lawyer_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            isNullForCustomer(value) {
                if (this.role === 'customer' && value !== null) {
                    throw new Error('Lawyer price must be null for customers');
                }
            }
        }
    },
    specializations: {
        type: DataTypes.ENUM(
            'Criminal Law',              // القانون الجنائي
            'Civil Law',                 // القانون المدني
            'Commercial Law',            // القانون التجاري
            'Family Law',                // قانون الأسرة
            'International Law',         // القانون الدولي
            'Labor Law',                 // قانون العمل
            'Intellectual Property Law', // قانون الملكية الفكرية
            'Corporate Law',             // قانون الشركات
            'Administrative Law',        // القانون الإداري
            'Constitutional Law',        // القانون الدستوري
            'Tax Law',                   // قانون الضرائب
            'Environmental Law'          // قانون البيئة
        ),
        allowNull: true,
        validate: {
            isNullForCustomer(value) {
                if (this.role === 'customer' && value !== null) {
                    throw new Error('Specializations must be null for customers');
                }
            }
        }
    }
}, {
    tableName: 'users'
});

module.exports = User
