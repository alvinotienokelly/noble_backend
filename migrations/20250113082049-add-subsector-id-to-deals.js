'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deals', 'subsector_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'subsectors',
        key: 'subsector_id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deals', 'subsector_id');
  },
};
