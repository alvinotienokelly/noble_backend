'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('documents', 'folder_id', {
    //   type: Sequelize.UUID,
    //   allowNull: true,
    //   references: {
    //     model: 'folders',
    //     key: 'folder_id',
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('documents', 'folder_id');
  },
};
