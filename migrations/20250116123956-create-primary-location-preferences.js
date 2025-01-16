"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("primary_location_preferences", {
      preference_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      continent: {
        type: Sequelize.ENUM,
        values: [
          "North America",
          "Africa",
          "Europe",
          "Asia",
          "South America",
          "Australia",
          "Antarctica",
        ],
        allowNull: false,
      },
      country_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "countries",
          key: "country_id",
        },
      },
      region: {
        type: Sequelize.ENUM,
        values: [
          // Africa
          "Northern Africa",
          "Sub-Saharan Africa",
          "Western Africa",
          "Eastern Africa",
          "Central Africa",
          "Southern Africa",
          // Asia
          "East Asia",
          "Southeast Asia",
          "South Asia",
          "Central Asia",
          "Western Asia (Middle East)",
          // Europe
          "Northern Europe",
          "Southern Europe",
          "Eastern Europe",
          "Western Europe",
          // The Americas
          "North America",
          "Central America",
          "Caribbean",
          "South America",
          // Oceania
          "Australasia",
          "Melanesia",
          "Micronesia",
          "Polynesia",
          // Antarctica
          "Antarctica",
        ],
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("primary_location_preferences");
  },
};
