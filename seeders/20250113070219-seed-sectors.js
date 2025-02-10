"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert(
    //   "sectors",
    //   [
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Tech",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Finance",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Healthcare",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Energy",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Consumer Goods",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Industrial",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Real Estate",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Telecommunications",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Utilities",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       sector_id: Sequelize.literal("uuid_generate_v4()"),
    //       name: "Materials",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   {}
    // );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("sectors", null, {});
  },
};
