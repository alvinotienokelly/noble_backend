"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("document_types", [
      {
        type_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Information Memorandum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type_id: Sequelize.literal("uuid_generate_v4()"),
        name: "NDA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Financial Model",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("document_types", null, {});
  },
};
