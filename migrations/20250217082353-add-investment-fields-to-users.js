"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn("users", "total_investments", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "average_check_size", {
    //   type: Sequelize.DECIMAL,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "successful_exits", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "portfolio_ipr", {
    //   type: Sequelize.DECIMAL,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("users", "description", {
    //   type: Sequelize.TEXT,
    //   allowNull: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "total_investments");
    await queryInterface.removeColumn("users", "average_check_size");
    await queryInterface.removeColumn("users", "successful_exits");
    await queryInterface.removeColumn("users", "portfolio_ipr");
    await queryInterface.removeColumn("users", "description");
  },
};
