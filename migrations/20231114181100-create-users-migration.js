'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kyc_status: {
        type: Sequelize.ENUM,
        values: ['Pending', 'Verified', 'Rejected'],
        defaultValue: 'Pending',
      },
      preference_sector: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      preference_region: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: ['Investor', 'Administrator', 'Target Company'],
        allowNull: false,
        defaultValue: 'Investor',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
