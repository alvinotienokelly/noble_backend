"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add "Full Stake" to the ENUM type
    // await queryInterface.sequelize.query(`
    //   ALTER TYPE "enum_deals_maximum_selling_stake" ADD VALUE 'Full';
    // `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: Removing a value from an ENUM type is not straightforward in PostgreSQL.
    // You may need to recreate the ENUM type without the "Full Stake" value if necessary.
  },
};
