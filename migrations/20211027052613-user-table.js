"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable("user", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user");
  },
};
