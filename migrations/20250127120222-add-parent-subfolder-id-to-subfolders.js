'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('subfolders', 'parent_subfolder_id', {
    //   type: Sequelize.UUID,
    //   allowNull: true,
    //   references: {
    //     model: 'subfolders',
    //     key: 'subfolder_id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subfolders', 'parent_subfolder_id');
  },
};
