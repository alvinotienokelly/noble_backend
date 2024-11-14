'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('milestones', 'commission_amount', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });

    await queryInterface.addColumn('milestones', 'invoice_generated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('milestones', 'commission_amount');
    await queryInterface.removeColumn('milestones', 'invoice_generated');
  }
};
