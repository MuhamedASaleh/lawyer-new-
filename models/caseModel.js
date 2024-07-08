import { DataTypes } from 'sequelize';

const sequelize = require("../config/dbConfig");


const Case = sequelize.define(

'case',{
    caseID :{
        type :DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement :true
    },
    status: {
        type: DataTypes.ENUM,
        values: [
          'inspection',   // فحص
          'court',       // محكمه
          'pleadings',   // مرافعات
          'completed',   // انتهاء
          'won',         // فوز
          'lost'         // خساره
        ],
        allowNull: false,
       
      },
      files: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payment: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      case_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }

},{
    
    timestamps: true
  }
);
module.exports =Case;