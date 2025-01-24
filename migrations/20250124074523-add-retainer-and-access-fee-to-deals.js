"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("deals", "retainer_amount", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
    await queryInterface.addColumn("deals", "access_fee_amount", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("deals", "retainer_amount");
    await queryInterface.removeColumn("deals", "access_fee_amount");
  },
};
