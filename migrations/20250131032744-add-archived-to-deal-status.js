'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.sequelize.query(`
    //   ALTER TYPE "enum_deals_status" ADD VALUE 'Archived';
    // `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: Removing a value from an ENUM type is not straightforward in PostgreSQL.
    // You may need to recreate the ENUM type without the 'Archived' value if necessary.
  },
};
