'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('permissions', [
      { permission_id: Sequelize.literal('uuid_generate_v4()'), name: 'CREATE_DEAL', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: Sequelize.literal('uuid_generate_v4()'), name: 'UPDATE_DEAL', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: Sequelize.literal('uuid_generate_v4()'), name: 'DELETE_DEAL', createdAt: new Date(), updatedAt: new Date() },
      { permission_id: Sequelize.literal('uuid_generate_v4()'), name: 'VIEW_DEAL', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
