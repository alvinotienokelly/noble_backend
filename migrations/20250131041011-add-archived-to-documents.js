'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('documents', 'archived', {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('documents', 'archived');
  },
};
