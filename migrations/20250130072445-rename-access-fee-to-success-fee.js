'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.renameColumn('deals', 'access_fee_amount', 'success_fee');
    // await queryInterface.addColumn('deals', 'success_fee_percentage', {
    //   type: Sequelize.DECIMAL,
    //   allowNull: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('deals', 'success_fee', 'access_fee_amount');
    await queryInterface.removeColumn('deals', 'success_fee_percentage');
  },
};
