const { DataTypes } = require('sequelize');
const db = require('../../../models');

db.sequelize.define(
  'Wallet',
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
    Seed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PrivateKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreateDateTime: {
      type: 'TIMESTAMP',
      defaultValue: db.Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default db;
