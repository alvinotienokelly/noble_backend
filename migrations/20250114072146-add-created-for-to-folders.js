'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('folders', 'created_for', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'users',
    //     key: 'id',
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('folders', 'created_for');
  },
};
