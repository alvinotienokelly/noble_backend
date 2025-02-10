'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('documents', 'document_type_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'document_types',
        key: 'type_id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('documents', 'document_type_id');
  },
};