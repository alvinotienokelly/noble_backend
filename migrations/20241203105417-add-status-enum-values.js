'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the ENUM type to add new values
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_deals_status" ADD VALUE 'Open';
      ALTER TYPE "enum_deals_status" ADD VALUE 'Closed';
      ALTER TYPE "enum_deals_status" ADD VALUE 'On Hold';
      ALTER TYPE "enum_deals_status" ADD VALUE 'Closed & Reopened';
    `);
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL does not allow removing values from an ENUM directly.
    // In this case, you may need to create a new ENUM type without these values 
    // and migrate the columns to use the new type. Example steps:
    // 1. Create a new enum type with the desired values.
    // 2. Alter columns to use the new enum type.
    // 3. Drop the old enum type.

    // Example:
    // await queryInterface.sequelize.query(`
    //   CREATE TYPE "enum_deals_status_new" AS ENUM('Open', 'Closed', 'On Hold');
    //   ALTER TABLE deals ALTER COLUMN status TYPE "enum_deals_status_new" USING status::text::"enum_deals_status_new";
    //   DROP TYPE "enum_deals_status";
    //   ALTER TYPE "enum_deals_status_new" RENAME TO "enum_deals_status";
    // `);
  }
};
