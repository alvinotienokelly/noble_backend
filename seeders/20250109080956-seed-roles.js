"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert(
    //   "roles",
    //   [
    //     {
    //       role_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Administrator",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       role_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Investor",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       role_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Target Company",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   {}
    // );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
