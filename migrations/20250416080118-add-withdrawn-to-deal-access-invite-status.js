"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add "Withdrawn" to the ENUM type for the "status" column in "deal_access_invites"
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_deal_access_invites_status" ADD VALUE 'Withdrawn';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: PostgreSQL does not allow removing values from an ENUM directly.
    // To remove the value, you would need to create a new ENUM type without the "Withdrawn" value
    // and migrate the column to use the new ENUM type. This is a complex process and is not included here.
  },
};