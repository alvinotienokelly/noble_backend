"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("deals", "image_url", {
      type: Sequelize.STRING,
      allowNull: true, // Image is not mandatory
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("deals", "image_url");
  },
};
