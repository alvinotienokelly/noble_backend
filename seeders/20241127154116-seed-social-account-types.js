'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('social_account_types', [
       { type_id: Sequelize.literal('uuid_generate_v4()'), name: 'X', createdAt: new Date(), updatedAt: new Date() },
      { type_id: Sequelize.literal('uuid_generate_v4()'), name: 'LinkedIn', createdAt: new Date(), updatedAt: new Date() },
      { type_id: Sequelize.literal('uuid_generate_v4()'), name: 'Facebook', createdAt: new Date(), updatedAt: new Date() },
      { type_id: Sequelize.literal('uuid_generate_v4()'), name: 'Instagram', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('social_account_types', null, {});
  },
};