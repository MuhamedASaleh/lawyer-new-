const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Case = sequelize.define('case', {
  caseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      'inspection',
      'court',
      'pleadings',
      'completed',
      'won',
      'lost',
      'pendingOne',
      'pendingTwo',
      'accepted',
      'decline'
    ],
    allowNull: false,
    defaultValue: 'pendingOne'
  },
  statusHistory: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [] // Initialize with an empty array
  },
  customer_files: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  lawyer_files: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  payment: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  judge_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lawyer_fees: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  court_fees: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      return parseFloat(this.getDataValue('lawyer_fees') || 0) + parseFloat(this.getDataValue('court_fees') || 0);
    },
    set(value) {
      throw new Error('Do not try to set the `total` value!');
    }
  },
  lawyerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'cases',
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true
  }
});

module.exports = Case;
