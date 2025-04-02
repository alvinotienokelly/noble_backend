"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("countries", "region_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "regions", // Name of the table in the database
        key: "region_id", // Primary key in the Region model
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("countries", "region_id");
  },
};
