"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "addressable_market", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "current_market", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "total_assets", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "ebitda", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "gross_margin", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "cac_payback_period", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "tam", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "sam", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "som", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "year_founded", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "addressable_market");
    await queryInterface.removeColumn("users", "current_market");
    await queryInterface.removeColumn("users", "total_assets");
    await queryInterface.removeColumn("users", "ebitda");
    await queryInterface.removeColumn("users", "gross_margin");
    await queryInterface.removeColumn("users", "cac_payback_period");
    await queryInterface.removeColumn("users", "tam");
    await queryInterface.removeColumn("users", "sam");
    await queryInterface.removeColumn("users", "som");
    await queryInterface.removeColumn("users", "year_founded");
    await queryInterface.removeColumn("users", "location");
  },
};
