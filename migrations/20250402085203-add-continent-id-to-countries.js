"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("countries", "continent_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "continents", // Name of the table in the database
        key: "continent_id", // Primary key in the Continent model
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("countries", "continent_id");
  },
};
