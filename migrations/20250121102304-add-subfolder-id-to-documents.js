'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('documents', 'subfolder_id', {
    //   type: Sequelize.UUID,
    //   allowNull: true,
    //   references: {
    //     model: 'subfolders',
    //     key: 'subfolder_id',
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('documents', 'subfolder_id');
  },
};
