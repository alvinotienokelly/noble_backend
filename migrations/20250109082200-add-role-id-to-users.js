'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('users', 'role_id', {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'roles',
    //     key: 'role_id',
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role_id');
  },
};
