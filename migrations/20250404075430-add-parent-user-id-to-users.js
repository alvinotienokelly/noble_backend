"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "parent_user_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users", // Reference the same users table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "parent_user_id");
  },
};
