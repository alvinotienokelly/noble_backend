'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM type for the 'model' column
    await queryInterface.sequelize.query(`
      CREATE TYPE "model_enum" AS ENUM ('Yes', 'No');
    `);

    // Add new columns to the 'deals' table
    await queryInterface.addColumn('deals', 'ticket_size', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Modify this based on your requirements
    });

    await queryInterface.addColumn('deals', 'deal_lead', {
      type: Sequelize.STRING,
      allowNull: true,  // Modify this based on your requirements
    });

    await queryInterface.addColumn('deals', 'project', {
      type: Sequelize.STRING,
      allowNull: true,  // Modify this based on your requirements
    });

    await queryInterface.addColumn('deals', 'model', {
      type: Sequelize.ENUM('Yes', 'No'),
      allowNull: false,  // No null values, adjust as per requirements
      defaultValue: 'Yes', // Default to 'Yes'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns
    await queryInterface.removeColumn('deals', 'ticket_size');
    await queryInterface.removeColumn('deals', 'deal_lead');
    await queryInterface.removeColumn('deals', 'project');
    await queryInterface.removeColumn('deals', 'model');

    // Drop the ENUM type for 'model'
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "model_enum";');
  }
};
