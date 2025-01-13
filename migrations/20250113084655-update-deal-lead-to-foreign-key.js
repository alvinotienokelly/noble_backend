'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing deal_lead column
    await queryInterface.removeColumn('deals', 'deal_lead');

    // Add the deal_lead column with the correct type and foreign key constraint
    await queryInterface.addColumn('deals', 'deal_lead', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the deal_lead column with the foreign key constraint
    await queryInterface.removeColumn('deals', 'deal_lead');

    // Add the deal_lead column back with the original type
    await queryInterface.addColumn('deals', 'deal_lead', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
