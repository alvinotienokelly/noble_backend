'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding new values to the existing ENUM type for "sector"
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Technology';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Services';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Manufacturing';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Construction';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Education';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Financial Services';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Bar and Restaurant';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Housing';
      ALTER TYPE "enum_deals_sector" ADD VALUE 'Retail';
    `);
  },

  async down(queryInterface, Sequelize) {
    // To undo the change, you would need to create a new ENUM type
    // and alter the table to use that type instead, since PostgreSQL
    // doesn't allow removal of values from an ENUM type.
  }
};
