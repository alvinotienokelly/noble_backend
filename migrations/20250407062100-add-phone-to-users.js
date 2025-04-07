"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "phone", {
      type: Sequelize.STRING,
      allowNull: true, // Allow null if the phone number is optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "phone");
  },
};
