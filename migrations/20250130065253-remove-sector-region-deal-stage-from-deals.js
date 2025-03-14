"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn("deals", "sector");
    // await queryInterface.removeColumn("deals", "region");
    // await queryInterface.removeColumn("deals", "deal_stage");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("deals", "sector", {
      type: Sequelize.ENUM,
      values: [
        "Tech",
        "Finance",
        "Healthcare",
        "Energy",
        "Consumer Goods",
        "Industrial",
        "Real Estate",
        "Telecommunications",
        "Utilities",
        "Materials",
      ],
      allowNull: false,
    });
    await queryInterface.addColumn("deals", "region", {
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
    });
    await queryInterface.addColumn("deals", "deal_stage", {
      type: Sequelize.ENUM,
      values: ["Due Diligence", "Term Sheet", "Closed"],
      allowNull: false,
    });
  },
};
