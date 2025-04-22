"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("deals", {
      deal_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sector: {
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
      },
      region: {
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
      deal_stage: {
        type: Sequelize.ENUM,
        values: ["Due Diligence", "Term Sheet", "Closed"],
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          "Active",
          "Pending",
          "Open",
          "On Hold",
          "Inactive",
          "Closed",
          "Closed & Reopened",
          "Archived", // Add Archived status
        ],
        allowNull: false,
        defaultValue: "Open",
      },
      deal_size: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      target_company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      key_investors: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      visibility: {
        type: Sequelize.ENUM,
        values: ["Public", "Private"],
        defaultValue: "Public",
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("deals");
  },
};
