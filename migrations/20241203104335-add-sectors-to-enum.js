'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new values to the existing sector ENUM type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'Agriculture';
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'Aviation';
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'FMCG';
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'Hospitality';
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'Leasing';
      ALTER TYPE "enum_deals_sector" 
      ADD VALUE 'Water & Sanitation';
    `);
  },

  async down(queryInterface, Sequelize) {
    // If needed, you can remove the added values (though PostgreSQL does not support directly removing ENUM values)
    // You might need to drop and recreate the ENUM type if removing is required, which can be complex.
    // Here, we are keeping it simple and will not attempt to remove ENUM values.
  }
};
