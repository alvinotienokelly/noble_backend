'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('countries', [
      { country_id: Sequelize.literal('uuid_generate_v4()'), name: 'United States', code: 'US', createdAt: new Date(), updatedAt: new Date() },
      { country_id: Sequelize.literal('uuid_generate_v4()'), name: 'Canada', code: 'CA', createdAt: new Date(), updatedAt: new Date() },
      { country_id: Sequelize.literal('uuid_generate_v4()'), name: 'United Kingdom', code: 'GB', createdAt: new Date(), updatedAt: new Date() },
      { country_id: Sequelize.literal('uuid_generate_v4()'), name: 'Australia', code: 'AU', createdAt: new Date(), updatedAt: new Date() },
      { country_id: Sequelize.literal('uuid_generate_v4()'), name: 'Germany', code: 'DE', createdAt: new Date(), updatedAt: new Date() },
      
      // Add more countries as needed
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};
