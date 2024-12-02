'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deals', 'maximum_selling_stake', {
      type: Sequelize.ENUM,
      values: ["Minority", "Majority"],
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'maximum_selling_stake');
  },
};
