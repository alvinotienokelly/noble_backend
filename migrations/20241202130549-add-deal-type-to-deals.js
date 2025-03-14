'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('deals', 'deal_type', {
    //   type: Sequelize.ENUM,
    //   values: ["Equity", "Debt", "Equity and Debt"],
    //   allowNull: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'deal_type');
  },
};
