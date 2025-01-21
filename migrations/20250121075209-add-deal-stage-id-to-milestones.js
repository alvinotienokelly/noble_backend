'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('milestones', 'deal_stage_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'deal_stages',
        key: 'stage_id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('milestones', 'deal_stage_id');
  },
};
