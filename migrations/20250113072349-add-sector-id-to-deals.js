'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deals', 'sector_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'sectors',
        key: 'sector_id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'sector_id');
  },
};
