const { DataTypes } = require('sequelize');
const db = require('../../../models');

db.sequelize.define(
  'Withdrawal',
  {
    // Model attributes are defined here
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TokenName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreateDateTime: {
      type: 'TIMESTAMP',
      defaultValue: db.Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    TrxID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Amount: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    }
  },
  {
    timestamps: false,
  }
);

export default db;
