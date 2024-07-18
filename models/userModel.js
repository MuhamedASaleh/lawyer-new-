const DataTypes = require("sequelize");
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
        allowNull: true,
        unique:false
    },
    lawyer_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
  
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
        
    },
    certification: {
        type: DataTypes.STRING,
        allowNull: true,
    
    }
}, {
    tableName: 'users'
});

// Add hooks to enforce validation


module.exports = User;
